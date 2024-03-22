import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import notesRouter from './controllers/notes.js'
import requesLogger from './utils/logger.js'
import { errorHandler } from './utils/middleware.js'

const app = express()

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(requesLogger)

app.use('/api/notes', notesRouter)

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

app.use(errorHandler)

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})
