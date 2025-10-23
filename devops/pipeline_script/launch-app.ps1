$ErrorActionPreference = "Stop"

Write-Host "Starting Minikube..."
minikube start --memory=8g --cpus=4

Write-Host "Starting Minikube dashboard in background..."
Start-Process powershell -Verb RunAs -ArgumentList "minikube dashboard"

Write-Host "Starting Minikube tunnel in background..."
Start-Process powershell -Verb RunAs -ArgumentList "minikube tunnel"

$TerraformDir = "..\app\infra"
Write-Host "Changing directory to $TerraformDir"
Set-Location $TerraformDir

Write-Host "Initializing Terraform..."
terraform init -input=false

Write-Host "Applying Terraform configuration..."
$terraformOutput = terraform apply -auto-approve

Write-Host "`nTerraform apply output:`n"
Write-Host $terraformOutput