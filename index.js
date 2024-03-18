import express, { response } from 'express'
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(cors())

const requesLogger = (req, res, next) => {
  console.log('Method: ', req.method)
  console.log('Path: ', req.path)
  console.log('Body: ', req.body)
  console.log('-----------')
  next()
}

app.use(requesLogger)

app.use(express.static('dist'))

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  },
  {
    id: 4,
    content: "Use --watch instead nodemon",
    important: true
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  const note = notes.find(note => note.id === id)
  if (note) res.json(note)
  else res.status(404).end('Note not found')
})

app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  const note = notes.find(note => note.id !== id)
  notes = notes.filter(note => note.id !== id)
  
  if (note) res.status(204).end()
  else res.status(404).end('Note not found')
})

app.post('/api/notes', (req, res) => {
  const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0
  const newNote = {
    ...req.body,
    id: maxId + 1,
    important: req.body.important || false
  }
  
  if (!req.body.content) return res.status(400).end('Content missing')

  notes = [...notes, newNote]
  res.json(newNote)
})

app.put('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  const note = notes.find(note => note.id !== id)

  if (!note) return res.status(404).end("Resource not found")
  
  const noteUpdated = req.body
  notes = notes.map(note => note.id !== id ? note : noteUpdated)
  res.json(noteUpdated)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})