import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getNoteById, finalizeReview, deleteNote } from '../store/db'

export default function NoteDetail(){
  const { id } = useParams()
  const [note, setNote] = useState(null)
  const [showContent, setShowContent] = useState(false)
  const navigate = useNavigate()

  useEffect(()=>{
    (async()=>{ setNote(await getNoteById(id)) })()
  },[id])

  if(!note) return <div className="card"><p className="muted">Carregando…</p></div>

  async function handleFinalize(){
    await finalizeReview(note)
    navigate('/review')
  }

  async function handleDelete(){
    if(confirm('Excluir esta nota? Esta ação não pode ser desfeita.')){
      await deleteNote(note.id)
      navigate('/')
    }
  }

  return (
    <div className="card">
      <h2 style={{marginTop:0}}>{note.title}</h2>
      {!showContent ? (
        <>
          <p className="muted">Tente lembrar o que você escreveu <strong>sem olhar</strong>. Quando estiver pronto, revele o conteúdo.</p>
          <button className="btn" onClick={()=>setShowContent(true)}>Revelar conteúdo</button>
        </>
      ) : (
        <div className="prose" dangerouslySetInnerHTML={{__html: note.content || '<p>(sem conteúdo)</p>'}} />
      )}
      <div className="row" style={{marginTop:12}}>
        <button className="btn success" onClick={handleFinalize}>Finalizar revisão</button>
        <button className="btn" onClick={()=>history.back()}>Voltar</button>
        <button className="btn" style={{background:'#ef4444', borderColor:'#7f1d1d'}} onClick={handleDelete}>Excluir</button>
      </div>
      <p className="muted" style={{marginTop:8}}>Estágio atual: {note.reviewStage ?? 0}</p>
    </div>
  )
}