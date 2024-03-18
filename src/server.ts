import { app } from './app'
import { SqlConnection } from './sql-connection'

// Run the server!
try {
  SqlConnection.connect().then(() => {
    console.log('Connected to SQL Server')
    SqlConnection.migrate()
  })
  app.listen({ port: 3000 })
} catch (err) {
  app.log.error(err)
  process.exit(1)
}
