import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getDueCount } from '../store/db'

export default function Home(){
  const [due, setDue] = useState(0)

  useEffect(()=>{
    const unsub = getDueCount(setDue)
    return ()=>unsub && unsub()
  },[])

  return (
    <div className="card">
      <h2 style={{marginTop:0}}>Bem-vindo 👋</h2>
      <p className="muted">Escreva notas de estudo e revise com repetição espaçada. Simples e eficiente.</p>
      <div className="row" style={{marginTop:12}}>
        <Link className="btn primary" to="/new">➕ Criar Nota</Link>
        <Link className="btn success" to="/review">
          🔔 Revisar Notas {due > 0 && <span className="badge">{due}</span>}
        </Link>
      </div>
    </div>
  )
}