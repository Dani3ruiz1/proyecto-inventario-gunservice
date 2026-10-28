package com.gunservice.model;

/**
 * Entidad de dominio (JavaBean) que representa un activo táctico de utilería
 * escénica registrado en la tabla {@code producto}.
 *
 * @author GUN SERVICE INTERNATIONAL - ADSO SENA
 * @version 1.0
 */
public class Producto {

    /** Identificador autoincremental del producto. */
    private int idProducto;

    /** Identificador de la categoría (1 = Armas de Fogueo). */
    private int idCategoria;

    /** Código SKU único del producto. */
    private String skuCodigo;

    /** Nombre descriptivo del producto. */
    private String nombreProducto;

    /** Unidades disponibles en bodega. */
    private int existencia;

    /** Valor unitario de venta o alquiler. */
    private float valorUnitarioVenta;

    /** Valor unitario de compra. */
    private float valorUnitarioCompra;

    /**
     * Constructor vacío requerido por la especificación JavaBean.
     */
    public Producto() {
    }

    /**
     * Constructor para crear un producto nuevo (sin identificador asignado).
     *
     * @param idCategoria         identificador de la categoría
     * @param skuCodigo           código SKU único
     * @param nombreProducto      nombre descriptivo
     * @param existencia          unidades disponibles
     * @param valorUnitarioVenta  valor unitario de venta
     * @param valorUnitarioCompra valor unitario de compra
     */
    public Producto(int idCategoria, String skuCodigo, String nombreProducto, int existencia,
                    float valorUnitarioVenta, float valorUnitarioCompra) {
        this.idCategoria = idCategoria;
        this.skuCodigo = skuCodigo;
        this.nombreProducto = nombreProducto;
        this.existencia = existencia;
        this.valorUnitarioVenta = valorUnitarioVenta;
        this.valorUnitarioCompra = valorUnitarioCompra;
    }

    /**
     * Constructor completo, usado al leer registros de la base de datos.
     *
     * @param idProducto          identificador del producto
     * @param idCategoria         identificador de la categoría
     * @param skuCodigo           código SKU único
     * @param nombreProducto      nombre descriptivo
     * @param existencia          unidades disponibles
     * @param valorUnitarioVenta  valor unitario de venta
     * @param valorUnitarioCompra valor unitario de compra
     */
    public Producto(int idProducto, int idCategoria, String skuCodigo, String nombreProducto,
                    int existencia, float valorUnitarioVenta, float valorUnitarioCompra) {
        this(idCategoria, skuCodigo, nombreProducto, existencia, valorUnitarioVenta, valorUnitarioCompra);
        this.idProducto = idProducto;
    }

    /**
     * @return identificador del producto
     */
    public int getIdProducto() {
        return idProducto;
    }

    /**
     * @param idProducto nuevo identificador del producto
     */
    public void setIdProducto(int idProducto) {
        this.idProducto = idProducto;
    }

    /**
     * @return identificador de la categoría
     */
    public int getIdCategoria() {
        return idCategoria;
    }

    /**
     * @param idCategoria nuevo identificador de la categoría
     */
    public void setIdCategoria(int idCategoria) {
        this.idCategoria = idCategoria;
    }

    /**
     * @return código SKU único
     */
    public String getSkuCodigo() {
        return skuCodigo;
    }

    /**
     * @param skuCodigo nuevo código SKU
     */
    public void setSkuCodigo(String skuCodigo) {
        this.skuCodigo = skuCodigo;
    }

    /**
     * @return nombre descriptivo del producto
     */
    public String getNombreProducto() {
        return nombreProducto;
    }

    /**
     * @param nombreProducto nuevo nombre descriptivo
     */
    public void setNombreProducto(String nombreProducto) {
        this.nombreProducto = nombreProducto;
    }

    /**
     * @return unidades disponibles en bodega
     */
    public int getExistencia() {
        return existencia;
    }

    /**
     * @param existencia nueva cantidad de unidades disponibles
     */
    public void setExistencia(int existencia) {
        this.existencia = existencia;
    }

    /**
     * @return valor unitario de venta
     */
    public float getValorUnitarioVenta() {
        return valorUnitarioVenta;
    }

    /**
     * @param valorUnitarioVenta nuevo valor unitario de venta
     */
    public void setValorUnitarioVenta(float valorUnitarioVenta) {
        this.valorUnitarioVenta = valorUnitarioVenta;
    }

    /**
     * @return valor unitario de compra
     */
    public float getValorUnitarioCompra() {
        return valorUnitarioCompra;
    }

    /**
     * @param valorUnitarioCompra nuevo valor unitario de compra
     */
    public void setValorUnitarioCompra(float valorUnitarioCompra) {
        this.valorUnitarioCompra = valorUnitarioCompra;
    }

    /**
     * Representación legible en consola, alineada en columnas.
     *
     * @return fila formateada con los datos del producto
     */
    @Override
    public String toString() {
        return String.format("| %-4d | %-3d | %-12s | %-55s | %5d | %,12.0f | %,12.0f |",
                idProducto, idCategoria, skuCodigo, nombreProducto, existencia,
                valorUnitarioVenta, valorUnitarioCompra);
    }
}
