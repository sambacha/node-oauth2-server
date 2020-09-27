# ts-oauth2-docker-server

## Requirements

Following stuff must be installed to make app working properly:

* [Node.js](http://nodejs.org) version 12.14.1



## Development

While developing be sure that you use Prettier regularly and check code style with ESLint. Check "npm Tasks" table below for details how to run these tools.

In order to run first time copy the `config/development.js` file into `config/local-development.js` and fill it accordingly.

## npm Tasks

Task            | Description
-----           | -----------
`start`         | Alias of `serve` - you can simply use `npm start`
`build`         | Launches commands `build-ts` and `eslint`
`serve`         | `node dist/appp.js`
`watch`         | Watches via nodemon `dist/app.js`
`test`          | Runs all tests in `test` directory
`reformat`      | Runs prettier and eslint
`watch-test`    | Runs `test` with watcher
`build-ts`      | Builds JavaScript from TypeScript sources
`watch-ts`      | Runs `build-ts` with watcher
`eslint`        | Runs TS compiler and ESLint to check styles
`debug`         | Runs `build` and `watch-debug` - development env task
`serve-debug`   | Runs `serve` via nodemon with debug flags
`watch-debug`   | Concurrently runs `watch-ts` and `serve-debug`

## Licesne 

## Source 
