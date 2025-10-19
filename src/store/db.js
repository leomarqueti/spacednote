import { db } from './firebase'
import { collection, addDoc, serverTimestamp, onSnapshot, query, where, orderBy, getDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { nextReviewDate, STAGES } from '../lib/spaced'

const NOTES = 'notes'

function assertDB(){
  if(!db){ throw new Error('Firestore não configurado. Edite src/store/firebase.js com suas credenciais.') }
}

export async function addNote({title, content}){
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

export function subscribeDueNotes(cb){
  assertDB()
  const now = new Date()
  const q = query(
    collection(db, NOTES),
    where('mastered', '==', false),
    where('nextReview', '<=', now),
    orderBy('nextReview', 'asc')
  )
  return onSnapshot(q, (snap)=> cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
}

export function getDueCount(cb){
  return subscribeDueNotes(list => cb(list.length))
}

export async function getNoteById(id){
  assertDB()
  const ref = doc(db, NOTES, id)
  const snap = await getDoc(ref)
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function finalizeReview(note){
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

export async function deleteNote(id){
  assertDB()
  await deleteDoc(doc(db, NOTES, id))
}