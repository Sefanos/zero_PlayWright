import { useState } from 'react'
import { useRouter } from 'next/router'
import { LogIn, Mail, Lock } from 'lucide-react'

interface LoginData {
  email: string
  password: string
}

type LoginState = LoginData & { error: string | null }

export default function Login() {
  const [formData, setFormData] = useState<LoginState>(
    { email: 'user@example.com', password: 'password', error: null })
  const router = useRouter()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setFormData({ ...formData, error: null })

    const res = await fetch('/api/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: formData.email, password: formData.password })
    })
    if (!res.ok) return setFormData({ ...formData, error: 'Invalid credentials' })
    const json = await res.json()
    localStorage.setItem('token', json.token)
    localStorage.setItem('user', JSON.stringify(json.user))
    router.push('/destinations')
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-lg mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-white text-center flex items-center justify-center gap-2">
          <LogIn size={28} />
          Welcome back
        </h1>
        <p className="text-sm text-gray-300 mb-6">Sign in to manage your destinations and todos.</p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200">Email</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                className="block w-full box-border rounded-lg bg-gray-700 border border-gray-600 pl-10 pr-4 py-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200">Password</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Your password"
                className="block w-full box-border rounded-lg bg-gray-700 border border-gray-600 pl-10 pr-4 py-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow flex items-center justify-center gap-2"
            >
              <LogIn size={16} />
              Sign in
            </button>
          </div>
        </form>

        {formData.error && <div className="mt-4 text-sm text-red-400">{formData.error}</div>}
      </div>
    </div>
  )
}
