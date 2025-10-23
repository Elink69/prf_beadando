$JenkinsMasterURL = "http://localhost:8080"
$AgentName        = "windows-agent"
$JenkinsSecret    = "5b4f54220e95a213e0f491e0eba458b8ea65e83b59624c77eddd7441875f81a5"
$WorkDir          = "C:\jenkins"
$ServiceName      = "JenkinsAgent"

Write-Host "`nChecking for Java..." -ForegroundColor Cyan
$javaCmd = Get-Command java.exe -ErrorAction SilentlyContinue

if (-not $javaCmd) {
    Write-Host "Java not found. Installing Temurin 17 JRE..." -ForegroundColor Yellow
    $javaInstallerUrl = "https://github.com/adoptium/temurin17-binaries/releases/download/jdk-17.0.9%2B9.1/OpenJDK17U-jre_x64_windows_hotspot_17.0.9_9.msi"
    $javaInstallerPath = "$env:TEMP\temurin17-jre.msi"

    # Use TLS 1.2 for HTTPS requests
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

    Write-Host "Downloading Temurin JRE installer..." -ForegroundColor Cyan
    $wc = New-Object System.Net.WebClient
    $wc.DownloadFile($javaInstallerUrl, $javaInstallerPath)
    Write-Host "Download complete." -ForegroundColor Green

    Write-Host "Installing Temurin JRE..." -ForegroundColor Cyan
    Start-Process msiexec.exe -Wait -ArgumentList "/i `"$javaInstallerPath`" /qn /norestart"
    Remove-Item $javaInstallerPath -Force

    $newPath = [Environment]::GetEnvironmentVariable("Path", [EnvironmentVariableTarget]::Machine)
    $env:Path = $newPath


    $javaCmd = Get-Command java.exe -ErrorAction SilentlyContinue
    if ($javaCmd) {
        Write-Host "Java installed successfully: $($javaCmd.Source)" -ForegroundColor Green
    } else {
        Write-Host "Failed to detect Java after installation. Please check manually." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Java already installed: $($javaCmd.Source)" -ForegroundColor Green
}

$env:Path += ";C:\iac"

Write-Host "`nVerifying installations..." -ForegroundColor Cyan
try {
    $minikubeVersion = & minikube version
    $terraformVersionOut = & terraform version
    Write-Host "Minikube: $minikubeVersion"
    Write-Host "Terraform:`n$terraformVersionOut"
} catch {
    Write-Host "Could not verify minikube/terraform. Try opening a new PowerShell session."
}

Write-Host "`nSetting up Jenkins agent..." -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path $WorkDir | Out-Null
Set-Location $WorkDir

$agentJar = Join-Path $WorkDir "agent.jar"
$jnlpUrl = "$JenkinsMasterURL/computer/$AgentName/slave-agent.jnlp"

Write-Host "Downloading Jenkins agent jar from $JenkinsMasterURL"
Invoke-WebRequest -Uri "$JenkinsMasterURL/jnlpJars/agent.jar" -OutFile $agentJar -UseBasicParsing

Write-Host "Registering Jenkins agent as a Windows service..." -ForegroundColor Cyan
$serviceCmd = "java -jar C:\jenkins\agent.jar -url $JenkinsMasterURL -secret $JenkinsSecret -name $AgentName -webSocket -workDir $WorkDir"
Start-Process powershell -Verb RunAs -ArgumentList "$serviceCmd"
Write-Host "Jenkins agent started." -ForegroundColor Green
Write-Host "`n✅ Setup complete! Please restart your PowerShell session for PATH changes to take effect." -ForegroundColor Green