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
