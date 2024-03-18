import { connect, Client } from '@dagger.io/dagger'

connect(
  async (client: Client) => {
    const app = client
      .host()
      .directory('.', { exclude: ['node_modules', 'dist', '.env'] })

    const db = client
      .container()
      .from('mcr.microsoft.com/mssql/server:2019-latest')
      .withEnvVariable('ACCEPT_EULA', 'Y')
      .withEnvVariable('SA_PASSWORD', 'Password123')
      .withExposedPort(1433)
      .asService()

    const address =
      'ttl.sh/myapp-' + Math.floor(Math.random() * 10000000) + ':1h'

    await client
      .container()
      .from('node:21')
      .withServiceBinding('sql-server', db)
      .withEnvVariable('DB_SERVER', 'sql-server')
      .withEnvVariable('DB_USER', 'sa')
      .withEnvVariable('DB_PASSWORD', 'Password123')
      .withDirectory('/app', app)
      .withWorkdir('/app')
      .withExec(['npm', 'install'])
      .withExec(['npm', 'run', 'lint'])
      .withExec(['npx', 'vitest', 'run'])

    await client
      .container()
      .from('node:21')
      .build(app)
      .withExposedPort(3000)
      .publish(address)
  },
  { LogOutput: process.stdout },
)
