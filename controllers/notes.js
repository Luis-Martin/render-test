import express from 'express'
import { Note } from '../models/note.js'

const notesRouter = express.Router()

notesRouter.get('/', (request, response) => {
  Note.find({}).then(notes => response.json(notes))
})

notesRouter.get('/:id', (req, res, next) => {
  Note
    .findById(req.params.id)
    .then(note => note ? res.json(note) : res.status(404).end('Note not found'))
    .catch(err => next(err))
})

notesRouter.delete('/:id', (req, res, next) => {
  Note
    .findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch(err => next(err))
})

notesRouter.post('/', (req, res, next) => {
  const note = new Note({
    content: req.body.content,
    important: req.body.important || false
  })

  note
    .save()
    .then(savedNote => res.json(savedNote))
    .catch(err => next(err))
})

notesRouter.put('/:id', (req, res, next) => {
  const note = Note.findById(req.params.id)
  if (!note) return res.status(404).end('Note not found')

  const dataUpdated = req.body

  Note
    .findByIdAndUpdate(
      req.params.id,
      dataUpdated,
      { new: true, runValidators: true, context: 'query' }
    )
    .then(noteUpdated => res.json(noteUpdated))
    .catch(err => next(err))
})

export default notesRouter
