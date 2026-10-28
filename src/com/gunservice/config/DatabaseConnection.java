package com.gunservice.config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Gestiona la conexión JDBC a la base de datos {@code gun_service_db}
 * bajo el patrón Singleton: toda la aplicación comparte una única conexión.
 *
 * <p>Los parámetros pueden configurarse con las variables de entorno
 * {@code DB_URL}, {@code DB_USER} y {@code DB_PASSWORD}; si no existen,
 * se usan los valores por defecto.</p>
 *
 * @author GUN SERVICE INTERNATIONAL - ADSO SENA
 * @version 1.0
 */
public final class DatabaseConnection {

    /** Nombre completo de la clase del controlador MySQL Connector/J. */
    private static final String DRIVER = "com.mysql.cj.jdbc.Driver";

    /** URL de conexión por defecto. */
    private static final String DEFAULT_URL = "jdbc:mysql://localhost:3306/gun_service_db";

    /** Usuario por defecto. */
    private static final String DEFAULT_USER = "root";

    /** Contraseña por defecto. */
    private static final String DEFAULT_PASSWORD = "";

    /** Instancia única de la conexión (Singleton). */
    private static Connection connection;

    /**
     * Constructor privado: impide instanciar la clase desde fuera.
     */
    private DatabaseConnection() {
    }

    /**
     * Retorna la conexión única a la base de datos. Si aún no existe o fue
     * cerrada, carga el controlador y abre una nueva.
     *
     * @return conexión activa, o {@code null} si no fue posible conectarse
     */
    public static synchronized Connection getConnection() {
        try {
            if (connection == null || connection.isClosed()) {
                Class.forName(DRIVER);
                connection = DriverManager.getConnection(
                        leerVariable("DB_URL", DEFAULT_URL),
                        leerVariable("DB_USER", DEFAULT_USER),
                        leerVariable("DB_PASSWORD", DEFAULT_PASSWORD));
            }
        } catch (ClassNotFoundException e) {
            System.err.println("[ERROR] No se encontró el controlador JDBC (" + DRIVER
                    + "). Verifique que mysql-connector-j esté en el classpath: " + e.getMessage());
            connection = null;
        } catch (SQLException e) {
            System.err.println("[ERROR] No fue posible conectarse a la base de datos: "
                    + e.getMessage() + " (SQLState: " + e.getSQLState() + ")");
            connection = null;
        }
        return connection;
    }

    /**
     * Cierra la conexión única si se encuentra abierta.
     */
    public static synchronized void closeConnection() {
        if (connection == null) {
            return;
        }
        try {
            if (!connection.isClosed()) {
                connection.close();
            }
        } catch (SQLException e) {
            System.err.println("[ERROR] No fue posible cerrar la conexión: " + e.getMessage());
        } finally {
            connection = null;
        }
    }

    /**
     * Lee una variable de entorno y retorna un valor por defecto si no está definida.
     *
     * @param nombre      nombre de la variable de entorno
     * @param porDefecto  valor a usar cuando la variable no existe
     * @return valor de la variable o el valor por defecto
     */
    private static String leerVariable(String nombre, String porDefecto) {
        String valor = System.getenv(nombre);
        return valor != null ? valor : porDefecto;
    }
}
