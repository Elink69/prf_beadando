output "nginx_nodeport" {
  value = kubernetes_service.nginx.spec[0].port[0].node_port
  description = "Minikube tunnel-t ne felejtsd el elindítani, hogy elérhető legyen az nginx"
  depends_on = [kubernetes_service.nginx]
}

output "minikube_instructions" {
  value = <<EOT
1) Nézd meg az external IP-t, amit az nginx kapott 
   kubectl get svc -n fakeneptun 
2) Add hozzá ezt a sort a /etc/hosts fájlhoz (Windows: C:/Windows/System32/drivers/etc/hosts)
   <NGINX_IP> fakeneptun.com
  
  Ezek után böngészőből elérhető az alkalmazás a http://fakeneptun.com címen
EOT
}
