import type { NextApiRequest, NextApiResponse } from 'next'
import { destinations } from '../_data'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Normalize query values to strings (req.query may contain arrays)
  const rawId = req.query.id
  const rawTodoId = req.query.todoId
  const id = Array.isArray(rawId) ? rawId[0] : rawId
  const todoId = Array.isArray(rawTodoId) ? rawTodoId[0] : rawTodoId

  // Compare as strings to avoid number/string mismatches
  const destIndex = destinations.findIndex(d => String(d.id) === String(id))
  if (destIndex === -1) return res.status(404).json({ error: 'Not found' })

  if (req.method === 'GET') return res.status(200).json(destinations[destIndex])

  if (req.method === 'POST') {
    // add a todo
    const { text } = req.body || {}
    const todo = { id: Date.now().toString(), text: text || '', done: false }
    destinations[destIndex].todos.push(todo)
    return res.status(201).json(todo)
  }

  if (req.method === 'DELETE') {
    if (todoId) {
      // delete a todo
      const todoIndex = destinations[destIndex].todos.findIndex((t: { id: string }) => String(t.id) === String(todoId))
      if (todoIndex === -1) return res.status(404).json({ error: 'Todo not found' })
      destinations[destIndex].todos.splice(todoIndex, 1)
      return res.status(204).end()
    } else {
      // delete the destination
      destinations.splice(destIndex, 1)
      return res.status(204).end()
    }
  }

  res.status(405).end()
}
