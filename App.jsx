import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import CreateNote from './pages/CreateNote'
import ReviewQueue from './pages/ReviewQueue'
import NoteDetail from './pages/NoteDetail'

export default function App(){
  const { pathname } = useLocation()
  return (
    <div className="container">
      <header className="topbar">
        <div className="logo">🧠 SpacedNotes</div>
        {pathname !== '/' && <Link to="/" className="btn ghost">← Voltar</Link>}
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new" element={<CreateNote />} />
        <Route path="/review" element={<ReviewQueue />} />
        <Route path="/note/:id" element={<NoteDetail />} />
      </Routes>
      <footer className="muted" style={{marginTop:16}}>
        <small>Notion‑style, leve, com repetição espaçada. Ajuste os intervalos em <code>src/lib/spaced.js</code>.</small>
      </footer>
    </div>
  )
}