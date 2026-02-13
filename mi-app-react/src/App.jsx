import { useState, useEffect } from 'react'

function App() {
  const [objetivos, setObjetivos] = useState([])
  const [nuevoTexto, setNuevoTexto] = useState('')
  
  // Tu URL de Render (Ya no es localhost!)
  const API_URL = 'https://backend-objetivos-salta.onrender.com/objetivos'

  const cargar = async () => {
    try {
      const res = await fetch(API_URL)
      const data = await res.json()
      setObjetivos(data)
    } catch (err) {
      console.error("Error conectando con Render:", err)
    }
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
    const nuevo = prompt("Editar objetivo:", actual)
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
    <div className="min-h-screen bg-slate-900 text-white p-4 md:p-12 font-sans">
      <div className="max-w-md mx-auto bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-700">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            TaskMaster Pro
          </h1>
          <p className="text-slate-400 mt-2 text-sm uppercase tracking-widest">Salta - Full Stack 2026</p>
        </header>
        
        <div className="flex gap-3 mb-10">
          <input 
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
            value={nuevoTexto} 
            onChange={(e)=>setNuevoTexto(e.target.value)} 
            placeholder="Escribe tu próxima misión..." 
          />
          <button 
            onClick={agregar}
            className="bg-indigo-600 hover:bg-indigo-500 hover:shadow-[0_0_15px_rgba(79,70,229,0.4)] px-6 py-4 rounded-xl font-bold transition-all active:scale-95"
          >
            +
          </button>
        </div>

        <ul className="space-y-4">
          {objetivos.map(obj => (
            <li key={obj.id} className="group flex justify-between items-center bg-slate-900/50 p-5 rounded-2xl border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300">
              <span className="text-slate-200 font-medium">{obj.texto}</span>
              <div className="flex gap-3">
                <button onClick={() => editar(obj.id, obj.texto)} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">✏️</button>
                <button onClick={() => borrar(obj.id)} className="p-2 hover:bg-red-500/20 rounded-lg transition-colors">🗑️</button>
              </div>
            </li>
          ))}
        </ul>

        {objetivos.length === 0 && (
          <p className="text-center text-slate-500 italic mt-4">Conectando con el servidor...</p>
        )}
      </div>
    </div>
  )
}

export default App