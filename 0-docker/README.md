# Docker

## Demo files

- [Dockerfile](./Dockerfile)
- [Dockerfile.app](./Dockerfile.app)
- [Dockerfile.centos](./Dockerfile.centos)
- [Dockerfile.layers](./Dockerfile.layers)
- [app.js](./app.js)
- [docker-compose.yml](./docker-compose.yml)

## Docker CLI

```shell
docker system prune -a -f
```

## Docker build

```shell
docker build -t x0 .
docker build -t x0 -f Dockerfile0 .
docker build -t x0 --no-cache -f Dockerfile0 .
```

## Docker run

```shell
docker run info7205:latest
docker run -p 8080:8080 info7205:latest
docker run -d -p 8080:8080 x0
docker run -d -p 10080:8080 x0
docker run -p 8080:8080 x0:latest
```

## Docker logs

```shell
docker logs <ID>
docker logs -f <ID>
```

## Docker shell

```shell
docker exec -it <ID> /bin/bash
```

## Docker stats

```shell
docker stats <ID>
```

## Docker inspect

```shell
docker inspect x0
```

## Docker pull

```shell
docker pull debian
docker pull centos:7
```

## Docker login

```shell
docker login
```

```shell
docker login quay.io
```

## Limit CPU & memory

Link: [https://docs.docker.com/config/containers/resource_constraints/](https://docs.docker.com/config/containers/resource_constraints/)

```shell
docker run --cpus=".1" -m="8m"
```

`b`, `k`, `m`, `g` indicate bytes, kilobytes, megabytes, or gigabytes.

## Multi-Platform Builds

Create a new builder instance, link: [https://docs.docker.com/engine/reference/commandline/buildx_create/](https://docs.docker.com/engine/reference/commandline/buildx_create/)

```shell
docker buildx create --use
docker buildx ls
```

Reading references for lecture 00:

Linux Containers:

1. [What is a linux container](https://www.redhat.com/en/topics/containers/whats-a-linux-container)
2. Docker
3. OCI (Open Container Initiative)
4. CRI-O
5. podman
6. buildah
7. OCI image & runtime specification
8. Linux namespaces
9. cgroups
10. Amazon Elastic Container Registry

Hybrid Cloud:

1. [What is hybrid cloud?](https://www.redhat.com/en/topics/cloud-computing/what-is-hybrid-cloud)
2. [Hybrid cloud: what is it, why it matters?](https://www.zdnet.com/article/hybrid-cloud-what-it-is-why-it-matters/)
3. [Confused about hybrid cloud? You are not alone](https://www.backblaze.com/blog/confused-about-the-hybrid-cloud-youre-not-alone/)
4. [Hybrid cloud architectures with AWS](https://aws.amazon.com/enterprise/hybrid/)
