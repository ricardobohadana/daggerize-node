# Example application to use with Dagger CI/CD

## Initalizing node dev environment with typescript
`npm init`
`npm install typescript ts-node tsx @types/node supertest @types/supertest vitest -D`
`npm install zod dotenv`
`npx tsc --init --module esnext --moduleResolution nodenext`

add script to package.json
`"test": "vitest"`

## Adding a simple API endpoint
`npm install fastify`
`npm install mssql`
`npm install -D @types/mssql`



## Adding Dagger
`npm install @dagger.io/dagger@0.9 -D`

## Running dagger
`dagger run node --loader ts-node/esm ./test.mts`

## Loading exported image to docker:
`docker load -i node-dagger-local-image.tar`   
`docker tag <image-sha> <img-name>:<img-tag>` 