package com.gunservice.dao;

import com.gunservice.config.DatabaseConnection;
import com.gunservice.model.Producto;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * Objeto de Acceso a Datos (DAO) para la tabla {@code producto}.
 * Implementa las operaciones CRUD con {@link PreparedStatement} para prevenir
 * inyección SQL y cierra los recursos con try-with-resources.
 *
 * <p>La conexión es compartida (Singleton), por lo que no se cierra aquí;
 * se cierra al finalizar la aplicación con
 * {@link DatabaseConnection#closeConnection()}.</p>
 *
 * @author GUN SERVICE INTERNATIONAL - ADSO SENA
 * @version 1.0
 */
public class ProductoDAO {

    private static final String SQL_INSERTAR =
            "INSERT INTO producto (id_categoria, sku_codigo, nombre_producto, existencia, "
            + "valor_unitario_venta, valor_unitario_compra) VALUES (?, ?, ?, ?, ?, ?)";

    private static final String SQL_LISTAR_TODOS =
            "SELECT id_producto, id_categoria, sku_codigo, nombre_producto, existencia, "
            + "valor_unitario_venta, valor_unitario_compra FROM producto ORDER BY id_producto";

    private static final String SQL_BUSCAR_POR_SKU =
            "SELECT id_producto, id_categoria, sku_codigo, nombre_producto, existencia, "
            + "valor_unitario_venta, valor_unitario_compra FROM producto WHERE sku_codigo = ?";

    private static final String SQL_ACTUALIZAR =
            "UPDATE producto SET nombre_producto = ?, existencia = ?, valor_unitario_venta = ? "
            + "WHERE sku_codigo = ?";

    private static final String SQL_ELIMINAR =
            "DELETE FROM producto WHERE sku_codigo = ?";

    /**
     * Inserta un nuevo activo táctico (CREATE). Si la inserción es exitosa,
     * asigna al objeto el identificador generado por la base de datos.
     *
     * @param producto producto a registrar
     * @return {@code true} si se insertó el registro
     */
    public boolean insertar(Producto producto) {
        Connection conn = DatabaseConnection.getConnection();
        if (conn == null) {
            return false;
        }
        try (PreparedStatement ps = conn.prepareStatement(SQL_INSERTAR, PreparedStatement.RETURN_GENERATED_KEYS)) {
            ps.setInt(1, producto.getIdCategoria());
            ps.setString(2, producto.getSkuCodigo());
            ps.setString(3, producto.getNombreProducto());
            ps.setInt(4, producto.getExistencia());
            ps.setFloat(5, producto.getValorUnitarioVenta());
            ps.setFloat(6, producto.getValorUnitarioCompra());

            if (ps.executeUpdate() == 0) {
                return false;
            }
            try (ResultSet keys = ps.getGeneratedKeys()) {
                if (keys.next()) {
                    producto.setIdProducto(keys.getInt(1));
                }
            }
            return true;
        } catch (SQLException e) {
            System.err.println("[ERROR] Al insertar el producto " + producto.getSkuCodigo() + ": " + e.getMessage());
            return false;
        }
    }

    /**
     * Retorna todos los productos registrados en bodega (READ).
     *
     * @return lista de productos; vacía si no hay registros o ocurre un error
     */
    public List<Producto> listarTodos() {
        List<Producto> productos = new ArrayList<>();
        Connection conn = DatabaseConnection.getConnection();
        if (conn == null) {
            return productos;
        }
        try (PreparedStatement ps = conn.prepareStatement(SQL_LISTAR_TODOS);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                productos.add(mapearProducto(rs));
            }
        } catch (SQLException e) {
            System.err.println("[ERROR] Al listar los productos: " + e.getMessage());
        }
        return productos;
    }

    /**
     * Consulta un activo específico por su SKU único (READ).
     *
     * @param skuCodigo código SKU a buscar
     * @return el producto encontrado, o {@code null} si no existe
     */
    public Producto buscarPorSku(String skuCodigo) {
        Connection conn = DatabaseConnection.getConnection();
        if (conn == null) {
            return null;
        }
        try (PreparedStatement ps = conn.prepareStatement(SQL_BUSCAR_POR_SKU)) {
            ps.setString(1, skuCodigo);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? mapearProducto(rs) : null;
            }
        } catch (SQLException e) {
            System.err.println("[ERROR] Al buscar el producto " + skuCodigo + ": " + e.getMessage());
            return null;
        }
    }

    /**
     * Actualiza el nombre, la existencia y la tarifa (valor de venta/alquiler)
     * de un producto identificado por su SKU (UPDATE).
     *
     * @param producto producto con los nuevos datos y el SKU a actualizar
     * @return {@code true} si se modificó algún registro
     */
    public boolean actualizar(Producto producto) {
        Connection conn = DatabaseConnection.getConnection();
        if (conn == null) {
            return false;
        }
        try (PreparedStatement ps = conn.prepareStatement(SQL_ACTUALIZAR)) {
            ps.setString(1, producto.getNombreProducto());
            ps.setInt(2, producto.getExistencia());
            ps.setFloat(3, producto.getValorUnitarioVenta());
            ps.setString(4, producto.getSkuCodigo());
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[ERROR] Al actualizar el producto " + producto.getSkuCodigo() + ": " + e.getMessage());
            return false;
        }
    }

    /**
     * Elimina un producto de la base de datos por su SKU (DELETE).
     *
     * @param skuCodigo código SKU del producto a eliminar
     * @return {@code true} si se eliminó algún registro
     */
    public boolean eliminar(String skuCodigo) {
        Connection conn = DatabaseConnection.getConnection();
        if (conn == null) {
            return false;
        }
        try (PreparedStatement ps = conn.prepareStatement(SQL_ELIMINAR)) {
            ps.setString(1, skuCodigo);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("[ERROR] Al eliminar el producto " + skuCodigo + ": " + e.getMessage());
            return false;
        }
    }

    /**
     * Convierte la fila actual de un {@link ResultSet} en un objeto {@link Producto}.
     *
     * @param rs resultado posicionado en una fila válida
     * @return producto con los datos de la fila
     * @throws SQLException si falla la lectura de alguna columna
     */
    private Producto mapearProducto(ResultSet rs) throws SQLException {
        return new Producto(
                rs.getInt("id_producto"),
                rs.getInt("id_categoria"),
                rs.getString("sku_codigo"),
                rs.getString("nombre_producto"),
                rs.getInt("existencia"),
                rs.getFloat("valor_unitario_venta"),
                rs.getFloat("valor_unitario_compra"));
    }
}
