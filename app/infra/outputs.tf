output "nginx_nodeport" {
  value = kubernetes_service.nginx.spec[0].port[0].node_port
  description = "Minikube tunnel-t ne felejtsd el elindítani, hogy elérhető legyen az nginx"
  depends_on = [kubernetes_service.nginx]
}

output "minikube_instructions" {
  value = <<EOT
1) Nézd meg az external IP-t, amit az nginx kapott 
   kubectl get svc -n fakeneptun 
2) Add hozzá ezeket a sorokat a /etc/hosts fájlhoz (Windows: C:/Windows/System32/drivers/etc/hosts)
   <NGINX_IP> fakeneptun.com (pl.: 127.0.0.1 fakeneptun.com)
   <NGINX_IP> prometheus.fakeneptun.com (pl.: 127.0.0.1 prometheus.fakeneptun.com)
  
  Ezek után böngészőből elérhető az alkalmazás a http://fakeneptun.com címen 
  A prometheus pedig a http://prometheus.fakeneptun.com címen
EOT
}
