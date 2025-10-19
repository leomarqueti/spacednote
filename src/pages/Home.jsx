import { Link } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { getDueCount } from '../store/db'
import { timeUntil } from '../lib/timeUntil'
import { collection, getDocs, query, where, orderBy } from "firebase/firestore"
import { db } from '../store/firebase'

export default function Home() {
  const [due, setDue] = useState(0)
  const [next, setNext] = useState(null)

  useEffect(() => {
    const unsub = getDueCount(setDue)

    async function fetchNext() {
      // Busca todas as notas não masterizadas, ordenadas por nextReview
      const q = query(
        collection(db, 'notes'),
        where('mastered', '==', false),
        orderBy('nextReview', 'asc')
      )
      
      const snap = await getDocs(q)
      const notes = snap.docs.map(d => ({ 
        id: d.id, 
        ...d.data(),
        nextReview: d.data().nextReview?.toDate?.() || new Date(d.data().nextReview)
      }))

      // Encontra a próxima nota a ser revisada
      if (notes.length > 0) {
        const now = new Date()
        const nextNote = notes.find(n => n.nextReview > now) || notes[0]
        setNext(nextNote.nextReview)
      }
    }

    // Busca inicial
    fetchNext()
    
    // Atualiza a cada minuto
    const timer = setInterval(fetchNext, 60000)
    
    return () => {
      unsub?.()
      clearInterval(timer)
    }
  }, [])

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Bem-vindo 👋</h2>
      <p className="muted">
        Escreva notas de estudo e revise com repetição espaçada. Simples e eficiente.
      </p>

      {next && (
        <div style={{ marginTop: 12 }}>
          <p style={{ margin: 0 }}>
            🕒 <strong>Próxima revisão {timeUntil(next)}</strong>
          </p>
          <p className="muted" style={{ fontSize: 13, marginTop: 2 }}>
            ({next.toLocaleString('pt-BR')})
          </p>
        </div>
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
