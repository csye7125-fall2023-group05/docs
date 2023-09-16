# Learning Objectives

The goal for today's lecture is to learn how to manage infrastructure with Ansible and compare Ansible to tools like Cloudformation and Terraform.

## Reading

### Recommended Books

[Ansible: Up and Running by Rene Moser, Lorin Hochstein](https://learning.oreilly.com/library/view/ansible-up-and/9781491979792/)

## YAML

[YAML: YAML Ain't Markup Language](https://yaml.org/)
[YAML Syntax](https://docs.ansible.com/ansible/latest/reference_appendices/YAMLSyntax.html)

## Ansible

[Ansible Documentation](https://docs.ansible.com/)
[Ansible Cloud Modules](https://docs.ansible.com/ansible/latest/modules/list_of_cloud_modules.html)
[How Ansible Works](https://www.ansible.com/overview/how-ansible-works)
[Ansible Examples](https://github.com/ansible/ansible-examples)
[Ansible Directory Layout](https://docs.ansible.com/ansible/latest/user_guide/sample_setup.html#sample-directory-layout)
[Ansible Best Practices](https://docs.ansible.com/ansible/latest/user_guide/playbooks_best_practices.html#id9)


## Ansible vs other IaC tools
1. Cloudformation is only to provision infra on AWS and no other cloud provider. Ansible is compatible with most OS distros and cloud providers.
2. Updating/patching 100s of servers using terraform/cloudformation is not easy, since we will have to ssh into each server to update it. Ansible playbooks are very useful as they can automate the update/patching of 100s of servers.
3. Ansible is easy to deploy, it is agentless(i.e, the nodes it manages does not require it to install any software) and requires no custom security infra.

## Ansible

Everything behind-the-scenes in ansible is python.

### Inventory
1. Static inventory (old convention) - ip addresses are no longer used since each "instance" updates their ip-addresses very often
2. Dynamic inventory: Ansible inventory information is generated dynamically, using information provided by external dbs.

# Configuration:

`/etc/ansible/asnible.cfg` -> has highest priority
`~/.ansible.cfg` -> 2nd priority if 1st is not found

Sample config:

```ansible
[defaults]
inventory = ./inventory
remote_user = someuser
ask_pass = false

[privilege_escalation]
become = true
become_method = sudo
become_use = root
become_ask_pass = false
```

* You can run ad-hoc commands using ansible.
* `Roles` are similar to terraform modules.
* We write `plays` in a `playbook` to manage servers.

### Variables:

* Global
* Play
* Host

### Ansible deep dive

**Registered variables:** Output of a task is to be registed in a variable that can be used later in another task.
**Ansible Facts:** Gather `facts` about the server by Ansible on managed hosts. (There is an option to NOT gather facts to save time during dev)
**`include`** -> to include tasks
**`include_vars`** -> to include variables
**Task iteration with loops**
**Running tasks conditionally**
**Handlers** -> executes in order which they are notified and always run in the end of a playbook execution
**Roles** -> makes the code sharable

### Folder structures
Subdirectories:
```shell
mkdir -p defaults files handlers meta tasks templates tests vars
```
>NOTE: anything that is not a `Jinja2` template goes into the `files` folder.


### running ansible playbooks

```shell
# key_state: absent/present
ansible-playbook import-ssh-key.yml -e @vars.yml -vvvv
```
