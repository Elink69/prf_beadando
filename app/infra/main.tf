terraform {
  required_version = ">= 1.2"
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = ">= 2.11.0"
    }
    docker = {
      source  = "kreuzwerker/docker"
      version = ">= 3.0.0"
    }
    null = {
      source  = "hashicorp/null"
      version = ">= 3.1.1"
    }
  }
}

provider "docker" {
}

provider "kubernetes" {
  config_path = "~/.kube/config"
}

#########################
# Build Docker images
#########################
resource "docker_image" "server" {
  name         = "fakeneptun-server:latest"
  build {
    context    = "${path.module}/../server"
  }
}

resource "docker_image" "client" {
  name         = "fakeneptun-client:latest"
  build {
    context    = "${path.module}/../client"
  }
}

resource "docker_image" "mongo_restore" {
  name = "fakeneptun-mongo-restore:latest"
  build {
    context = "${path.module}/../database"
  }
}

#########################
# Load images into minikube
#########################
resource "null_resource" "minikube_load_images" {
  depends_on = [
    docker_image.server,
    docker_image.client,
    docker_image.mongo_restore
  ]

  provisioner "local-exec" {
  command = <<EOT
$ErrorActionPreference = "Stop"
$MINIKUBE_IP = (minikube -p ${var.minikube_profile} ip)
Write-Output "minikube ip: $MINIKUBE_IP"
minikube -p ${var.minikube_profile} image load ${docker_image.server.name}
minikube -p ${var.minikube_profile} image load ${docker_image.client.name}
minikube -p ${var.minikube_profile} image load ${docker_image.mongo_restore.name}
EOT
  interpreter = ["PowerShell", "-Command"]
  }
}

#########################
# Kubernetes namespace
#########################
resource "kubernetes_namespace" "app" {
  metadata {
    name = var.k8s_namespace
  }
}


#########################
# MongoDB Deployment + PVC + Service
#########################
resource "kubernetes_persistent_volume_claim" "mongo_pvc" {
  metadata {
    name      = "mongo-pvc"
    namespace = kubernetes_namespace.app.metadata[0].name
  }
  spec {
    access_modes = ["ReadWriteOnce"]
    resources {
      requests = {
        storage = "2Gi"
      }
    }
    storage_class_name = var.storage_class
  }
}

