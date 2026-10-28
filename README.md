# GUN SERVICE INTERNATIONAL - Módulo de Persistencia JDBC

Proyecto formativo del programa **Análisis y Desarrollo de Software (ADSO) - SENA**.
Módulo Java que gestiona el inventario de activos de utilería escénica (armas de fogueo)
sobre MySQL 8.0 mediante JDBC.

Evidencias cubiertas:

| Evidencia | Contenido |
|-----------|-----------|
| GA7-220501096-AA1-EV02 | Estándares de codificación |
| GA7-220501096-AA1-EV03 / EV04 | Versionamiento con Git y GitHub |
| GA7-220501096-AA2-EV01 | Conexión JDBC y operaciones CRUD |

## Estándares aplicados

### Arquitectura multicapa (paquetes)

```
src/com/gunservice/
├── config/  DatabaseConnection.java  -> Conexión JDBC (patrón Singleton)
├── model/   Producto.java            -> Entidad de dominio (JavaBean)
├── dao/     ProductoDAO.java         -> Acceso a datos (CRUD con PreparedStatement)
└── main/    Main.java                -> Punto de entrada y prueba del CRUD
```

### Convenciones Java

- **PascalCase** para clases: `DatabaseConnection`, `Producto`, `ProductoDAO`.
- **camelCase** para atributos y métodos: `skuCodigo`, `buscarPorSku()`.
- **UPPER_SNAKE_CASE** para constantes: `DEFAULT_URL`, `SQL_INSERTAR`.
- Paquetes en minúscula con dominio invertido: `com.gunservice.*`.
- Comentarios **Javadoc** en clases y métodos públicos.
- Captura formal de excepciones (`try-catch`, `try-with-resources`) para `SQLException`
  y `ClassNotFoundException`.
- Consultas parametrizadas (`PreparedStatement`) para prevenir inyección SQL.

### Control de versiones

- Git local para el historial de cambios y GitHub como repositorio remoto.
- `.gitignore` que excluye binarios, archivos de IDE, logs y credenciales.

## Requisitos

- JDK 11 o superior
- MySQL Server 8.0
- Conector MySQL Connector/J 8.x (`mysql-connector-j-8.x.x.jar`), descargable en
  https://dev.mysql.com/downloads/connector/j/

## Configuración y ejecución

1. **Crear la base de datos.** Ejecutar el script en MySQL:

   ```bash
   mysql -u root -p < database.sql
   ```

   O abrirlo en MySQL Workbench y ejecutarlo completo.

2. **Agregar el conector.** Crear la carpeta `lib/` en la raíz del proyecto y copiar
   allí `mysql-connector-j-8.x.x.jar`.

3. **Configurar credenciales** (opcional). Por defecto se usa
   `jdbc:mysql://localhost:3306/gun_service_db`, usuario `root` y contraseña vacía.
   Para cambiarlos, definir variables de entorno:

   ```powershell
   # Windows PowerShell
   $env:DB_URL = "jdbc:mysql://localhost:3306/gun_service_db"
   $env:DB_USER = "root"
   $env:DB_PASSWORD = "mi_clave"
   ```

   ```bash
   # Linux / macOS / Git Bash
   export DB_USER=root
   export DB_PASSWORD=mi_clave
   ```

4. **Compilar** desde la raíz del proyecto:

   ```bash
   javac -d bin src/com/gunservice/config/*.java src/com/gunservice/model/*.java src/com/gunservice/dao/*.java src/com/gunservice/main/*.java
   ```

5. **Ejecutar:**

   ```bash
   # Windows (separador ;)
   java -cp "bin;lib/*" com.gunservice.main.Main

   # Linux / macOS (separador :)
   java -cp "bin:lib/*" com.gunservice.main.Main
   ```

   La consola mostrará paso a paso: conexión, inserción, listado, actualización,
   verificación y eliminación del activo de prueba `ARM-FOG-999`.

## Guía de comandos Git

### 1. Configuración inicial (una sola vez por equipo)

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu_correo@ejemplo.com"
```

### 2. Inicializar el repositorio local

```bash
cd gun-service-international
git init
git branch -M main
```

### 3. Confirmar cambios

```bash
git status                 # ver archivos modificados
git add .                  # preparar todos los cambios
git commit -m "Módulo de persistencia JDBC con CRUD de productos"
git log --oneline          # ver historial
```

### 4. Publicar en GitHub

1. Crear un repositorio vacío en https://github.com/new (sin README ni .gitignore).
2. Vincular y subir:

```bash
git remote add origin https://github.com/USUARIO/gun-service-international.git
git remote -v
git push -u origin main
```

### 5. Flujo de trabajo diario

```bash
git pull origin main                       # traer cambios del remoto
git checkout -b feature/nueva-funcionalidad # crear rama de trabajo
git add .
git commit -m "Descripción del cambio"
git push -u origin feature/nueva-funcionalidad
git checkout main
git merge feature/nueva-funcionalidad      # integrar la rama
git push origin main
```
