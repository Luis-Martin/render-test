import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { Note } from './note.js'

const app = express()


const requesLogger = (req, res, next) => {
  console.log('Method: ', req.method)
  console.log('Path: ', req.path)
  console.log('Body: ', req.body)
  console.log('-----------')
  next()
}


app.use(express.json())
app.use(cors())
app.use(requesLogger)
app.use(express.static('dist'))


app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => response.json(notes))
})

app.get('/api/notes/:id', (req, res) => {
  Note
    .findById(req.params.id)
    .then(note => note ? res.json(note) : res.status(404).end())
    .catch(err => {
      console.log(err)
      res.status(400).send({error: 'malformatted id'})
    })
})

app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params
  
  if (!id) return res.status(204).end()
  
  Note
    .findByIdAndDelete(id)
    .then(noteDeleted => res.json(noteDeleted))
})

app.post('/api/notes', (req, res) => {
  const body = req.body

  if (!body.content) return res.status(400).end('Content missing')

  const note = new Note({
    content: body.content,
    important: body.important || false 
  })

  note
    .save()
    .then(savedNote => res.json(savedNote))
})

app.put('/api/notes/:id', (req, res) => {
  const id = req.params.id
  const note = Note.findById(id)

  if (!note) return res.status(404).end("Resource not found")

  const dataUpdated = req.body

  Note
    .findByIdAndUpdate(id, dataUpdated)
    .then(rnoteUpdated => res.json(rnoteUpdated))
    .catch(err => console.log(err))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})