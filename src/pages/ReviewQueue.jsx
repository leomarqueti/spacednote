import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { subscribeDueNotes } from '../store/db'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function ReviewQueue(){
  const [notes, setNotes] = useState([])

  useEffect(()=>{
    const unsub = subscribeDueNotes(setNotes)
    return ()=>unsub && unsub()
  },[])

  return (
    <div className="card">
      <h2 style={{marginTop:0}}>Revisões pendentes</h2>
      {notes.length === 0 && <p className="muted">Sem notas pendentes agora. Bom trabalho! 🎉</p>}
      <div className="grid" style={{marginTop:12}}>
        {notes.map(n => (
          <div key={n.id} className="note">
            <div>
              <strong>{n.title}</strong>
              <div className="muted" style={{fontSize:13}}>
                Criada {formatDistanceToNow(n.createdAt?.toDate ? n.createdAt.toDate() : new Date(n.createdAt), { addSuffix:true, locale: ptBR })}
              </div>
            </div>
            <Link className="btn" to={`/note/${n.id}`}>Lembrar →</Link>
          </div>
        ))}
      </div>
    </div>
  )
}