<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.util.List, com.gunservice.model.Producto, com.gunservice.util.Html" %>
<%
    // Si se abre index.jsp directamente, pasa primero por el Servlet para cargar la lista.
    if (request.getAttribute("listaProductos") == null) {
        request.getRequestDispatcher("/ProductoServlet?accion=listar").forward(request, response);
        return;
    }
    @SuppressWarnings("unchecked")
    List<Producto> productos = (List<Producto>) request.getAttribute("listaProductos");
    String ok = request.getParameter("ok");
    String error = request.getParameter("error");
%>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Gun Service International - Inventario</title>
    <link rel="stylesheet" href="<%= request.getContextPath() %>/css/estilos.css">
</head>
<body>
<nav>
    <span class="marca">GUN SERVICE INTERNATIONAL S.A.S.</span>
    <a href="<%= request.getContextPath() %>/ProductoServlet?accion=listar">Inventario</a>
    <a href="#registrar">Registrar producto</a>
    <a href="#inventario">Listado</a>
</nav>

<main>
    <h1>Inventario de utilería táctica</h1>

    <% if (ok != null) { %><div class="msg ok"><%= Html.esc(ok) %></div><% } %>
    <% if (error != null) { %><div class="msg error"><%= Html.esc(error) %></div><% } %>

    <section id="registrar">
        <h2>Registrar nuevo producto</h2>
        <form class="grid" method="POST" action="<%= request.getContextPath() %>/ProductoServlet?accion=insertar">
            <div><label for="sku">SKU Código</label>
                <input id="sku" name="sku" maxlength="30" required placeholder="ARM-FOG-006"></div>
            <div><label for="nombre">Nombre del producto</label>
                <input id="nombre" name="nombre" maxlength="100" required></div>
            <div><label for="existencia">Existencia</label>
                <input id="existencia" name="existencia" type="number" min="0" step="1" required></div>
            <div><label for="valorVenta">Valor unitario alquiler/venta</label>
                <input id="valorVenta" name="valorVenta" type="number" min="0" step="any" required></div>
            <div><label for="valorCompra">Valor compra</label>
                <input id="valorCompra" name="valorCompra" type="number" min="0" step="any" required></div>
            <div class="acciones"><button class="btn" type="submit">Registrar</button></div>
        </form>
    </section>

    <section id="inventario">
        <h2>Productos registrados (<%= productos.size() %>)</h2>
        <div class="tabla-wrap">
        <table>
            <thead>
            <tr><th>ID</th><th>SKU</th><th>Nombre</th><th class="num">Existencia</th>
                <th class="num">V. alquiler/venta</th><th class="num">V. compra</th><th>Acciones</th></tr>
            </thead>
            <tbody>
            <% if (productos.isEmpty()) { %>
            <tr><td colspan="7" class="vacio">No hay productos registrados.</td></tr>
            <% } %>
            <% for (Producto p : productos) {
                   String skuUrl = java.net.URLEncoder.encode(p.getSkuCodigo(), "UTF-8"); %>
            <tr>
                <td><%= p.getIdProducto() %></td>
                <td><%= Html.esc(p.getSkuCodigo()) %></td>
                <td><%= Html.esc(p.getNombreProducto()) %></td>
                <td class="num"><%= p.getExistencia() %></td>
                <td class="num"><%= String.format("%,.0f", p.getValorUnitarioVenta()) %></td>
                <td class="num"><%= String.format("%,.0f", p.getValorUnitarioCompra()) %></td>
                <td class="op">
                    <a class="btn sec chico"
                       href="<%= request.getContextPath() %>/ProductoServlet?accion=editar&sku=<%= skuUrl %>">Editar</a>
                    <a class="btn peligro chico"
                       href="<%= request.getContextPath() %>/ProductoServlet?accion=eliminar&sku=<%= skuUrl %>"
                       onclick="return confirm('¿Eliminar el producto <%= Html.esc(p.getSkuCodigo()).replace("\\", "\\\\") %>?');">Eliminar</a>
                </td>
            </tr>
            <% } %>
            </tbody>
        </table>
        </div>
    </section>
</main>
<footer>Gun Service International S.A.S. · Proyecto ADSO SENA · GA7-220501096-AA2-EV02</footer>
</body>
</html>
