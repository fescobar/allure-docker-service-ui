# Develop UI locally

## Start API
- From root directory
```sh
docker-compose -f docker-compose-dev.yml up allure
```


## Start UI
- From `ui` directory
Install the dependencies
```sh
npm install
```

Check configuration in [.env](.env) file (Verify right values in `ALLURE_DOCKER_API_URL` & `ROUTER_BASE_NAME` env vars)

Start the UI application:

```sh
npm run start
```
