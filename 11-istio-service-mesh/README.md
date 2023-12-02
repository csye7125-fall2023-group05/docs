# Istio service mesh w/ Prometheus, Grafana & EFK stack

## Istio Demo

- [Bookinfo Application](https://istio.io/latest/docs/examples/bookinfo/)
- [Istio Get Started](https://istio.io/latest/docs/setup/getting-started/)

## OpenTelemetry Demo

- [opentelemetry-demo](https://github.com/open-telemetry/opentelemetry-demo)

## Helm Charts & Resources

- [Prometheus](https://github.com/prometheus-community/helm-charts)
- [Grafana](https://github.com/grafana/helm-charts/blob/main/charts/grafana/README.md)
- [Grafana Dashboard for Kubernetes](https://grafana.com/grafana/dashboards/6417)
- [EFK Logging Stack](https://csye7125.tejas.cloud/lectures/11/)

## Service Mesh & Istio

- [Istio](https://istio.io/latest/)
- [Service Mesh](https://istio.io/latest/about/service-mesh/)

## Lecture Notes

### Minikube & Prometheus

```shell
minikube start \
  --kubernetes-version=v1.25 \
  --extra-config=kubelet.authentication-token-webhook=true \
  --extra-config=kubelet.authorization-mode=Webhook \
  --extra-config=scheduler.bind-address=0.0.0.0 \
  --extra-config=controller-manager.bind-address=0.0.0.0
minikube addons disable metrics-server
```

### Metrics server

Install a [metrics server](https://github.com/kubernetes-sigs/metrics-server) on your Kubernetes Cluster.

#### Update Kubernetes Kubelet Agent's Configuration (KOPS ONLY)

Pass `--authentication-token-webhook=true` and `--authorization-mode=Webhook` flags to the kubelet.

#### kops config for the kubelet

```yaml
kubelet:
  anonymousAuth: false
  authenticationTokenWebhook: true
  authorizationMode: Webhook
```

To add the flags for Kubelet, you need to edit the kops configuration file created after running the `kops create cluster` command. Automate this in your ansible roles using kops set cluster commands.

```shell
kops create cluster [...]
export KOPS_FEATURE_FLAGS=SpecOverrideFlag
kops set cluster <cluster-name> spec.kubelet.authenticationTokenWebhook=true
kops set cluster <cluster-name> spec.kubelet.authorizationMode=Webhook
```

Example:

```shell
export KOPS_FEATURE_FLAGS=SpecOverrideFlag && \
  export KOPS_STATE_STORE=${KOPS_STATE_STORE} && \
  kops create cluster \
  --zones=us-east-1b,us-east-1c,us-east-1d \
  --master-zones=us-east-1b,us-east-1c,us-east-1d \
  --node-count 3 \
  ${NAME} && \
  kops set cluster ${NAME} spec.kubelet.authenticationTokenWebhook=true && \
  kops set cluster ${NAME} spec.kubelet.authorizationMode=Webhook && \
  kops update cluster --name ${NAME} --yes --admin
```

#### Installing metrics server

The instructions ask you to install the metrics server by applying [https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml](https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml) directly. However, this will not work. You should add a copy components.yaml to your repository with the following changes:

```yaml
# REPLACE:
      containers:
      - args:
        - --cert-dir=/tmp
        - --secure-port=4443
        - --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname
        - --kubelet-use-node-status-port
# WITH:
      containers:
      - args:
        - --cert-dir=/tmp
        - --secure-port=4443
        - --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname
        - --kubelet-insecure-tls
```

You can now apply the `components.yaml` and metrics server should work.

#### Metrics server logs

You will see log messages similar to the ones below if your metrics server is not configured correctly:

```output
E1114 15:44:04.872131       1 pathrecorder.go:107] registered "/metrics" from goroutine 1 [running]:
runtime/debug.Stack(0x1942e80, 0xc00066b7a0, 0x1bb58b5)
 /usr/local/go/src/runtime/debug/stack.go:24 +0x9d
k8s.io/apiserver/pkg/server/mux.(*PathRecorderMux).trackCallers(0xc000192850, 0x1bb58b5, 0x8)
 /go/pkg/mod/k8s.io/apiserver@v0.19.2/pkg/server/mux/pathrecorder.go:109 +0x86
k8s.io/apiserver/pkg/server/mux.(*PathRecorderMux).Handle(0xc000192850, 0x1bb58b5, 0x8, 0x1e96f00, 0xc0006d11a0)
 /go/pkg/mod/k8s.io/apiserver@v0.19.2/pkg/server/mux/pathrecorder.go:173 +0x84
k8s.io/apiserver/pkg/server/routes.MetricsWithReset.Install(0xc000192850)
 /go/pkg/mod/k8s.io/apiserver@v0.19.2/pkg/server/routes/metrics.go:43 +0x5d
k8s.io/apiserver/pkg/server.installAPI(0xc00000a1e0, 0xc000549680)
 /go/pkg/mod/k8s.io/apiserver@v0.19.2/pkg/server/config.go:711 +0x6c
k8s.io/apiserver/pkg/server.completedConfig.New(0xc000549680, 0x1f099c0, 0xc00012f680, 0x1bbdb5a, 0xe, 0x1ef29e0, 0x2cef248, 0x0, 0x0, 0x0)
 /go/pkg/mod/k8s.io/apiserver@v0.19.2/pkg/server/config.go:657 +0xb45
sigs.k8s.io/metrics-server/pkg/server.Config.Complete(0xc000549680, 0xc000549b00, 0xc0002b0d80, 0xdf8475800, 0xc92a69c00, 0x0, 0x0, 0xdf8475800)
 /go/src/sigs.k8s.io/metrics-server/pkg/server/config.go:52 +0x312
sigs.k8s.io/metrics-server/cmd/metrics-server/app.runCommand(0xc0002e24d0, 0xc0000a66c0, 0x0, 0x0)
 /go/src/sigs.k8s.io/metrics-server/cmd/metrics-server/app/start.go:66 +0x157
sigs.k8s.io/metrics-server/cmd/metrics-server/app.NewMetricsServerCommand.func1(0xc00036f080, 0xc0001b8c80, 0x0, 0x4, 0x0, 0x0)
 /go/src/sigs.k8s.io/metrics-server/cmd/metrics-server/app/start.go:37 +0x33
github.com/spf13/cobra.(*Command).execute(0xc00036f080, 0xc00012e010, 0x4, 0x4, 0xc00036f080, 0xc00012e010)
 /go/pkg/mod/github.com/spf13/cobra@v1.0.0/command.go:842 +0x453
github.com/spf13/cobra.(*Command).ExecuteC(0xc00036f080, 0xc000128120, 0x0, 0x0)
 /go/pkg/mod/github.com/spf13/cobra@v1.0.0/command.go:950 +0x349
github.com/spf13/cobra.(*Command).Execute(...)
 /go/pkg/mod/github.com/spf13/cobra@v1.0.0/command.go:887
main.main()
 /go/src/sigs.k8s.io/metrics-server/cmd/metrics-server/metrics-server.go:38 +0xae
I1114 15:44:05.013437       1 secure_serving.go:197] Serving securely on [::]:4443
I1114 15:44:05.013653       1 requestheader_controller.go:169] Starting RequestHeaderAuthRequestController
I1114 15:44:05.013712       1 shared_informer.go:240] Waiting for caches to sync for RequestHeaderAuthRequestController
I1114 15:44:05.013822       1 dynamic_serving_content.go:130] Starting serving-cert::/tmp/apiserver.crt::/tmp/apiserver.key
I1114 15:44:05.013897       1 configmap_cafile_content.go:202] Starting client-ca::kube-system::extension-apiserver-authentication::requestheader-client-ca-file
I1114 15:44:05.013911       1 shared_informer.go:240] Waiting for caches to sync for client-ca::kube-system::extension-apiserver-authentication::requestheader-client-ca-file
I1114 15:44:05.013928       1 configmap_cafile_content.go:202] Starting client-ca::kube-system::extension-apiserver-authentication::client-ca-file
I1114 15:44:05.013933       1 shared_informer.go:240] Waiting for caches to sync for client-ca::kube-system::extension-apiserver-authentication::client-ca-file
I1114 15:44:05.013836       1 tlsconfig.go:240] Starting DynamicServingCertificateController
E1114 15:44:05.036704       1 server.go:132] unable to fully scrape metrics: [unable to fully scrape metrics from node ip-172-20-57-57.ec2.internal: unable to fetch metrics from node ip-172-20-57-57.ec2.internal: request failed - "401 Unauthorized"., unable to fully scrape metrics from node ip-172-20-121-169.ec2.internal: unable to fetch metrics from node ip-172-20-121-169.ec2.internal: request failed - "401 Unauthorized"., unable to fully scrape metrics from node ip-172-20-44-19.ec2.internal: unable to fetch metrics from node ip-172-20-44-19.ec2.internal: request failed - "401 Unauthorized"., unable to fully scrape metrics from node ip-172-20-118-2.ec2.internal: unable to fetch metrics from node ip-172-20-118-2.ec2.internal: request failed - "401 Unauthorized"., unable to fully scrape metrics from node ip-172-20-91-32.ec2.internal: unable to fetch metrics from node ip-172-20-91-32.ec2.internal: request failed - "401 Unauthorized"., unable to fully scrape metrics from node ip-172-20-75-125.ec2.internal: unable to fetch metrics from node ip-172-20-75-125.ec2.internal: request failed - "401 Unauthorized".]
I1114 15:44:05.113940       1 shared_informer.go:247] Caches are synced for RequestHeaderAuthRequestController
I1114 15:44:05.114077       1 shared_informer.go:247] Caches are synced for client-ca::kube-system::extension-apiserver-authentication::client-ca-file
I1114 15:44:05.113940       1 shared_informer.go:247] Caches are synced for client-ca::kube-system::extension-apiserver-authentication::requestheader-client-ca-file
I1114 15:44:34.040653       1 configmap_cafile_content.go:223] Shutting down client-ca::kube-system::extension-apiserver-authentication::requestheader-client-ca-file
I1114 15:44:34.040684       1 configmap_cafile_content.go:223] Shutting down client-ca::kube-system::extension-apiserver-authentication::client-ca-file
I1114 15:44:34.040694       1 requestheader_controller.go:183] Shutting down RequestHeaderAuthRequestController
I1114 15:44:34.040749       1 tlsconfig.go:255] Shutting down DynamicServingCertificateController
I1114 15:44:34.040776       1 dynamic_serving_content.go:145] Shutting down serving-cert::/tmp/apiserver.crt::/tmp/apiserver.key
I1114 15:44:34.040870       1 secure_serving.go:241] Stopped listening on [::]:4443
```
