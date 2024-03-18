import { app } from './app'
import { env } from './env'
import { SqlConnection } from './sql-connection'

// Run the server!
async function start() {
  try {
    await SqlConnection.connect()
    console.log('Connected to SQL Server')
    await SqlConnection.migrate()
    console.log('Migrated database')
    app.listen({ port: env.PORT, host: env.HOST })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
