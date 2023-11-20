# Kubernetes Internals

## Reading

### Kubernetes Architecture

- [Kubernetes Control Plane](https://kubernetes.io/docs/concepts/#kubernetes-control-plane)
- [Kubernetes Master Components](https://kubernetes.io/docs/concepts/overview/components/#master-components)
- [Kubernetes Node Components](https://kubernetes.io/docs/concepts/overview/components/#node-components)
- [Kubernetes Addons](https://kubernetes.io/docs/concepts/overview/components/#addons)
- [The Kubernetes API](https://kubernetes.io/docs/concepts/overview/kubernetes-api/)

### Kubernetes Authentication & Authorization

- [Kubernetes Authorization Overview](https://kubernetes.io/docs/reference/access-authn-authz/authorization/)
- [Kubernetes Role-based access control (RBAC) Authorization](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)
- [RBAC best practices and workarounds](http://docs.heptio.com/content/tutorials/rbac.html)
- [Role-Based Access Control ("RBAC")](https://unofficial-kubernetes.readthedocs.io/en/latest/admin/authorization/rbac/)
- [Using Kubernetes RBAC and service accounts](https://developer.ibm.com/tutorials/using-kubernetes-rbac-and-service-accounts/)
- [Configure a Security Context for a Pod or Container](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/)

### Kubernetes Scheduling

- [Assigning Pods to Nodes](https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#node-affinity-beta-feature)

### Kubernetes Auto-scaling

- [Horizontal Pod Autoscaler](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)
- [Pod Autoscaling](https://docs.openshift.com/container-platform/3.9/dev_guide/pod_autoscaling.html)
- [Change the default StorageClass](https://kubernetes.io/docs/tasks/administer-cluster/change-default-storage-class/)

### Resource Management for Pods and Containers

- [Limit Storage Consumption](https://kubernetes.io/docs/tasks/administer-cluster/limit-storage-consumption/)
- [Reserve Compute Resources for System Daemons](https://kubernetes.io/docs/tasks/administer-cluster/reserve-compute-resources/)
- Manage Memory, CPU, and API Resources
  - [Memory Default Namespace](https://kubernetes.io/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
  - [CPU Default Namespace](https://kubernetes.io/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)
  - [Memory Constraint Namespace](https://kubernetes.io/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)
  - [CPU Constraint Namespace](https://kubernetes.io/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)
  - [CPU & Memory Quota](https://kubernetes.io/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
  - [Pod Quota](https://kubernetes.io/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

### Network Policies

- [Network Policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/)
