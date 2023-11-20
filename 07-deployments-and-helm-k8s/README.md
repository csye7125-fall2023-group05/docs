# Deployments in Kubernetes

## Reading

### Helm

- [Helm - The package manager for Kubernetes](https://helm.sh/)
- [Using a private github repo as helm chart repo (https access)](https://stackoverflow.com/questions/45195364/secure-access-to-a-private-helm-repository)

### Kubernetes


- [Services](https://kubernetes.io/docs/concepts/services-networking/service/)
- [NodePort Service](https://kubernetes.io/docs/concepts/services-networking/service/#nodeport)
- [External Load Balancer](https://kubernetes.io/docs/tasks/access-application-cluster/create-external-load-balancer/)

### Google Kubernetes Engine (GKE) & (Google Cloud Platform)¶

- [Binary Authorization](https://cloud.google.com/binary-authorization/docs/overview)

```yaml
progressDeadLineSeconds: 300 (default 600)-> if pods dont come online in 5 mins, then fail the deployment
minReadySeconds: 1 (default 0)
strategy:
  rollingUpdate:
    maxSurge: 0 # default 25(percent) or can have absoulute number -> rate at which deployment happens -> increases infra cost
    maxUnavailable: 0 # have full capacity rather than giving up 25% (default) for pod termination 
  type: RollingUpdate
```

## HTTP probe v1 core

- `readinessProbe`
- `livenessProbe`
- `failureThreshold`
- `successThreshold`
- `terminationGracePeriodSeconds: 30` -> seconds (must not be set for readiness probes) 
- `timeoutSeconds`
- `initialDelaySeconds`
- `timeoutSeconds`
- `periodSeconds`

Same configs for readiness probe and liveness probe

> Self managed clusters -> need to update resources manually -> usually on-prem
> Cloud managed clusters (GKE, AKS, EKS)

## Service Discovery

- Discovering services through environment variables
- Discovering services through DNS
svc resource -> endpoint resource (this resource is the one that detects and says that a pod is dead and remove it from the deployment, manages IPs and ports that help connect pod container services out to )
- Through FQDN <service-name><namespace>.svc.cluster.local

## ExternalName service

- `external-service.default.svc.cluster.local` -> reach this through a custom domain name 

## Helm

- Tool for managing kubernetes packages called charts
  - Create charts from scratch
  - package charts into chart archive (tgz) files 
  - interact with chart repos where charts are stored
  - install/uninstall helm charts in a k8s cluster 
  - manage release cycle of charts that have been installed with helm

- Makes deployment standardized, easy and reusable
- Reduced deployment complexity and dev productivity

### Directory structure

- `chart.yaml` -> metadata and dependencies of your chart
- `README.md`, `LICENSE`
- `templates/NOTES.txt`
- `charts/` -> dependencies (manage manually with `requirements.yaml`)
- `sprig ->` template functions for Go templates -> Sprig function documentation

### Helm Commands

- `helm pull [chart-url | repo/chartname] ...`
- `helm install ...`
- `helm upgrade ...`
- `helm rollback ...`
- `helm uninstall ...`
- `helm template ...` -> redirect output to yaml file and get a preview of how the chart looks like, and then apply the chart to the cluster
- `helm list ...`
- `helm repo ...` -> similar to remotes in git
- `helm status`

### Debugging

- `lint`, `--dry-run`, `template` etc.

### Create a Helm Chart

Refer Helm docs.

