package com.gunservice.controller;

import com.gunservice.dao.ProductoDAO;
import com.gunservice.model.Producto;
import com.gunservice.util.ValidationUtils;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * Controlador (MVC) de los productos tácticos. Recibe las peticiones HTTP,
 * delega la persistencia en {@link ProductoDAO} y reenvía a las vistas JSP.
 *
 * <ul>
 *   <li>GET  {@code ?accion=listar|editar|eliminar}</li>
 *   <li>POST {@code ?accion=insertar|actualizar}</li>
 * </ul>
 *
 * @author GUN SERVICE INTERNATIONAL - ADSO SENA
 * @version 1.0
 */
@WebServlet(name = "ProductoServlet", urlPatterns = "/ProductoServlet")
public class ProductoServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    /** Categoría por defecto de los registros nuevos (1 = Armas de Fogueo). */
    private static final int CATEGORIA_POR_DEFECTO = 1;

    private final transient ProductoDAO productoDAO = new ProductoDAO();

    /**
     * Atiende las consultas: listar, editar (carga el formulario) y eliminar.
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String accion = request.getParameter("accion");
        if (accion == null) {
            accion = "listar";
        }

        switch (accion) {
            case "editar": {
                String sku = leerSku(request);
                Producto producto = sku == null ? null : productoDAO.buscarPorSku(sku);
                if (producto == null) {
                    redirigir(request, response, false, "No se encontró el producto solicitado.");
                    return;
                }
                request.setAttribute("producto", producto);
                request.getRequestDispatcher("/editar-producto.jsp").forward(request, response);
                break;
            }
            case "eliminar": {
                String sku = leerSku(request);
                boolean eliminado = sku != null && productoDAO.eliminar(sku);
                redirigir(request, response, eliminado,
                        eliminado ? "Producto " + sku + " eliminado." : "No fue posible eliminar el producto.");
                break;
            }
            case "listar":
            default:
                request.setAttribute("listaProductos", productoDAO.listarTodos());
                request.getRequestDispatcher("/index.jsp").forward(request, response);
                break;
        }
    }

    /**
     * Atiende los formularios: insertar y actualizar un producto.
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        String accion = request.getParameter("accion");
        if (accion == null || !(accion.equals("insertar") || accion.equals("actualizar"))) {
            redirigir(request, response, false, "Acción no válida.");
            return;
        }

        Producto producto;
        try {
            String sku = request.getParameter("sku");
            String nombre = request.getParameter("nombre");
            if (sku == null || sku.isBlank() || nombre == null || nombre.isBlank()) {
                redirigir(request, response, false, "El SKU y el nombre son obligatorios.");
                return;
            }
            int existencia = Integer.parseInt(request.getParameter("existencia").trim());
            float valorVenta = Float.parseFloat(request.getParameter("valorVenta").trim());
            if (existencia < 0 || valorVenta < 0) {
                redirigir(request, response, false, "La existencia y el valor no pueden ser negativos.");
                return;
            }
            producto = new Producto(CATEGORIA_POR_DEFECTO, sku.trim(), nombre.trim(), existencia, valorVenta, 0f);

            if (accion.equals("insertar")) {
                producto.setValorUnitarioCompra(Float.parseFloat(request.getParameter("valorCompra").trim()));
            }
        } catch (NumberFormatException | NullPointerException e) {
            redirigir(request, response, false, "Existencia y valores deben ser numéricos.");
            return;
        }

        if (accion.equals("insertar")) {
            List<String> errores = ValidationUtils.validarNuevo(producto, productoDAO);
            if (!errores.isEmpty()) {
                redirigir(request, response, false, errores.get(0));
                return;
            }
            boolean ok = productoDAO.insertar(producto);
            redirigir(request, response, ok,
                    ok ? "Producto " + producto.getSkuCodigo() + " registrado."
                       : "No se pudo registrar (¿SKU repetido?).");
        } else {
            boolean ok = productoDAO.actualizar(producto);
            redirigir(request, response, ok,
                    ok ? "Producto " + producto.getSkuCodigo() + " actualizado."
                       : "No se pudo actualizar el producto.");
        }
    }

    /** Lee el SKU del producto; acepta {@code sku} o su alias {@code id}. */
    private String leerSku(HttpServletRequest request) {
        String sku = request.getParameter("sku");
        if (sku == null || sku.isBlank()) {
            sku = request.getParameter("id");
        }
        return sku == null || sku.isBlank() ? null : sku.trim();
    }

    /** Redirige al listado (patrón Post/Redirect/Get) con un mensaje para el usuario. */
    private void redirigir(HttpServletRequest request, HttpServletResponse response, boolean ok, String mensaje)
            throws IOException {
        String param = ok ? "ok" : "error";
        response.sendRedirect(request.getContextPath() + "/ProductoServlet?accion=listar&" + param + "="
                + URLEncoder.encode(mensaje, StandardCharsets.UTF_8));
    }
}
