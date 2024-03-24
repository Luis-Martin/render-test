import express from 'express'
import Note from '../models/note.js'

const notesRouter = express.Router()

notesRouter.get('/', (request, response) => {
  Note.find({}).then(notes => response.json(notes))
})

notesRouter.get('/:id', async (req, res, next) => {
  const note = await Note.findById(req.params.id)
  if (note) res.json(note)
  else res.status(404).end()
})

notesRouter.delete('/:id', async (req, res) => {
  await Note.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

notesRouter.post('/', async (req, res, next) => {
  const note = new Note({
    content: req.body.content,
    important: req.body.important || false
  })

  const savedNote = await note.save()
  res.status(201).json(savedNote)
})

notesRouter.put('/:id', async (req, res, next) => {
  const note = {
    content: req.body.content,
    important: req.body.important
  }

  const updatedNote = await Note
    .findByIdAndUpdate(
      req.params.id,
      note,
      { new: true, runValidators: true, context: 'query' }
    )

  res.json(updatedNote)
})

export default notesRouter
