# Compila el proyecto y lo despliega en Tomcat 10.1 (Jakarta EE 10) -> http://localhost:8080
# Uso:  $env:DB_PASSWORD = "su_clave"; .\run-web.ps1
$ErrorActionPreference = 'Stop'
$raiz   = $PSScriptRoot
$ver    = '10.1.28'
$tomcat = "$raiz\tools\apache-tomcat-$ver"
$mysql  = "$raiz\lib\mysql-connector-j-9.1.0.jar"
$web    = "$raiz\build\web"
$base   = "$raiz\build\tomcat"

if (-not (Test-Path $tomcat)) {
    New-Item -ItemType Directory -Force "$raiz\tools" | Out-Null
    $zip = "$raiz\tools\tomcat.zip"
    Invoke-WebRequest "https://archive.apache.org/dist/tomcat/tomcat-10/v$ver/bin/apache-tomcat-$ver.zip" -OutFile $zip
    Expand-Archive $zip "$raiz\tools" -Force
    Remove-Item $zip
}

# 1. Estructura del WAR descomprimido: vistas + clases + driver JDBC
if (Test-Path $base) { Remove-Item $base -Recurse -Force }
if (Test-Path $web)  { Remove-Item $web  -Recurse -Force }
Copy-Item "$raiz\src\main\webapp" $web -Recurse
New-Item -ItemType Directory -Force "$web\WEB-INF\classes", "$web\WEB-INF\lib" | Out-Null
Copy-Item $mysql "$web\WEB-INF\lib"
$fuentes = (Get-ChildItem "$raiz\src" -Recurse -Filter *.java).FullName
javac -encoding UTF-8 -cp "$tomcat\lib\servlet-api.jar;$mysql" -d "$web\WEB-INF\classes" $fuentes
if ($LASTEXITCODE -ne 0) { throw 'Error de compilación' }

# 2. Instancia de Tomcat (CATALINA_BASE) con la aplicación como ROOT
New-Item -ItemType Directory -Force "$base\logs", "$base\temp", "$base\work", "$base\webapps" | Out-Null
Copy-Item "$tomcat\conf" "$base\conf" -Recurse
Copy-Item $web "$base\webapps\ROOT" -Recurse

# Puerto HTTP configurable (por defecto 8080); el puerto de apagado se deshabilita para evitar choques
$puerto = if ($env:PORT) { $env:PORT } else { '8080' }
(Get-Content "$base\conf\server.xml" -Raw).Replace('port="8080"', "port=`"$puerto`"").Replace('port="8005"', 'port="-1"') |
    Set-Content "$base\conf\server.xml" -Encoding UTF8

if (-not $env:DB_PASSWORD) { Write-Warning 'DB_PASSWORD no está definida; se intentará conectar sin contraseña.' }
if (-not $env:JAVA_HOME) {
    # java.home del JDK real (el java del PATH puede ser un acceso directo de Oracle)
    $env:JAVA_HOME = ((cmd /c 'java -XshowSettings:properties -version 2>&1') | Select-String 'java\.home = (.+)').Matches[0].Groups[1].Value.Trim()
}
$env:CATALINA_HOME = $tomcat
$env:CATALINA_BASE = $base
$env:JAVA_OPTS     = '-Dfile.encoding=UTF-8'
Write-Host "Abra http://localhost:$puerto  (Ctrl+C para detener)"
& "$tomcat\bin\catalina.bat" run
