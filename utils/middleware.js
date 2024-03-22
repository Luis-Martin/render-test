import logger from './utils/logger.js'

const errorHandler = (err, req, res, next) => {
  logger.error('ERROR ->', err.name)
  logger.error(err.message)

  if (err.name === 'CastError') return res.status(400).send({ error: 'malformatted id' })
  if (err.name === 'ValidationError') return res.status(400).json({ error: err.message })

  next(err)
}

const requesLogger = (req, res, next) => {
  logger.info('Method: ', req.method)
  logger.info('Path: ', req.path)
  logger.info('Body: ', req.body)
  logger.info('-----------')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

export { errorHandler, requesLogger, unknownEndpoint }
