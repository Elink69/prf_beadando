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
    host = "npipe:////./pipe/docker_engine"
}

provider "kubernetes" {
  config_path = "~/.kube/config"
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
# MongoDB
#########################

resource "docker_image" "custom_mongo" {
  name         = "custom_mongo:latest"
  build {
    context    = "${path.module}/../database"
  }
}

resource "null_resource" "load_custom_mongo" {
  depends_on = [ docker_image.custom_mongo]
   provisioner "local-exec" {
  command = <<EOT
$ErrorActionPreference = "Stop"
$MINIKUBE_IP = (minikube -p ${var.minikube_profile} ip)
Write-Output "minikube ip: $MINIKUBE_IP"
minikube -p ${var.minikube_profile} image load ${docker_image.custom_mongo.name}
EOT
  interpreter = ["PowerShell", "-Command"]
  }
}

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
  depends_on = [ null_resource.load_custom_mongo, kubernetes_persistent_volume_claim.mongo_pvc]
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
          image = docker_image.custom_mongo.name
          image_pull_policy = "IfNotPresent"

          port {
            container_port = 27017
          }

          env {
            name  = "MONGO_INITDB_ROOT_USERNAME"
            value = "root"
          }

          env {
            name  = "MONGO_INITDB_ROOT_PASSWORD"
            value = "password"
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

##########################
# BACKEND
##########################
resource "docker_image" "server" {
  name         = "fakeneptun-server:latest"
  build {
    context    = "${path.module}/../server"
  }
}

resource "null_resource" "load_backend_image" {
  depends_on = [ docker_image.server, kubernetes_deployment.mongo ]
   provisioner "local-exec" {
  command = <<EOT
$ErrorActionPreference = "Stop"
$MINIKUBE_IP = (minikube -p ${var.minikube_profile} ip)
Write-Output "minikube ip: $MINIKUBE_IP"
minikube -p ${var.minikube_profile} image load ${docker_image.server.name}
EOT
  interpreter = ["PowerShell", "-Command"]
  }
}

resource "kubernetes_deployment" "backend" {
  depends_on = [ null_resource.load_backend_image]
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
        labels = {
           app = "backend"
         }
         
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
            value = "mongodb://root:password@${kubernetes_service.mongo.metadata[0].name}:27017/fakeNeptun?authSource=admin"
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "backend" {
  depends_on = [ null_resource.load_backend_image ]
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
# frontend
#########################

resource "docker_image" "client" {
  name         = "fakeneptun-client:latest"
  build {
    context    = "${path.module}/../client"
    build_args = {
      BACKEND_BASE : "http://fakeneptun.com/api"
    }
  }
}

resource "null_resource" "load_frontend_image" {
  depends_on = [
    docker_image.client
  ]

  provisioner "local-exec" {
  command = <<EOT
$ErrorActionPreference = "Stop"
$MINIKUBE_IP = (minikube -p ${var.minikube_profile} ip)
Write-Output "minikube ip: $MINIKUBE_IP"
minikube -p ${var.minikube_profile} image load ${docker_image.client.name}
EOT
  interpreter = ["PowerShell", "-Command"]
  }
}

resource "kubernetes_deployment" "frontend" {
  depends_on = [ null_resource.load_frontend_image, kubernetes_deployment.backend ]
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
        labels = { 
          app = "frontend"
          }
      }
      spec {
        container {
          name  = "frontend"
          image = docker_image.client.name
          image_pull_policy = "IfNotPresent"
          port {
            container_port = var.frontend_port
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "frontend" {
  depends_on = [ null_resource.load_frontend_image ]
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
# NGINX (reverse proxy)
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

  location /api/ {
    rewrite ^/api(/.*)$ $1 break;
    proxy_pass http://backend.fakeneptun.svc.cluster.local:12212;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }

  location / {
    rewrite ^([^.]*[^/])$ $1/ break;
    proxy_pass http://frontend.fakeneptun.svc.cluster.local;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_redirect off;
  }  
} 

server {
  server_name prometheus.fakeneptun.com;

  location / {
    proxy_pass http://prometheus.fakeneptun.svc.cluster.local:9090;
  }
}
EOF
  }
}

resource "kubernetes_deployment" "nginx" {
  depends_on = [ kubernetes_deployment.frontend, kubernetes_deployment.backend ]
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
  depends_on = [ kubernetes_deployment.frontend, kubernetes_deployment.backend ]
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
  }
}

resource "kubernetes_config_map" "prometheus_config" {
  metadata {
    name      = "prometheus-config"
    namespace = kubernetes_namespace.app.metadata[0].name
  }

  data = {
    "prometheus.yml" = <<-EOF
global:
  scrape_interval: 5s

scrape_configs:
  - job_name: 'backend'
    metrics_path: /metrics
    static_configs:
      - targets: ['backend.${kubernetes_namespace.app.metadata[0].name}.svc.cluster.local:${var.backend_port}']
EOF
  }
}

resource "kubernetes_deployment" "prometheus" {
  metadata {
    name      = "prometheus"
    namespace = kubernetes_namespace.app.metadata[0].name
    labels = {
      app = "prometheus"
    }
  }

  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "prometheus"
      }
    }

    template {
      metadata {
        labels = {
          app = "prometheus"
        }
      }

      spec {
        container {
          name  = "prometheus"
          image = "prom/prometheus:v2.53.0"

          args = [
            "--config.file=/etc/prometheus/prometheus.yml",
          ]

          port {
            container_port = 9090
          }

          volume_mount {
            name       = "config-volume"
            mount_path = "/etc/prometheus/"
          }
        }

        volume {
          name = "config-volume"
          config_map {
            name = kubernetes_config_map.prometheus_config.metadata[0].name
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "prometheus" {
  metadata {
    name      = "prometheus"
    namespace = kubernetes_namespace.app.metadata[0].name
  }

  spec {
    type = "ClusterIP"
    selector = {
      app = "prometheus"
    }

    port {
      port        = 9090
      target_port = 9090
    }
  }
}