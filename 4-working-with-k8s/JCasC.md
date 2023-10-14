 # Jenkins Configuration as Code

This guide will help you automate Jenkins setup with Docker and Jenkins Configuration as Code.

[Jenkins](https://jenkins.io/) is one of the most popular open-source automation servers, often used to orchestrate [continuous integration (CI) and/or continuous deployment (CD)](https://www.digitalocean.com/community/tutorials/an-introduction-to-continuous-integration-delivery-and-deployment) workflows.
Configuring Jenkins is typically done manually through a web-based setup wizard; this can be a slow, error-prone, and non-scalable process. Furthremore, configurations cannot be tracked in a version control system (VCS) like Git, not be under the scrutiny of any code review process.

Jenkins uses a pluggable architecture to provide most of its functionality. JCasC makes use of the [Configuration as Code](https://plugins.jenkins.io/configuration-as-code/) plugin, which allows you to define the desired state of your Jenkins configuration as one or more [YAML](https://yaml.org/) file(s), eliminating the need for the setup wizard. On initialization, the Configuration as Code plugin would configure Jenkins according to the configuration file(s), greatly reducing the configuration time and eliminating human errors.

## Prerequisites

- Access to a server/workstation with at least 2GB of RAM and Docker installed.

> [How to install and use Docker](https://www.digitalocean.com/community/tutorial_collections/how-to-install-and-use-docker)

## Steps

### Disable the setup wizard

```Dockerfile
FROM jenkins/jenkins:latest
ENV JAVA_OPTS -Djenkins.install.runSetupWizard=false
```

### Setup Jenkins Plugins

```txt
ant:latest
antisamy-markup-formatter:latest
authorize-project:latest
build-timeout:latest
cloudbees-folder:latest
configuration-as-code:latest
credentials-binding:latest
email-ext:latest
git:latest
github-branch-source:latest
gradle:latest
ldap:latest
mailer:latest
matrix-auth:latest
pam-auth:latest
pipeline-github-lib:latest
pipeline-stage-view:latest
ssh-slaves:latest
timestamper:latest
workflow-aggregator:latest
ws-cleanup:latest
```

### Install plugins via Docker

```Dockerfile
# code from before
COPY plugins.txt /usr/share/jenkins/ref/plugins.txt
RUN /usr/local/bin/install-plugin.sh < /usr/share/jenkins/ref/plugins.txt
```

To confirm the `Configuration as Code` plugin is installed, build an image and run a container:

```bash
# build
docker build -t jenkins:jcasc .
# run container
docker run --name jenkins --rm -p 8080:8080 jenkins:jcasc
```

Navigate to `http://server_ip:8080/pluginManager/installed` to see a list on installed plugins. Confirm that `Configuration as Code` plugin is present.
Once done, use `CTRL+C` to exit and terminate the container.

### Specify the Jenkins URL

Create a file `casc.yaml` which will container our configuration as code for Jenkins.

```yaml
unclassified:
  location:
    url: http://server_ip:8080/
```

In the `Dockerfile`, add:

```Dockerfile
# code from before
ENV CASC_JENKINS_CONFIG /var/jenkins_home/casc.yaml
COPY casc.yaml /var/jenkins_home/casc.yaml
```

To confirm this step is completed successfully, spin-up a container and navigate to `server_ip:8080/configure` and scroll down to the **Jenkins URL** field. Confirm that the Jenkins URL has been set to the same value specified in the `casc.yaml` file. When done, exit and terminate the container.

### Creating a User

In this step, we will setup a basic, password-based authentication scheme and create a new user `admin`.

```yaml
jenkins:
  securityRealm:
    local:
      allowSignup: false
      users:
        - id: ${JENKINS_ADMIN_ID}
          password: ${JENKINS_ADMIN_PASSWORD}
# code from previous section...
```

In the context of Jenkins, a security realm is simply an authentication mechanism; the local security realm means to use basic authentication where users must specify their ID/username and password. Other security realms exist and are provided by plugins. For instance, the LDAP plugin allows you to use an existing [LDAP](https://plugins.jenkins.io/ldap) directory service as the authentication mechanism. The [GitHub Authentication](https://plugins.jenkins.io/github-oauth) plugin allows you to use your GitHub credentials to authenticate via OAuth.

 Note that you’ve also specified `allowsSignup: false`, which prevents anonymous users from creating an account through the web interface.

 Finally, instead of hard-coding the user ID and password, you are using variables whose values can be filled in at runtime. This is important because one of the benefits of using JCasC is that the `casc.yaml` file can be committed into source control; if you were to store user passwords in plaintext inside the configuration file, you would have effectively compromised the credentials. Instead, variables are defined using the `${VARIABLE_NAME}` syntax, and its value can be filled in using an environment variable of the same name, or a file of the same name that’s placed inside the `/run/secrets/` directory within the container image.

 Let's build a new image to incorporate these changes and spin-up a new container:

```bash
docker build -t jenkins:jcasc .
docker run --name jenkins --rm -p 8080:8080 --env JENKINS_ADMIN_ID=admin --env JENKINS_ADMIN_PASSWORD=password jenkins:jcasc
```

You should be able to login to `server_ip:8080/login` with the specified credentials. Once you've logged in successfully, you will be redirected to the dashboard.

### Setting up Authorization

After setting up the security realm, you must now configure the _authorization strategy_. In this step, you will use the [Matrix Authorization Strategy](https://plugins.jenkins.io/matrix-auth) plugin to configure permissions for your `admin` user.

By default, the Jenkins core installation provides us with three authorization strategies:

- `unsecured`: every user, including anonymous users, have full permissions to do everything
- `legacy`: emulates legacy Jenkins (prior to v1.164), where any users with the role `admin` is given full permissions, whilst other users, including anonymous users, are given read access.

> NOTE: A role in Jenkins can be a user (for example, `sid`) or a group (for example, `developers`)

- `loggedInUsersCanDoAnything`: anonymous users are given either no access or read-only access. Authenticated users have full permissions to do everything. By allowing actions only for authenticated users, you are able to have an audit trail of which users performed which actions.

> NOTE: You can explore other authorization strategies and their related plugins in the [documentation](https://jenkins.io/doc/developer/extensions/jenkins-core/#authorizationstrategy); these include plugins that handle both authentication and authorization.

All of these authorization strategies are very crude, and does not afford granular control over how permissions are set for different users. Instead, you can use the Matrix Authorization Strategy plugin that was already included in your `plugins.txt` list. This plugin affords you a more granular authorization strategy, and allows you to set user permissions globally, as well as per project/job.

The Matrix Authorization Strategy plugin allows you to use the `jenkins.authorizationStrategy.globalMatrix.permissions` JCasC property to set global permissions.

```yaml
# code from previous section...
  authorizationStrategy:
    globalMatrix:
      permissions:
        - "Overall/Administer:admin"
        - "Overall/Read:authenticated"
```

The `globalMatrix` property sets global permissions (as opposed to per-project permissions). The `permissions` property is a list of strings with the format `<permission-group>/<permission-name>:<role>`. Here, you are granting the `Overall/Administer` permissions to the `admin` user. You’re also granting `Overall/Read` permissions to authenticated, which is a special role that represents all authenticated users. There’s another special role called `anonymous`, which groups all non-authenticated users together. But since permissions are denied by default, if you don’t want to give anonymous users any permissions, you don’t need to explicitly include an entry for it.

### Setup Build Authorization

The first issue in the notifications list relates to build authentication. By default, all jobs are run as the system user, which has a lot of system privileges. Therefore, a Jenkins user can perform _privilege escalation_ simply by defining and running a malicious job or pipeline; this is insecure.

Instead, jobs should be ran using the same Jenkins user that configured or triggered it. To achieve this, you need to install an additional plugin called the [Authorize Project](https://plugins.jenkins.io/authorize-project) plugin.

```txt
// code from previous section
authorize-project:latest
```

```yaml
# code from previous section
security:
  queueItemAuthenticator:
    authenticators:
    - global:
        strategy: triggeringUsersAuthorizationStrategy
```

### Enabling Agent to Controller Access Control

Till now, we have deployed only a single instance of Jenkins, which runs all builds. However, Jenkins supports distributed builds using an agent/controller configuration. The controller is responsible for providing the web UI, exposing an API for clients to send requests to, and co-ordinating builds. The agents are the instances that execute the jobs.

The benefit of this configuration is that it is more scalable and fault-tolerant. If one of the servers running Jenkins goes down, other instances can take up the extra load.

However, there may be instances where the agents cannot be trusted by the controller. For example, the OPS team may manage the Jenkins controller, whilst an external contractor manages their own custom-configured Jenkins agent. Without the Agent to Controller Security Subsystem, the agent is able to instruct the controller to execute any actions it requests, which may be undesirable. By enabling Agent to Controller Access Control, you can control which commands and files the agents have access to.

```yaml
# code from previous section
        - "Overall/Administer:admin"
        - "Overall/Read:authenticated"
  remotingSecurity:
    enabled: true
```

## Conclusion

Although you have configured the basic settings of Jenkins using JCasC, the new instance does not contain any projects or jobs. To take this even further, explore the Job DSL plugin, which allows us to define projects and jobs as code. What’s more, you can include the [Job DSL](https://plugins.jenkins.io/job-dsl) code inside your JCasC configuration file, and have the projects and jobs created as part of the configuration process.

## References

- [Digital Ocean- How To Automate Jenkins Setup with Docker and Jenkins Configuration as Code](https://www.digitalocean.com/community/tutorials/how-to-automate-jenkins-setup-with-docker-and-jenkins-configuration-as-code)
- [How To Automate Jenkins Job Configuration Using Job DSL](https://www.digitalocean.com/community/tutorials/how-to-automate-jenkins-job-configuration-using-job-dsl)
