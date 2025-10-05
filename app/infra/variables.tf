variable "k8s_namespace" {
  type    = string
  default = "fakeneptun"
}

variable "minikube_profile" {
  type    = string
  default = "minikube"
  description = "Minikube profile name used by CLI"
}

variable "minikube_ip" {
  type    = string
  default = ""
  description = "Optional: minikube ip. If empty, the null_resource will print it during apply; you can also run `minikube ip` and set it here to bake into CoreDNS config."
}

variable "storage_class" {
  type    = string
  default = "standard"
}

variable "backend_port" {
  type    = number
  default = 3000
}

variable "frontend_port" {
  type    = number
  default = 4000
}

variable "frontend_replicas" {
  type    = number
  default = 2
}
