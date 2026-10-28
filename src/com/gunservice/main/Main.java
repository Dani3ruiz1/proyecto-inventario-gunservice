package com.gunservice.main;

import com.gunservice.config.DatabaseConnection;
import com.gunservice.dao.ProductoDAO;
import com.gunservice.model.Producto;

import java.util.List;

/**
 * Punto de entrada de la aplicación. Ejecuta en consola, paso a paso,
 * la verificación de la conexión JDBC y de las operaciones CRUD sobre
 * la tabla {@code producto}.
 *
 * @author GUN SERVICE INTERNATIONAL - ADSO SENA
 * @version 1.0
 */
public class Main {

    /** SKU del activo de prueba que se crea y elimina durante la ejecución. */
    private static final String SKU_PRUEBA = "ARM-FOG-999";

    /** Línea separadora de la tabla de resultados. */
    private static final String SEPARADOR = "+" + "-".repeat(6) + "+" + "-".repeat(5) + "+" + "-".repeat(14)
            + "+" + "-".repeat(57) + "+" + "-".repeat(7) + "+" + "-".repeat(14) + "+" + "-".repeat(14) + "+";

    /**
     * Método principal.
     *
     * @param args argumentos de línea de comandos (no se utilizan)
     */
    public static void main(String[] args) {
        System.out.println("==============================================================");
        System.out.println("   GUN SERVICE INTERNATIONAL - Módulo de Persistencia JDBC");
        System.out.println("==============================================================");

        try {
            // PASO 1: Conexión
            titulo(1, "Conexión a la base de datos");
            if (DatabaseConnection.getConnection() == null) {
                System.out.println("  [FALLO] No se pudo establecer la conexión. Fin de la prueba.");
                return;
            }
            System.out.println("  [OK] Conexión establecida con gun_service_db.");

            ProductoDAO dao = new ProductoDAO();

            // Limpia un posible residuo de una ejecución anterior interrumpida.
            dao.eliminar(SKU_PRUEBA);

            // PASO 2: CREATE
            titulo(2, "Inserción de un nuevo activo (CREATE)");
            Producto nuevo = new Producto(1, SKU_PRUEBA,
                    "Pistola de fogueo Glock 17 (utilería escénica)", 10, 170000f, 110000f);
            if (dao.insertar(nuevo)) {
                System.out.println("  [OK] Activo insertado con id " + nuevo.getIdProducto() + ".");
            } else {
                System.out.println("  [FALLO] No se pudo insertar el activo.");
            }

            // PASO 3: READ (todos)
            titulo(3, "Consulta general de activos (READ)");
            imprimirTabla(dao.listarTodos());

            // PASO 4: UPDATE
            titulo(4, "Actualización del activo " + SKU_PRUEBA + " (UPDATE)");
            nuevo.setNombreProducto("Pistola de fogueo Glock 17 Gen5 (utilería escénica)");
            nuevo.setExistencia(25);
            nuevo.setValorUnitarioVenta(185000f);
            if (dao.actualizar(nuevo)) {
                System.out.println("  [OK] Nombre, existencia (25) y tarifa (185.000) actualizados.");
            } else {
                System.out.println("  [FALLO] No se pudo actualizar el activo.");
            }

            // PASO 5: Verificación (READ por SKU)
            titulo(5, "Verificación de la modificación (READ por SKU)");
            Producto verificado = dao.buscarPorSku(SKU_PRUEBA);
            if (verificado != null) {
                imprimirTabla(List.of(verificado));
                boolean coincide = verificado.getExistencia() == 25
                        && verificado.getValorUnitarioVenta() == 185000f;
                System.out.println(coincide
                        ? "  [OK] Los datos almacenados coinciden con la actualización."
                        : "  [FALLO] Los datos almacenados no coinciden con la actualización.");
            } else {
                System.out.println("  [FALLO] No se encontró el activo " + SKU_PRUEBA + ".");
            }

            // PASO 6: DELETE
            titulo(6, "Eliminación de prueba del activo (DELETE)");
            if (dao.eliminar(SKU_PRUEBA) && dao.buscarPorSku(SKU_PRUEBA) == null) {
                System.out.println("  [OK] Activo " + SKU_PRUEBA + " eliminado y verificado.");
            } else {
                System.out.println("  [FALLO] No se pudo eliminar el activo.");
            }

            System.out.println();
            System.out.println("==============================================================");
            System.out.println("   Prueba CRUD finalizada.");
            System.out.println("==============================================================");
        } finally {
            DatabaseConnection.closeConnection();
        }
    }

    /**
     * Imprime el encabezado de un paso de la prueba.
     *
     * @param numero      número del paso
     * @param descripcion descripción del paso
     */
    private static void titulo(int numero, String descripcion) {
        System.out.println();
        System.out.println(">> PASO " + numero + ": " + descripcion);
    }

    /**
     * Imprime una lista de productos en formato de tabla.
     *
     * @param productos productos a mostrar
     */
    private static void imprimirTabla(List<Producto> productos) {
        if (productos.isEmpty()) {
            System.out.println("  (No hay productos registrados)");
            return;
        }
        System.out.println(SEPARADOR);
        System.out.println(String.format("| %-4s | %-3s | %-12s | %-55s | %5s | %12s | %12s |",
                "ID", "CAT", "SKU", "NOMBRE", "STOCK", "V. VENTA", "V. COMPRA"));
        System.out.println(SEPARADOR);
        productos.forEach(System.out::println);
        System.out.println(SEPARADOR);
        System.out.println("  Total de activos: " + productos.size());
    }
}
