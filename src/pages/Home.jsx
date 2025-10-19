import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getDueCount } from '../store/db'
import { timeUntil } from '../lib/timeUntil'
import { collection, getDocs } from "firebase/firestore"
import { db } from '../store/firebase'

export default function Home() {
  const [due, setDue] = useState(0)
  const [next, setNext] = useState(null)

  useEffect(() => {
    const unsub = getDueCount(setDue)

    // Buscar a nota com a próxima revisão mais próxima
    async function fetchNext() {
      const snap = await getDocs(collection(db, 'notes'))
      const notes = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      const future = notes.filter(n => n.nextReview)

      if (future.length > 0) {
        const nextReview = future.sort(
          (a, b) => new Date(a.nextReview) - new Date(b.nextReview)
        )[0].nextReview
        setNext(nextReview)
      }
    }

    fetchNext()
    return () => unsub && unsub()
  }, [])

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Bem-vindo 👋</h2>
      <p className="muted">
        Escreva notas de estudo e revise com repetição espaçada. Simples e eficiente.
      </p>

      {next && (
        <p style={{ marginTop: 12 }}>
          🕒 <strong>Próxima revisão {timeUntil(next)}</strong>
        </p>
      )}

      <div className="row" style={{ marginTop: 12 }}>
        <Link className="btn primary" to="/new">➕ Criar Nota</Link>
        <Link className="btn success" to="/review">
          🔔 Revisar Notas {due > 0 && <span className="badge">{due}</span>}
        </Link>
      </div>
    </div>
  )
}
