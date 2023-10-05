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

# Lecture 2
```shell
docker build -f Dockerfile.app -t sydrawat01/csye7125:latest sydrawat01/csye7125:0.0.1
docker push sydrawat01/csye7125:0.0.1
```

## Images

Digest is immutable and tags are mutable. You can use the same tag for different releases(not a good practice), but digest cannot be changed, so if we want to fix a release to an image, we use the digest to make it point to exact image version.
To pin a release, we use a digest: "SHAxxxx"

To build image with no cache layers: --no-cache flag is used. This can cause the image to build for a longer period of time, but it helps resovle issues where latest updates to images are not being updated/unexpected behaviours to images.

### Run the container:

```shell
# --rm flag to remove image when container exits
# -d run container in detatched mode
docker run --rm -d -p 8080:8080 sydrawat01/csye7125:latest
```

### Grab docker logs:


```shell
docker logs 22d
docker logs -f <container-id> 
```

### Get into the container for debugging:

This is a view only access -> useful to validate or access in case of debugging
```shell
docker exec -it <container-id> /bin/bash
```
>NOTE: This will work only with executable containers, i.e, which have an entrypoint defined in their Dockerfile.

Can also provide `--entrypoint` as a flag while running the `exec` command if entrypoint is not defined in the Dockerfile.

## Docker volumes
This can be used for development, where the container picks up files from your filesystem so it speeds up development.

Mount volume to a path:
```shell
# look at `docker run` documentation
docker run -v $(pwd):$(pwd) -w .......
```

## Docker resource consumption

Equivalent to `top` command in linux

```shell
docker stats <container-id>
```
## memory limit
Docker desktop configures the default CPUs and memory limits.

```shell
# add flag -m="8m" for 8MiB
# minimum memory is 6MiB
# --cpus=".1" is 1/10th of vCPUs
# 1 cpu = 1000m where m is millicores
# so cpus=0.1 will be --cpus="100m" but this only works with k8s 
# 
```

## docker buildx

We need to create and name a builder before we can start using it.
```shell
docker buildx create --name csye7125builder --use 
docker buildx ls
docker buildx build --platform=linux/amd64,linux/arm64
```

```shell
docker buildx rm csye7125builder
# this removes the built images as well, so be careful!
```

>NOTE: create a script to create a builder, build, push and then delete the builder!

```shell
docker buildx build ... --push ...
```


