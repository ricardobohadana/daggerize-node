import Fastify from 'fastify'
import { SqlConnection } from './sql-connection'

export const app = Fastify({
  logger: true
})

// Declare a route
app.post('/events', async (request, reply) => {
  const eventDate = new Date()
  const eventName = 'POST'
  const callerIp = request.ip
  const requestId = request.id

  await SqlConnection.insertEvent(requestId, eventDate, eventName, callerIp)
  return await reply.status(201).send({
    event: {
      requestId,
      eventDate,
      eventName,
      callerIp
    }
  })
})

app.get('/events', async (request, reply) => {
  const events = await SqlConnection.getEvents()
  return await reply.status(200).send({ events })
})
