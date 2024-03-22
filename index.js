import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import notesRouter from './controllers/notes.js'

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

app.use('/api/notes', notesRouter)

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
  console.log('ERROR ->', err.name)
  console.log(err.message)

  if (err.name === 'CastError') return res.status(400).send({ error: 'malformatted id' })
  if (err.name === 'ValidationError') return res.status(400).json({ error: err.message })

  next(err)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
