import cors from 'cors'
import express from 'express'
import 'express-async-errors'
import mongoose from 'mongoose'
import notesRouter from './controllers/notes.js'
import usersRouter from './controllers/users.js'
import config from './utils/config.js'
import logger from './utils/logger.js'
import middleware from './utils/middleware.js'

const app = express()

mongoose.set('strictQuery', false)
mongoose.connect(config.MONGODB_URI)
  .then(result => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requesLogger)

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app
