## Docker guide

Oauth server can be run by docker. Before you simply need to install docker itself.

Easiest way is simply to use `docker-compose up` after you fill missing things inside .env file - ENV list is below.

You can also run only oauth itself, than you should configure all of variables (all from this guide, not only the ones in .env).

## Configuration

You need to specify all ENV variables before you can run the docker. The easiest way is to create new file
(for example config.env) with all ENVs inside.

## ENV LIST

Variable                | Description
-----                   | -----------
`DATABASE_ENGINE`       | `kernel-oauth2-server` database engine (default: `postgres`)
`DATABASE_HOST`         | `kernel-oauth2-server` database host (default: `127.0.0.1`)
`DATABASE_MAX_CONN`     | `kernel-oauth2-server` database max connections (default: `25`)
`DATABASE_MAX_IDLE_MS`  | `kernel-oauth2-server` database max idle time in ms (default: `30000`)
`DATABASE_MIN_CONN`     | `kernel-oauth2-server` database min connections (default: `1`)
`DATABASE_NAME`         | `kernel-oauth2-server` database name
`DATABASE_PASSWORD`     | `kernel-oauth2-server` database password
`DATABASE_PORT`         | `kernel-oauth2-server` database port
`DATABASE_USER`         | `kernel-oauth2-server` database user
`REDIS_HOST`            | `kernel-oauth2-server` redis database host (for sessions)
`REDIS_PORT`            | `kernel-oauth2-server` redis database port
`OAUTH_COOKIE_SECRET`   | Cookie secret string
`OAUTH_DSN`             | Sentry.io DSN url - used for remote logger (optional)

## How to run?
```$ docker run --network="host" -p 5000:5000 --env-file ./config.env knikernel/oauth2-serer:latest```
