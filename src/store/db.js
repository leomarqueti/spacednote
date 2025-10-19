import { db } from './firebase'
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'
import { nextReviewDate, STAGES } from '../lib/spaced'

const NOTES = 'notes'

function assertDB() {
  if (!db) {
    throw new Error('Firestore não configurado. Edite src/store/firebase.js com suas credenciais.')
  }
}

// 🟢 Cria uma nova nota
export async function addNote({ title, content }) {
  assertDB()
  const next = nextReviewDate(0)
  await addDoc(collection(db, NOTES), {
    title,
    content,
    createdAt: serverTimestamp(),
    reviewStage: 0,
    nextReview: next,
    mastered: false,
  })
}

// 🟢 Escuta notas que precisam ser revistas
export function subscribeDueNotes(cb) {
  assertDB()

  const q = query(
    collection(db, NOTES),
    where('mastered', '==', false),
    orderBy('nextReview', 'asc')
  )

  let latestNotes = []

  const unsub = onSnapshot(q, (snap) => {
    latestNotes = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }))
    // reavaliar imediatamente quando o snapshot mudar
    checkDueAndNotify()
  })

  function checkDueAndNotify() {
    const now = new Date()
    console.log('📅 Hora local (checagem):', now.toLocaleString())

    const dueNotes = latestNotes.filter((n) => {
      const next = n.nextReview?.toDate ? n.nextReview.toDate() : (n.nextReview ? new Date(n.nextReview) : null)
      return next && next <= now
    })

    console.log(`🧩 Total de notas encontradas: ${latestNotes.length}`)
    console.log(`⏰ Notas vencidas para revisão: ${dueNotes.length}`)

    cb(dueNotes)
  }

  // timer para detectar notas que vencem com a passagem do tempo
  const timer = setInterval(checkDueAndNotify, 15000)

  // retorna função de cleanup
  return () => {
    unsub()
    clearInterval(timer)
  }
}

// 🟢 Conta quantas notas estão prontas pra revisão
export function getDueCount(cb) {
  return subscribeDueNotes((list) => cb(list.length))
}

// 🟢 Busca uma nota específica
export async function getNoteById(id) {
  assertDB()
  const ref = doc(db, NOTES, id)
  const snap = await getDoc(ref)
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

// 🟢 Atualiza nota após revisão
export async function finalizeReview(note) {
  assertDB()
  const ref = doc(db, NOTES, note.id)
  const nextStage = (note.reviewStage ?? 0) + 1
  const isMastered = nextStage >= STAGES.length
  await updateDoc(ref, {
    reviewStage: nextStage,
    mastered: isMastered,
    nextReview: isMastered ? null : nextReviewDate(nextStage),
  })
}

// 🟢 Deleta nota
export async function deleteNote(id) {
  assertDB()
  await deleteDoc(doc(db, NOTES, id))
}
