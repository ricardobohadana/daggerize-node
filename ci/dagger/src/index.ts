/**
 * A generated module for Ci functions
 *
 * This module has been generated via dagger init and serves as a reference to
 * basic module structure as you get started with Dagger.
 *
 * Two functions have been pre-created. You can modify, delete, or add to them,
 * as needed. They demonstrate usage of arguments and return types using simple
 * echo and grep commands. The functions can be called from the dagger CLI or
 * from one of the SDKs.
 *
 * The first line in this comment block is a short description line and the
 * rest is a long description with more detail on the module's purpose or usage,
 * if appropriate. All modules should have a short description.
 */

import { dag, Directory, object, func } from '@dagger.io/dagger'

@object()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Ci {
  /**
   * Runs lint, tests and publishes the app image to DockerHub
   */
  @func()
  async publish(directory: Directory) {
    const db = dag
      .container()
      .from('mcr.microsoft.com/mssql/server:2019-latest')
      .withEnvVariable('ACCEPT_EULA', 'Y')
      .withEnvVariable('SA_PASSWORD', 'Password123')
      .withExposedPort(1433)
      .asService()

    await dag
      .node()
      .withVersion('21')
      .withNpm()
      .withSource(directory)
      .install([])
      .container()
      .withExec(['run', 'lint'])
      .withServiceBinding('sql-server', db)
      .withEnvVariable('DB_SERVER', 'sql-server')
      .withEnvVariable('DB_USER', 'sa')
      .withEnvVariable('DB_PASSWORD', 'Password123')
      .withExec(['run', 'test'])
      .stdout()

    const dockerHubSecret = process.env.DOCKER_HUB_TOKEN
    const dockerHubUsername = process.env.DOCKER_HUB_USERNAME

    const shouldPublish = !!dockerHubSecret && !!dockerHubUsername

    if (!shouldPublish) {
      console.warn(`DOCKER_HUB_TOKEN env not set!`)
      console.warn('Skipping publish to Docker Hub step...')
    }
    const dockerHubTokenSecret = dag.setSecret(
      'docker-hub-secret',
      dockerHubSecret || '',
    )
    const appContainer = dag.container().build(directory).withExposedPort(3000)

    if (shouldPublish)
      appContainer
        .withSecretVariable('DOCKER_HUB_TOKEN', dockerHubTokenSecret)
        .withRegistryAuth('docker.io', dockerHubUsername, dockerHubTokenSecret)
        .publish(dockerHubUsername + '/daggerize-node')
    else {
      return appContainer.asTarball()
    }
  }
}
