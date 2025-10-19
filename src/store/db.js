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
  Timestamp
} from 'firebase/firestore'

import { nextReviewDate, STAGES } from '../lib/spaced'

const NOTES = 'notes'

function assertDB() {
  if (!db) {
    throw new Error('Firestore não configurado. Edite src/store/firebase.js com suas credenciais.')
  }
}

// 🟢 Cria nova nota
export async function addNote({ title, content }) {
  assertDB()
  const next = nextReviewDate(0)
  await addDoc(collection(db, NOTES), {
    title,
    content,
    createdAt: serverTimestamp(),
    reviewStage: 0,
    nextReview: next,
    mastered: false
  })
}

// 🟣 Inscreve para ouvir notas que já estão no prazo
export function subscribeDueNotes(cb) {
  assertDB()

  const now = new Date()
  // Corrige para UTC e converte para Timestamp do Firestore
  const offsetNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000)
  const firestoreNow = Timestamp.fromDate(offsetNow)

  const q = query(
    collection(db, NOTES),
    where('mastered', '==', false),
    where('nextReview', '<=', firestoreNow),
    orderBy('nextReview', 'asc')
  )

  return onSnapshot(q, (snap) => {
    const notes = snap.docs.map((d) => ({
      id: d.id,
      ...d.data()
    }))

    // Log útil para depuração
    console.log('🕒 Horário atual local:', now.toLocaleString())
    notes.forEach((n) => {
      console.log(
        '📘',
        n.title,
        '| Revisão em:',
        n.nextReview?.toDate?.().toLocaleString?.() || n.nextReview
      )
    })

    cb(notes)
  })
}

// 🧮 Conta quantas notas estão no prazo
export function getDueCount(cb) {
  assertDB()

  const now = new Date()
  const offsetNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000)
  const firestoreNow = Timestamp.fromDate(offsetNow)

  const q = query(
    collection(db, NOTES),
    where('mastered', '==', false),
    where('nextReview', '<=', firestoreNow)
  )

  return onSnapshot(q, (snap) => cb(snap.size))
}

// 🔍 Busca nota por ID
export async function getNoteById(id) {
  assertDB()
  const ref = doc(db, NOTES, id)
  const snap = await getDoc(ref)
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

// ✅ Finaliza uma revisão e agenda a próxima
export async function finalizeReview(note) {
  assertDB()
  const ref = doc(db, NOTES, note.id)
  const nextStage = (note.reviewStage ?? 0) + 1
  const isMastered = nextStage >= STAGES.length
  await updateDoc(ref, {
    reviewStage: nextStage,
    mastered: isMastered,
    nextReview: isMastered ? null : nextReviewDate(nextStage)
  })
}

// ❌ Apaga nota
export async function deleteNote(id) {
  assertDB()
  await deleteDoc(doc(db, NOTES, id))
}
