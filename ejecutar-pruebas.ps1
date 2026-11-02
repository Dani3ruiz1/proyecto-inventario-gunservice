# Compila y ejecuta la suite TestModuloInventario dejando la pantalla limpia para la captura.
# Uso:  .\ejecutar-pruebas.ps1
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

# La contraseña se pide oculta (no se ve al escribirla) si no está definida en DB_PASSWORD.
if (-not $env:DB_PASSWORD) {
    $segura = Read-Host 'Contraseña de MySQL (root)' -AsSecureString
    $env:DB_PASSWORD = [System.Net.NetworkCredential]::new('', $segura).Password
}

$mysql   = 'lib/mysql-connector-j-9.1.0.jar'
$servlet = (Get-ChildItem tools -Recurse -Filter servlet-api.jar -ErrorAction SilentlyContinue | Select-Object -First 1).FullName
$cp      = if ($servlet) { "$mysql;$servlet" } else { $mysql }

New-Item -ItemType Directory -Force out | Out-Null
javac -encoding UTF-8 -cp $cp -d out (Get-ChildItem src -Recurse -Filter *.java).FullName
if ($LASTEXITCODE -ne 0) { throw 'Error de compilación' }

chcp 65001 | Out-Null
Clear-Host
Write-Host 'PS> java -cp "out;lib/mysql-connector-j-9.1.0.jar" com.gunservice.test.TestModuloInventario'
java "-Dfile.encoding=UTF-8" "-Dstdout.encoding=UTF-8" -cp "out;$mysql" com.gunservice.test.TestModuloInventario
