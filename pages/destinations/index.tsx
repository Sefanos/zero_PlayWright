import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Trash2, Plus, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'

interface DestinationData {
  id: number
  title: string
  description: string
}

type DestinationsState = {
  list: DestinationData[]
  title: string
  description: string
}

export default function Destinations() {
  const [state, setState] = useState<DestinationsState>({
    list: [],
    title: '',
    description: ''
  })

  useEffect(() => { fetchList() }, [])
  async function fetchList() {
    const res = await fetch('/api/destinations')
    const json = await res.json()
    setState(prev => ({ ...prev, list: json }))
  }

  async function add() {
    const res = await fetch('/api/destinations', { 
        method: 'POST', headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ title: state.title, description: state.description }) })
    if (res.ok) {
      setState(prev => ({ ...prev, title: '', description: '' }))
      fetchList()
      toast.success('Destination added successfully!')
    } else {
      toast.error('Failed to add destination.')
    }
  }

  async function deleteDestination(id: number) {
    const res = await fetch(`/api/destinations/${id}`, { method: 'DELETE' })
    if (res.ok) {
      fetchList()
      toast.success('Destination deleted successfully!')
    } else {
      toast.error('Failed to delete destination.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-center flex items-center justify-center gap-2 text-white">
            <MapPin size={32} />
            Destinations
          </h1>
        </div>

        <div className="bg-gray-800/60 border border-gray-600 rounded-lg p-4 mb-6 shadow">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-300">Title</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <MapPin size={16} />
                </div>
                <input
                  className="block w-full box-border rounded-lg bg-gray-700 border border-gray-600 pl-10 pr-4 py-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  placeholder="Title"
                  value={state.title}
                  onChange={e => setState(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Description</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <MapPin size={14} />
                </div>
                <input
                  className="block w-full box-border rounded-lg bg-gray-700 border border-gray-600 pl-10 pr-4 py-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  placeholder="Description"
                  value={state.description}
                  onChange={e => setState(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>

            <div className="md:col-span-3 flex justify-end">
              <button onClick={add} className="mt-2 md:mt-0 py-3 px-5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow flex items-center gap-2">
                <Plus size={16} />
                Add Destination
              </button>
            </div>
          </div>
        </div>

  <div className="grid gap-4">
          {state.list.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No destinations yet. Add your first one above!</p>
            </div>
          ) : (
            state.list.map(d => (
              <div key={d.id} className="relative p-4 bg-gray-800/50 border border-gray-600 rounded-lg hover:bg-gray-800/70 transition">
                <Link href={`/destinations/${d.id}`} className="block">
                  <h2 className="text-lg font-semibold text-white">{d.title}</h2>
                  <p className="text-sm text-gray-300">{d.description}</p>
                </Link>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteDestination(d.id); }}
                  className="absolute top-2 right-2 p-1 rounded bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
