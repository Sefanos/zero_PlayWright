import type { NextApiRequest, NextApiResponse } from 'next'
import { users } from './_data'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { email, password } = req.body || {}
  const user = users.find(u => u.email === email && u.password === password)
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })
  // return a mock token and user
  res.status(200).json({ token: 'mock-token', user: { id: user.id, name: user.name, email: user.email }})
}
