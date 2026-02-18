import { useState, useEffect } from 'react'

function App() {
  const [objetivos, setObjetivos] = useState([])
  const [nuevoTexto, setNuevoTexto] = useState('')
  const API_URL = 'https://backend-objetivos-salta.onrender.com/objetivos'

  const cargar = async () => {
    try {
      const res = await fetch(API_URL)
      const data = await res.json()
      setObjetivos(data)
    } catch (err) { console.error(err) }
  }

  useEffect(() => { cargar() }, [])

  const agregar = async () => {
    if (!nuevoTexto) return
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texto: nuevoTexto })
    })
    setNuevoTexto(''); cargar()
  }

  const borrar = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    cargar()
  }

  const editar = async (id, actual) => {
    const nuevo = prompt("Editar:", actual)
    if (nuevo && nuevo !== actual) {
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto: nuevo })
      })
      cargar()
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 font-sans">
      <div className="max-w-md mx-auto bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-700">
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">TaskMaster Pro</h1>
        <div className="flex gap-2 mb-8">
          <input className="flex-1 bg-slate-900 p-3 rounded-xl outline-none border border-slate-700 focus:border-indigo-500" value={nuevoTexto} onChange={(e)=>setNuevoTexto(e.target.value)} placeholder="¿Nueva misión?" />
          <button onClick={agregar} className="bg-indigo-600 px-5 py-3 rounded-xl font-bold">+</button>
        </div>
        <ul className="space-y-3">
          {objetivos.map(obj => (
            <li key={obj.id} className="flex justify-between items-center bg-slate-700/50 p-4 rounded-xl border border-slate-600">
              <span>{obj.texto}</span>
              <div className="flex gap-2">
                <button onClick={() => editar(obj.id, obj.texto)}>✏️</button>
                <button onClick={() => borrar(obj.id)}>🗑️</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
export default App