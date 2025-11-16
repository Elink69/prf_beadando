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
}

variable frontend_image_name {
  type  = string
  default = "fakeneptun-client:latest"
}

variable backend_image_name {
  type  = string
  default = "fakeneptun-server:latest"
}

variable mongo_restore_image_name {
  type  = string
  default = "fakeneptun-mongo-restore:latest"
}

variable "storage_class" {
  type    = string
  default = "standard"
}

variable "backend_port" {
  type    = number
  default = 12212
}

variable "frontend_port" {
  type    = number
  default = 4000
}

variable "frontend_replicas" {
  type    = number
  default = 2
}

variable "backend_replicas" {
  type    = number
  default = 3
}