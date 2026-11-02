package com.gunservice.util;

import com.gunservice.dao.ProductoDAO;
import com.gunservice.model.Producto;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

/**
 * Validaciones de negocio que se ejecutan <b>antes</b> de tocar la base de datos.
 * Cada método retorna la lista de errores encontrados; una lista vacía significa "válido".
 *
 * @author GUN SERVICE INTERNATIONAL - ADSO SENA
 * @version 1.0
 */
public final class ValidationUtils {

    /** Longitud mínima del SKU. */
    public static final int SKU_MIN = 5;
    /** Longitud máxima del SKU. */
    public static final int SKU_MAX = 30;
    /** Longitud máxima del nombre del producto. */
    public static final int NOMBRE_MAX = 100;
    /** Longitud máxima de la descripción. */
    public static final int DESCRIPCION_MAX = 255;

    /** SKU alfanumérico; admite guiones como separador (ej. ARM-FOG-001). */
    private static final Pattern PATRON_SKU = Pattern.compile("^[A-Za-z0-9]+(-[A-Za-z0-9]+)*$");

    private ValidationUtils() {
    }

    /**
     * Valida el formato del SKU: no nulo, longitud 5-30 y patrón alfanumérico con guiones.
     *
     * @param sku código SKU a validar
     * @return errores encontrados (vacía si es válido)
     */
    public static List<String> validarSku(String sku) {
        List<String> errores = new ArrayList<>();
        if (sku == null || sku.isBlank()) {
            errores.add("El SKU es obligatorio.");
        } else if (sku.length() < SKU_MIN || sku.length() > SKU_MAX) {
            errores.add("El SKU debe tener entre " + SKU_MIN + " y " + SKU_MAX + " caracteres.");
        } else if (!PATRON_SKU.matcher(sku).matches()) {
            errores.add("El SKU solo admite letras, números y guiones (ej. ARM-FOG-001).");
        }
        return errores;
    }

    /**
     * Valida el nombre: obligatorio y de máximo {@value #NOMBRE_MAX} caracteres.
     *
     * @param nombre nombre del producto
     * @return errores encontrados (vacía si es válido)
     */
    public static List<String> validarNombre(String nombre) {
        List<String> errores = new ArrayList<>();
        if (nombre == null || nombre.isBlank()) {
            errores.add("El nombre es obligatorio.");
        } else if (nombre.length() > NOMBRE_MAX) {
            errores.add("El nombre no puede superar " + NOMBRE_MAX + " caracteres.");
        }
        return errores;
    }

    /**
     * Valida la descripción, que es opcional pero limitada a {@value #DESCRIPCION_MAX} caracteres.
     *
     * @param descripcion descripción (puede ser nula)
     * @return errores encontrados (vacía si es válida)
     */
    public static List<String> validarDescripcion(String descripcion) {
        List<String> errores = new ArrayList<>();
        if (descripcion != null && descripcion.length() > DESCRIPCION_MAX) {
            errores.add("La descripción no puede superar " + DESCRIPCION_MAX + " caracteres.");
        }
        return errores;
    }

    /**
     * Valida los campos numéricos: existencia &gt;= 0; tarifa y costo &gt; 0.
     *
     * @param existencia unidades en bodega
     * @param tarifa     valor unitario de venta/alquiler
     * @param costo      valor unitario de compra
     * @return errores encontrados (vacía si son válidos)
     */
    public static List<String> validarNumeros(int existencia, float tarifa, float costo) {
        List<String> errores = new ArrayList<>();
        if (existencia < 0) {
            errores.add("La existencia no puede ser negativa (valor recibido: " + existencia + ").");
        }
        if (!(tarifa > 0)) {
            errores.add("La tarifa debe ser mayor a 0.");
        }
        if (!(costo > 0)) {
            errores.add("El costo de compra debe ser mayor a 0.");
        }
        return errores;
    }

    /**
     * Indica si el SKU aún no está registrado (unicidad). Consulta la BD, por lo que
     * debe llamarse solo después de que el formato del SKU sea válido.
     *
     * @param dao DAO con el que se consulta
     * @param sku código SKU a verificar
     * @return {@code true} si no existe ningún producto con ese SKU
     */
    public static boolean esSkuUnico(ProductoDAO dao, String sku) {
        return dao.buscarPorSku(sku) == null;
    }

    /**
     * Validación completa para un producto <b>nuevo</b>: formato, números y unicidad del SKU.
     *
     * @param producto producto a registrar
     * @param dao      DAO para comprobar la unicidad
     * @return errores encontrados (vacía si se puede insertar)
     */
    public static List<String> validarNuevo(Producto producto, ProductoDAO dao) {
        List<String> errores = validarModificacion(producto);
        errores.addAll(0, validarSku(producto.getSkuCodigo()));
        if (errores.isEmpty() && !esSkuUnico(dao, producto.getSkuCodigo())) {
            errores.add("El SKU " + producto.getSkuCodigo() + " ya está registrado.");
        }
        return errores;
    }

    /**
     * Validación de los datos modificables (nombre y números); el SKU no se revisa.
     *
     * @param producto producto con los datos a validar
     * @return errores encontrados (vacía si es válido)
     */
    public static List<String> validarModificacion(Producto producto) {
        List<String> errores = new ArrayList<>(validarNombre(producto.getNombreProducto()));
        errores.addAll(validarNumeros(producto.getExistencia(), producto.getValorUnitarioVenta(),
                producto.getValorUnitarioCompra()));
        return errores;
    }
}
