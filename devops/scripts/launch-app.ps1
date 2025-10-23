param (
    [string]$TerraformDir = "..\app\infra"
)

$ErrorActionPreference = "Stop"

Write-Host "Starting Minikube..."
minikube start --memory=8g --cpus=4

Write-Host "Changing directory to $TerraformDir"
Set-Location $TerraformDir

Write-Host "Initializing Terraform..."
terraform init -input=false

Write-Host "Applying Terraform configuration..."
$terraformOutput = terraform apply -auto-approve

Write-Host "`nTerraform apply output:`n"
Write-Host $terraformOutput