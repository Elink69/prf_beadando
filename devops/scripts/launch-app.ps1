param (
    [string]$TerraformDir = "..\app\infra"
)

$ErrorActionPreference = "Stop"

Write-Host "Changing directory to $TerraformDir"
Set-Location $TerraformDir

Write-Host "Initializing Terraform..."
terraform init -input=false

Write-Host "Applying Terraform configuration..."
terraform apply -auto-approve