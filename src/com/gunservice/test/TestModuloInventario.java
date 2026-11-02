package com.gunservice.test;

import com.gunservice.config.DatabaseConnection;
import com.gunservice.dao.ProductoDAO;
import com.gunservice.model.Producto;
import com.gunservice.util.ValidationUtils;

import java.io.OutputStream;
import java.io.PrintStream;
import java.util.List;

/**
 * Suite de pruebas automatizadas (consola) del módulo de inventario contra MySQL.
 * Cada caso se ejecuta con {@link ValidationUtils} + {@link ProductoDAO} sobre
 * {@code gun_service_db}, y el reporte indica [PASS]/[FAIL] y el tiempo por caso.
 * Retorna código de salida 1 si algún caso falla.
 *
 * @author GUN SERVICE INTERNATIONAL - ADSO SENA
 * @version 1.0
 */
public class TestModuloInventario {

    /** SKU exclusivo de las pruebas; se elimina al inicio y al final. */
    private static final String SKU = "TEST-QA-001";

    private static final ProductoDAO dao = new ProductoDAO();
    private static int pasaron = 0;
    private static int fallaron = 0;
    private static long tiempoTotalMs = 0;
    private static final List<String> detalles = new java.util.ArrayList<>();

    /** Caso de prueba: lanza {@link AssertionError} si no se cumple lo esperado. */
    @FunctionalInterface
    private interface Caso {
        void ejecutar() throws Exception;
    }

    public static void main(String[] args) {
        System.out.println("==============================================================");
        System.out.println("  GUN SERVICE INTERNATIONAL - Suite de pruebas: Módulo Inventario");
        System.out.println("==============================================================");

        if (DatabaseConnection.getConnection() == null) {
            System.out.println("[FAIL] No hay conexión con gun_service_db. Suite cancelada.");
            System.exit(1);
        }
        dao.eliminar(SKU); // estado inicial limpio

        try {
            ejecutar("CP-01", "Inserción válida de activo táctico", () -> {
                Producto p = nuevo(SKU, 10, 170000f);
                afirmar(ValidationUtils.validarNuevo(p, dao).isEmpty(), "la validación debe aprobar el producto");
                afirmar(dao.insertar(p), "el DAO debe retornar true");
                Producto guardado = dao.buscarPorSku(SKU);
                afirmar(guardado != null && guardado.getExistencia() == 10, "el producto debe persistir con existencia 10");
                detalle("Persistido con id " + guardado.getIdProducto());
            });

            ejecutar("CP-02", "SKU duplicado se rechaza sin romper el sistema", () -> {
                List<String> errores = ValidationUtils.validarNuevo(nuevo(SKU, 5, 100000f), dao);
                afirmar(!errores.isEmpty(), "la validación debe rechazar el SKU repetido");
                detalle("Mensaje: " + errores.get(0));
                // Aun si se saltara la validación, el DAO debe fallar con gracia (sin excepción).
                boolean insertado = sinErrores(() -> dao.insertar(nuevo(SKU, 5, 100000f)));
                afirmar(!insertado, "la restricción UNIQUE de MySQL debe impedir el duplicado");
                detalle("MySQL también rechazó el duplicado; el sistema sigue operativo");
            });

            ejecutar("CP-03", "Existencia negativa se rechaza con mensaje claro", () -> {
                Producto p = nuevo("TEST-QA-NEG", -4, 100000f);
                List<String> errores = ValidationUtils.validarNuevo(p, dao);
                afirmar(errores.stream().anyMatch(e -> e.contains("existencia")), "debe informar el error de existencia");
                afirmar(dao.buscarPorSku("TEST-QA-NEG") == null, "no debe haberse guardado nada");
                detalle("Mensaje: " + errores.get(0));
            });

            ejecutar("CP-04", "Modificación de existencias y tarifa", () -> {
                Producto p = dao.buscarPorSku(SKU);
                p.setExistencia(25);
                p.setValorUnitarioVenta(185000f);
                afirmar(ValidationUtils.validarModificacion(p).isEmpty(), "la validación debe aprobar los cambios");
                afirmar(dao.actualizar(p), "el DAO debe retornar true");
                Producto leido = dao.buscarPorSku(SKU);
                afirmar(leido.getExistencia() == 25 && leido.getValorUnitarioVenta() == 185000f,
                        "la BD debe reflejar existencia 25 y tarifa 185000");
                detalle("Existencia 10 -> 25, tarifa 170.000 -> 185.000");
            });

            ejecutar("CP-05", "Eliminación y verificación de no existencia", () -> {
                afirmar(dao.eliminar(SKU), "el DAO debe retornar true");
                afirmar(dao.buscarPorSku(SKU) == null, "el SKU no debe existir tras eliminarlo");
                detalle("SKU " + SKU + " eliminado y verificado");
            });
        } finally {
            dao.eliminar(SKU); // limpieza por si algún caso falló a la mitad
            DatabaseConnection.closeConnection();
        }

        int total = pasaron + fallaron;
        System.out.println("--------------------------------------------------------------");
        System.out.printf("RESUMEN: %d casos | %d PASS | %d FAIL | tiempo total %d ms%n",
                total, pasaron, fallaron, tiempoTotalMs);
        System.out.println(fallaron == 0 ? "RESULTADO: SUITE APROBADA" : "RESULTADO: SUITE CON FALLOS");
        System.out.println("==============================================================");
        System.exit(fallaron == 0 ? 0 : 1);
    }

    /** Ejecuta un caso, mide su tiempo e imprime [PASS] o [FAIL]. */
    private static void ejecutar(String id, String titulo, Caso caso) {
        long inicio = System.nanoTime();
        String falla = null;
        try {
            caso.ejecutar();
        } catch (AssertionError e) {
            falla = e.getMessage();
        } catch (Exception e) {
            falla = "Excepción inesperada: " + e;
        }
        long ms = (System.nanoTime() - inicio) / 1_000_000;
        tiempoTotalMs += ms;
        if (falla == null) {
            pasaron++;
            System.out.printf("[PASS] %s | %s (%d ms)%n", id, titulo, ms);
        } else {
            fallaron++;
            System.out.printf("[FAIL] %s | %s (%d ms)%n       Motivo: %s%n", id, titulo, ms, falla);
        }
        detalles.forEach(d -> System.out.println("       > " + d));
        detalles.clear();
    }

    private static Producto nuevo(String sku, int existencia, float tarifa) {
        return new Producto(1, sku, "Pistola de fogueo de prueba QA", existencia, tarifa, 110000f);
    }

    private static void afirmar(boolean condicion, String mensaje) {
        if (!condicion) {
            throw new AssertionError(mensaje);
        }
    }

    /** Guarda una nota del caso en curso; se imprime bajo su línea [PASS]/[FAIL]. */
    private static void detalle(String texto) {
        detalles.add(texto);
    }

    /** Ejecuta una operación del DAO silenciando su salida de error (el fallo es lo esperado). */
    private static boolean sinErrores(java.util.function.BooleanSupplier operacion) {
        PrintStream original = System.err;
        System.setErr(new PrintStream(OutputStream.nullOutputStream()));
        try {
            return operacion.getAsBoolean();
        } finally {
            System.setErr(original);
        }
    }
}