resource "kubernetes_deployment" "mongo" {
  metadata {
    name      = "mongo"
    namespace = kubernetes_namespace.app.metadata[0].name
    labels = {
      app = "mongo"
    }
  }

  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "mongo"
      }
    }
    template {
      metadata {
        labels = {
          app = "mongo"
        }
      }
      spec {
        container {
          name  = "mongo"
          image = "mongo:6.0"
          args  = []
          port {
            container_port = 27017
          }
          volume_mount {
            name       = "mongo-data"
            mount_path = "/data/db"
          }
        }
        volume {
          name = "mongo-data"
          persistent_volume_claim {
            claim_name = kubernetes_persistent_volume_claim.mongo_pvc.metadata[0].name
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "mongo" {
  metadata {
    name      = "mongo"
    namespace = kubernetes_namespace.app.metadata[0].name
  }
  spec {
    selector = {
      app = "mongo"
    }
    port {
      port        = 27017
      target_port = 27017
    }
    type = "ClusterIP"
  }
}

resource "kubernetes_job" "mongo_restore" {
  metadata {
    name      = "mongo-restore"
    namespace = kubernetes_namespace.app.metadata[0].name
  }
  spec {
    backoff_limit = 1
    template {
      metadata {
        labels = {
          job = "mongo-restore"
        }
      }
      spec {
        restart_policy = "Never"

        container {
          name  = "restore"
          image = "fakeneptun-mongo-restore:latest"
          image_pull_policy = "IfNotPresent"
        }
      }
    }
  }

  depends_on = [
    kubernetes_deployment.mongo,
    null_resource.minikube_load_images
  ]
}

#########################
# backend deployment (3 replicas)
#########################
resource "kubernetes_deployment" "backend" {
  depends_on = [ null_resource.minikube_load_images, kubernetes_job.mongo_restore ]
  metadata {
    name      = "backend"
    namespace = kubernetes_namespace.app.metadata[0].name
    labels = { app = "backend" }
  }

  spec {
    replicas = 3
    selector {
      match_labels = { app = "backend" }
    }
    template {
      metadata {
        labels = { app = "backend" }
      }
      spec {
        container {
          name  = "backend"
          image = docker_image.server.name
          image_pull_policy = "IfNotPresent"
          port {
            container_port = var.backend_port
          }
          env {
            name  = "DB_URI"
            value = kubernetes_service.mongo.metadata[0].name
          }
          # optional readiness/liveness probes can be added
        }
      }
    }
  }
}

resource "kubernetes_service" "backend" {
  depends_on = [ null_resource.minikube_load_images ]
  metadata {
    name      = "backend"
    namespace = kubernetes_namespace.app.metadata[0].name
  }
  spec {
    selector = { app = "backend" }
    port {
      port        = var.backend_port
      target_port = var.backend_port
    }
    type = "ClusterIP"
  }
}

#########################
# frontend deployment
# stateless, choose 2 replicas (adjustable)
#########################
resource "kubernetes_deployment" "frontend" {
  depends_on = [ null_resource.minikube_load_images, kubernetes_deployment.backend ]
  metadata {
    name      = "frontend"
    namespace = kubernetes_namespace.app.metadata[0].name
    labels = { app = "frontend" }
  }

  spec {
    replicas = var.frontend_replicas
    selector {
      match_labels = { app = "frontend" }
    }
    template {
      metadata {
        labels = { app = "frontend" }
      }
      spec {
        container {
          name  = "frontend"
          image = docker_image.client.name
          image_pull_policy = "IfNotPresent"
          port {
            container_port = var.frontend_port
          }
          env {
            name  = "API_URL"
            value = "http://${kubernetes_service.backend.metadata[0].name}:${var.backend_port}"
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "frontend" {
  depends_on = [ null_resource.minikube_load_images ]
  metadata {
    name      = "frontend"
    namespace = kubernetes_namespace.app.metadata[0].name
  }
  spec {
    selector = { app = "frontend" }
    port {
      port        = 80
      target_port = var.frontend_port
    }
    type = "ClusterIP"
  }
}

#########################
# NGINX (reverse proxy) - routes host fakeneptun.com -> frontend service
# Expose NGINX as NodePort so you can reach it from host (or use minikube tunnel)
#########################
resource "kubernetes_config_map" "nginx_conf" {
  metadata {
    name      = "nginx-conf"
    namespace = kubernetes_namespace.app.metadata[0].name
  }

  data = {
    "default.conf" = <<-EOF
server {
    listen 80;
    server_name fakeneptun.com;

    location / {
        proxy_pass http://frontend.${kubernetes_namespace.app.metadata[0].name}.svc.cluster.local;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF
  }
}

resource "kubernetes_deployment" "nginx" {
  metadata {
    name      = "nginx-proxy"
    namespace = kubernetes_namespace.app.metadata[0].name
    labels = { app = "nginx-proxy" }
  }

  spec {
    replicas = 1
    selector {
      match_labels = { app = "nginx-proxy" }
    }
    template {
      metadata {
        labels = { app = "nginx-proxy" }
      }
      spec {
        container {
          name  = "nginx"
          image = "nginx:1.25"
          port {
            container_port = 80
          }
          volume_mount {
            name       = "nginx-conf"
            mount_path = "/etc/nginx/conf.d"
          }
        }
        volume {
          name = "nginx-conf"
          config_map {
            name = kubernetes_config_map.nginx_conf.metadata[0].name
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "nginx" {
  metadata {
    name      = "nginx-proxy"
    namespace = kubernetes_namespace.app.metadata[0].name
  }
  spec {
    selector = { app = "nginx-proxy" }
    port {
      port        = 80
      target_port = 80
    }
    type = "LoadBalancer"
    # Let k8s pick nodePort; you can pin it via node_port attribute if desired
  }
}

#########################
# CoreDNS deployment (DNS server)
# We'll run a CoreDNS instance that serves fakeneptun.com and points it to the minikube node IP
# The Corefile uses the minikube IP; the null_resource earlier computed MINIKUBE_IP and exported to TF var via file?  We'll just
# let the user set var.minikube_ip if needed. Terraform can't easily read the env var from previous local-exec provisioner,
# so we expose var.minikube_ip in variables.tf and instruct user to set it or let the minikube load step print it.
#########################
resource "kubernetes_config_map" "coredns" {
  metadata {
    name      = "fakeneptun-coredns"
    namespace = kubernetes_namespace.app.metadata[0].name
  }

  data = {
    "Corefile" = <<-EOF
fakeneptun.com:53 {
    hosts {
        ${var.minikube_ip} fakeneptun.com
        fallthrough
    }
    forward . 8.8.8.8
    log
}
. {
    forward . 8.8.8.8
    log
}
EOF
  }
}

resource "kubernetes_deployment" "coredns" {
  metadata {
    name      = "fakeneptun-coredns"
    namespace = kubernetes_namespace.app.metadata[0].name
    labels = { app = "fakeneptun-coredns" }
  }

  spec {
    replicas = 1
    selector {
      match_labels = { app = "fakeneptun-coredns" }
    }
    template {
      metadata {
        labels = { app = "fakeneptun-coredns" }
      }
      spec {
        container {
          name  = "coredns"
          image = "coredns/coredns:1.11.1"
          args  = ["-conf", "/etc/coredns/Corefile"]
          port {
            container_port = 53
            protocol       = "UDP"
          }
          port {
            container_port = 53
            protocol       = "TCP"
          }
          volume_mount {
            name       = "coredns-conf"
            mount_path = "/etc/coredns"
          }
        }
        volume {
          name = "coredns-conf"
          config_map {
            name = kubernetes_config_map.coredns.metadata[0].name
            items {
              key  = "Corefile"
              path = "Corefile"
            }
          }
        }
      }
    }
  }
}

# Expose CoreDNS on NodePort 30053 (UDP & TCP)
resource "kubernetes_service" "coredns" {
  metadata {
    name      = "fakeneptun-coredns"
    namespace = kubernetes_namespace.app.metadata[0].name
  }
  spec {
    selector = { app = "fakeneptun-coredns" }
    port {
      name       = "dns-udp"
      port       = 53
      target_port = 53
      protocol    = "UDP"
    }
    port {
      name       = "dns-tcp"
      port       = 53
      target_port = 53
      protocol    = "TCP"
    }
    type = "NodePort"
    # node_port can be set; left to cluster to pick (on minikube it will pick >30000)
  }
}

