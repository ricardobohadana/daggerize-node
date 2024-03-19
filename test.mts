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
      .stdout()

    const dockerHubSecret = process.env.DOCKER_HUB_TOKEN
    const dockerHubUsername = process.env.DOCKER_HUB_USERNAME

    const shouldPublish = !!dockerHubSecret && !!dockerHubUsername

    if (!shouldPublish) {
      console.warn(`DOCKER_HUB_TOKEN env not set!`)
      console.warn('Skipping publish to Docker Hub step...')
    }
    const dockerHubTokenSecret = client.setSecret(
      'docker-hub-secret',
      dockerHubSecret || '',
    )

    const appContainer = client
      .container()
      .from('node:21')
      .build(app)
      .withExposedPort(3000)
    if (shouldPublish)
      await appContainer
        .withSecretVariable('DOCKER_HUB_TOKEN', dockerHubTokenSecret)
        .withRegistryAuth('docker.io', dockerHubUsername, dockerHubTokenSecret)
        .publish(dockerHubUsername + '/daggerize-node')
    else await appContainer.export('./node-dagger-local-image.tar')
  },
  { LogOutput: process.stdout },
)
