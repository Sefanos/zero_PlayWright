import type { NextApiRequest, NextApiResponse } from 'next'
import { destinations } from '../_data'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return res.status(200).json(destinations)
  }
  if (req.method === 'POST') {
    const { title, description } = req.body || {}
    const id = Date.now().toString()
    const dest = { id, title: title || 'Untitled', description: description || '', todos: [] }
    destinations.push(dest)
    return res.status(201).json(dest)
  }
  res.status(405).end()
}
