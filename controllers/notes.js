import express from 'express'
import Note from '../models/note.js'
import User from '../models/user.js'
import jwt from 'jsonwebtoken'

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

const getTokenFrom = req => {
  // console.log(req)
  const authorization = req.get('Authorization')
  // console.log('authorization: ', authorization)
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

notesRouter.post('/', async (req, res, next) => {
  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
  // console.log('getTokenFrom: ', getTokenFrom(req))
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const note = new Note({
    content: req.body.content,
    important: req.body.important || false,
    user: user.id
  })

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

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
