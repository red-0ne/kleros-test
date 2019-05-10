# Kleros Test HTTP Service

## Build

To build the docker image
```
npm run docker:build
```

## Tests

In order to run isolated tests in a docker image
```
npm run docker:test
```

## Launch server

The server launches and exposed on `localhost` port `8080` (only route `http://localhost:8080//eth-rate-convert?...` is available)
```
npm run docker:start
```
