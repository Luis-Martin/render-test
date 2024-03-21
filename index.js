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


app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(requesLogger)


app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => response.json(notes))
})

app.get('/api/notes/:id', (req, res, next) => {
  Note
    .findById(req.params.id)
    .then(note => note ? res.json(note) : res.status(404).end('Note not found'))
    .catch(err => next(err))
})

app.delete('/api/notes/:id', (req, res, next) => {
  Note
    .findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch(err => next(err))
})

app.post('/api/notes', (req, res, next) => {
  const note = new Note({
    content: req.body.content,
    important: req.body.important || false 
  })

  note
    .save()
    .then(savedNote => res.json(savedNote))
    .catch(err => next(err))
})

app.put('/api/notes/:id', (req, res) => {
  const note = Note.findById(req.params.id)
  if (!note) return res.status(404).end("Note not found")

  const dataUpdated = req.body

  Note
    .findByIdAndUpdate(
      req.params.id,
      dataUpdated,
      {new: true, runValidators: true, context: 'query'}
    )
    .then(noteUpdated => res.json(noteUpdated))
    .catch(err => next(err))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const errorHandler = (err, req, res, next) => {
  console.log('ERROR ->', err.name)
  console.log(err.message)
  
  if (err.name === 'CastError') return res.status(400).send({error: 'malformatted id'})
  if (err.name === 'ValidationError') return res.status(400).json({error: err.message})
  
  next(err)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})