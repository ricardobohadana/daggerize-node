import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import { SqlConnection } from '../src/sql-connection'
import { app } from '../src/app'

describe('E2E tests', () => {
  beforeAll(async () => {
    await SqlConnection.connect()
    await SqlConnection.migrate()
    await app.ready()
  })

  it('should insert an event', async () => {
    let createdEvent: object
    request(app.server)
      .post('/events')
      .expect(201)
      .then((response) => {
        expect(response.body.event).toBeDefined()
        createdEvent = response.body.event
      })

    request(app.server)
      .get('/events')
      .expect(200)
      .then((response) => {
        expect(response.body.events).toBeDefined()
        expect(response.body.events).toContainEqual(createdEvent)
      })
  })
})
