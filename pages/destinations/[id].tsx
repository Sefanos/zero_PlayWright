import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Plus, Trash2, MapPin, CheckSquare } from 'lucide-react'
import toast from 'react-hot-toast'

interface DestinationData {
  id: number
  title: string
  description: string
  todos: { id: string, text: string, done: boolean }[]
}

export default function DestinationPage() {
  const router = useRouter()
  const { id } = router.query
  const [dest, setDest] = useState<DestinationData | null>(null)
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { if (id) fetchOne() }, [id])
  async function fetchOne() {
    setError(null)
    const res = await fetch(`/api/destinations/${id}`)
    if (!res.ok) {
      setError('Failed to fetch destination')
      return
    }
    setDest(await res.json())
  }
  async function addTodo() {
    const res = await fetch(`/api/destinations/${id}`, { method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ text }) })
    if (res.ok) {
      setText('')
      fetchOne()
      toast.success('Todo added successfully!')
    } else {
      toast.error('Failed to add todo.')
    }
  }

  async function deleteTodo(todoId: string) {
    const res = await fetch(`/api/destinations/${id}?todoId=${todoId}`, { method: 'DELETE' })
    if (res.ok) {
      fetchOne()
      toast.success('Todo deleted successfully!')
    } else {
      toast.error('Failed to delete todo.')
    }
  }

  if (error) return <div className="min-h-screen flex items-center justify-center py-8 px-4"><p className="text-red-400">{error}</p></div>

  if (!dest) return <div className="min-h-screen flex items-center justify-center py-8 px-4">Loading...</div>

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-3xl mx-auto text-gray-100">
        <div className="bg-gray-800/60 border border-gray-600 rounded-lg p-6 mb-6 shadow">
          <h1 className="text-2xl font-bold text-white text-center flex items-center justify-center gap-2">
            <MapPin size={24} />
            {dest.title}
          </h1>
          <p className="text-gray-300 mt-2">{dest.description}</p>
        </div>

        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4 mb-6">
          <div className="flex gap-2 items-center">
            <div className="flex-1">
              <label className="sr-only">New todo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <Plus size={16} />
                </div>
                <input
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="New todo"
                  className="block w-full box-border rounded-lg bg-gray-700 border border-gray-600 pl-10 pr-4 py-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                />
              </div>
            </div>
            <button onClick={addTodo} className="py-3 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow shadow flex items-center gap-2">
              <Plus size={16} />
              Add
            </button>
          </div>
        </div>

  <h2 className="text-xl font-semibold mb-4 text-center flex items-center justify-center gap-2 text-white">
          <CheckSquare size={20} />
          Todos
        </h2>

        <ul className="space-y-3">
          {dest.todos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No todos yet. Add your first one above!</p>
            </div>
          ) : (
            dest.todos.map((t) => (
              <li key={t.id} className="p-4 bg-gray-800/40 border border-gray-600 rounded-lg flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-white">{t.text}</span>
                    <span className="text-sm text-gray-300">{t.done ? '✓' : ''}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => deleteTodo(t.id)}
                      className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 shadow"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}
