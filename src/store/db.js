export function subscribeDueNotes(cb) {
  assertDB()

  const now = new Date()

  // 🔧 Corrige o fuso horário (UTC → local)
  const offsetNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000)

  const q = query(
    collection(db, NOTES),
    where('mastered', '==', false),
    where('nextReview', '<=', offsetNow),
    orderBy('nextReview', 'asc')
  )

  const unsub = onSnapshot(q, (snap) => {
    const notes = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }))

    // 🧠 Log pra depurar se quiser ver horários comparados
    console.log('🕒 Horário local:', now.toLocaleString())
    notes.forEach((n) => {
      console.log(
        '→',
        n.title,
        n.nextReview?.toDate?.().toLocaleString?.() || n.nextReview
      )
    })

    cb(notes)
  })

  return unsub
}

export function getDueCount(cb) {
  assertDB()

  const now = new Date()
  const offsetNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000)

  const q = query(
    collection(db, NOTES),
    where('mastered', '==', false),
    where('nextReview', '<=', offsetNow)
  )

  return onSnapshot(q, (snap) => cb(snap.size))
}
