# Working with Kubernetes

- Learn the basics of Kubernetes and talk about the architecture of the system, the problems it solves.
- Run a local cluster with Minikube & kind, and stand up Kubernetes cluster on AWS using kops.
- Container Orchestration w/Kubernetes
- Kubernetes Objects
- `kubeconfig` & Kubernetes Contexts
- Kubernetes
  - Pod
  - Init Containers
  - Stateless services
  - Service and service discovery
  - Configuration and secrets management

## Installations

- [minikube](https://kubernetes.io/docs/tutorials/hello-minikube/)
- [kind](https://kind.sigs.k8s.io/)
- kops
  - [Install kops](https://kops.sigs.k8s.io/getting_started/install/)
  - [Setup & Teardown Kubernetes Cluster Using kops](https://kops.sigs.k8s.io/getting_started/aws/)

## Reading

- [Local Cluster Options](https://www.cncf.io/wp-content/uploads/2020/08/CNCF-Webinar-Navigating-the-Sea-of-Local-Clusters-.pdf)
- [Kubernetes The Hard Way](https://github.com/kelseyhightower/kubernetes-the-hard-way)

## Tools

- [Lens IDE](https://k8slens.dev/)
- [k9s](https://k9scli.io/)
- [kubectx + kubens: Power tools for kubectl](https://github.com/ahmetb/kubectx)
- [silver-surfer](https://github.com/devtron-labs/silver-surfer)
- [kube-ps1](https://github.com/jonmosco/kube-ps1)
- [Kube-capacity](https://github.com/robscott/kube-capacity)
- [ktop](https://github.com/vladimirvivien/ktop)

## Docker Compose file for PostgreSQL

```yaml
services:
  postgres:
    hostname: postgres_local
    image: postgres
    ports:
      - "5432:5432"
    networks:
      - csye7125
    environment:
      - POSTGRES_USER=csye7125
      - PGUSER=csye7125
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=csye7125
      - PGDATA=/var/lib/postgresql/data
      - TZ=GMT
      - PGTZ=GMT
    healthcheck:
      test: [ "CMD-SHELL", "pg_isready" , "-U", "csye7125", "-d", "csye7125" ]
      interval: 5s
      timeout: 5s
      retries: 10
      start_period: 10s

networks:
  csye7125:
    driver: bridge
```

## Lecture Notes

- Keep kubectl/kind/minikube version to 1.25 (at max)
- name, namespace, metadata, annotations
- install `k9s` and configure skins
- setup kubecontext (config) locally -> follow configs from [ref](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/).

### Init Containers

- Like regular containers, except that they have to finish.
- They run sequentially.
- If they do not finish, regular containers will not run.
- Used for database migration, etc. [`flyway migrations`](https://documentation.red-gate.com/fd/migrations-184127470.html)
- install [`DBeaver`](https://formulae.brew.sh/cask/dbeaver-community) to visualize db connections locally.
- config init containers in such  a way that will not hinder the application -> run migrations in init containers and the destory before running application containers.

### Replication

- reduce latency
- high availability
- high thoughput

Stateless service deployment -> stateless systems are replicated to provide redundancy and scale.
Even for very small services, we must have atleast two replicas to provide a service with high availability.

### Resilient apps

- Run automated health checks for your apps -> liveness and readiness probes.
- Sanity tests -> very basic tests
- Sometimes app stop working without their processes crashing, but we need to perform health checks from outside without depending on the app to perform healthchecks.

### ConfigMaps and Secrets

- Use `ConfigMap` or `Secret` resources to configure pods with environment variables and secrets.
- `ConfigMap` variables can be set to `optional`, which means that the configuration is optional. This will allow for pods to not fail in case `ConfigMap` is not available.
- In `Dockerfile`, `ENTRYPOINT` is the executable when the container starts, and `CMD` specifies the args that must be passed to the `ENTRYPOINT`.
- Use external secrets operators to store the secrets for `Secret` resources. [ref](https://external-secrets.io/latest/), [sops](https://github.com/getsops/sops)
- Explore `kops` to setup a local k8s cluster on a personal workstation.
- Use `kubectl exec` to enter interactive shell mode in a pod [ref](https://kubernetes.io/docs/tasks/debug/debug-application/get-shell-running-container/).
- Running `env` command in a pod will list out all the environment variables configured for the pod.
- Use `ConfigMap` to create an `.env` file on the `webapp` pod [read docs]. Exec into the pod container to verify that the `.env` file is created.

## Persistent Data Storage

- Kubernetes persistent volumes or PVs (various volume types) -> GCE persistent disk, AWS EBS, etc [every pod has it's own storage]
- `emptyDir` is ephemeral volume -> pass data between multiple containers in a pod. (similar to scratch space or temporary storage)
- `hostPath` volume mounts file/directory from host node filesystem to pod.
- Static vs Dynamic provisioning -> (static provisioning not usually required)
- Reclaim PVs -> always `delete` -> `PersistentVolumeClaim` resource in k8s
- `volumeClaimTemplate` is the way to go for reclaiming PVs -> so that each instance can have it's own storage

## ReplicaSets

- `containerPort` and `port`
- `volumeMode` and `volumeMounts`

## Stateful services

- `StatefulSets` instead of `ReplicaSets` for database use-cases.
- `Postgres` service should run as a `StatefulSet`.
- `ReplicaSets` are like cattle, `StatefulSets` are like pets, we need to take care of them otherwise we lose data.
- Unique name, ID, storage, deployment and scaling guarantee.
- Update strategies: `onDelete` or `rollingUpdate`. (Rolling update is the default strategy if nothing is specified).
