import sql from 'mssql'
import { env } from './env'

export class SqlConnection {
  private static readonly config = {
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    server: env.DB_SERVER,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
    options: {
      // encrypt: true, // for azure
      trustServerCertificate: true,
    },
  }

  static async migrate() {
    try {
      await sql.query`
        IF OBJECT_ID (N'dbo.events', N'U') IS NOT NULL
        BEGIN
          DROP TABLE dbo.events
        END
        CREATE TABLE events (id INT IDENTITY(1,1) PRIMARY KEY, requestId NVARCHAR(255), eventDate DATETIME, eventName NVARCHAR(255), callerIp NVARCHAR(255))
      `
    } catch (err) {
      console.log(err)
    }
  }

  static async connect() {
    await sql.connect(this.config)
  }

  static async insertEvent(
    requestId: string,
    eventDate: Date,
    eventName: string,
    callerIp: string,
  ) {
    const result =
      await sql.query`INSERT INTO events (requestId, eventDate, eventName, callerIp) VALUES (${requestId}, ${eventDate}, ${eventName}, ${callerIp})`
    console.dir(result)
  }

  static async getEvents() {
    const results = await sql.query`SELECT * FROM events`
    console.dir(results)
    return results.recordset
  }
}
