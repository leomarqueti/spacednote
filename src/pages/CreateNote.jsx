import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { addNote } from '../store/db'
import 'react-quill/dist/quill.snow.css'
import ReactQuill from 'react-quill'

export default function CreateNote(){
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const navigate = useNavigate()

  const modules = useMemo(()=>({ toolbar: [
    [{ header: [1,2,3,false]}],
    ['bold','italic','underline','strike'],
    [{ list:'ordered' }, { list:'bullet' }],
    ['link','clean']
  ]}), [])

  async function onSave(){
    if(!title.trim()){ alert('Dê um título para a nota ✍️'); return }
    await addNote({ title, content })
    navigate('/')
  }

  return (
    <div className="card">
      <h2 style={{marginTop:0}}>Nova nota</h2>
      <label className="muted">Título</label>
      <input type="text" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Ex.: Aprendizado Ativo" />
      <div style={{height:8}} />
      <label className="muted">Escreva ativamente sobre o conteúdo</label>
      <ReactQuill theme="snow" value={content} onChange={setContent} modules={modules} />
      <div className="row" style={{marginTop:12}}>
        <button className="btn primary" onClick={onSave}>Salvar</button>
        <button className="btn ghost" onClick={()=>history.back()}>Cancelar</button>
      </div>
    </div>
  )
}