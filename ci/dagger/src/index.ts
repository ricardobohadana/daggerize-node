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

import {
  dag,
  Directory,
  object,
  func,
  Service,
  Secret,
} from '@dagger.io/dagger'

@object()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Ci {
  createDatabase() {
    return dag
      .container()
      .from('mcr.microsoft.com/mssql/server:2019-latest')
      .withEnvVariable('ACCEPT_EULA', 'Y')
      .withEnvVariable('SA_PASSWORD', 'Password123')
      .withExposedPort(1433)
      .asService()
  }

  buildBaseImageWithDb(directory: Directory, db: Service) {
    return dag
      .node()
      .withVersion('21')
      .withNpm()
      .withSource(directory)
      .install([])
      .container()
      .withServiceBinding('sql-server', db)
      .withEnvVariable('DB_SERVER', 'sql-server')
      .withEnvVariable('DB_USER', 'sa')
      .withEnvVariable('DB_PASSWORD', 'Password123')
  }

  /**
   * Runs lint, tests and publishes the app image to DockerHub
   */
  @func()
  async publish(
    directory: Directory,
    dockerHubCredential?: Secret,
    dockerHubUsername?: string,
  ) {
    // const db = this.createDatabase()

    // await this.buildBaseImageWithDb(directory, db)
    //   .withExec(['run', 'lint'])
    //   .withExec(['run', 'test'])
    //   .stdout()

    const shouldPublish = !!dockerHubCredential && !!dockerHubUsername

    const appContainer = dag
      .container()
      .from('node:21')
      .build(directory)
      .withExposedPort(3000)

    if (shouldPublish)
      appContainer
        .withRegistryAuth('docker.io', dockerHubUsername, dockerHubCredential)
        .publish(dockerHubUsername + '/daggerize-node')
    else {
      return appContainer.asTarball()
    }
  }

  /**
   * Serves the app in dev environment with a database
   */
  @func()
  serve(directory: Directory) {
    const db = this.createDatabase()

    return this.buildBaseImageWithDb(directory, db)
      .withEnvVariable('HOST', '0.0.0.0')
      .withExposedPort(3000)
      .withExec(['run', 'start:dev'])
      .asService()
  }
}
