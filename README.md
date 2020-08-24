# ALLURE-DOCKER-SERVICE UI - REACTJS

time DOCKER_BUILDKIT=1

docker build -t allure-ui -f docker/Dockerfile.bionic --build-arg VERSION=na --build-arg VCS_REF=na --build-arg BUILD_DATE=na .


