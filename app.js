import config from './utils/config.js'
import express from 'express'
import cors from 'cors'
import notesRouter from './controllers/notes.js'
import mongoose from 'mongoose'
import middleware from './utils/middleware.js'
import logger from './utils/logger.js'

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

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app
