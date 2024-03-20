# Example application to use with Dagger CI/CD

## Initalizing node dev environment with typescript
`npm init`

`npm install typescript ts-node tsx @types/node supertest @types/supertest vitest -D`

`npm install zod dotenv`

`npx tsc --init --module esnext --moduleResolution nodenext`

### add scripts to package.json
``` json
"scripts": {
    "test": "vitest",
    "build": "tsc",
    "start:dev": "tsx watch src/server.ts",
    "start": "node dist/server.js",
    "lint": "eslint --quiet --ext .ts src"
  },
```

## Adding a simple API endpoint
`npm install fastify`

`npm install mssql`

`npm install -D @types/mssql`


## Dagger
### Adding Dagger (new version)
`dagger init --sdk=typescript ci`
`dagger install github.com/quartz-technology/daggerverse/node@v0.0.1`

### Running dagger (new version)
`dagger call -h`
`dagger call -m ci -o test.tar publish --directory .`
`dagger call -m ci serve --directory . up --ports=3000:3000`

### Adding Dagger (xdc version)
`npm install @dagger.io/dagger@0.9 -D`

### Running dagger (xdc version)
`dagger run node --loader ts-node/esm ./test.mts`

## Loading exported image to docker:
`docker load -i node-dagger-local-image.tar`   

`docker tag <image-sha> <img-name>:<img-tag>` 