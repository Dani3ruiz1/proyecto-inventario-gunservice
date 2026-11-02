<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="com.gunservice.model.Producto, com.gunservice.util.Html" %>
<%
    Producto producto = (Producto) request.getAttribute("producto");
    if (producto == null) {
        response.sendRedirect(request.getContextPath() + "/ProductoServlet?accion=listar");
        return;
    }
%>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Editar producto - Gun Service International</title>
    <link rel="stylesheet" href="<%= request.getContextPath() %>/css/estilos.css">
</head>
<body>
<nav>
    <span class="marca">GUN SERVICE INTERNATIONAL S.A.S.</span>
    <a href="<%= request.getContextPath() %>/ProductoServlet?accion=listar">Inventario</a>
</nav>

<main>
    <h1>Editar producto</h1>
    <section>
        <form class="grid" method="POST" action="<%= request.getContextPath() %>/ProductoServlet?accion=actualizar">
            <div><label for="sku">SKU Código (no editable)</label>
                <input id="sku" name="sku" value="<%= Html.esc(producto.getSkuCodigo()) %>" readonly></div>
            <div><label for="nombre">Nombre del producto</label>
                <input id="nombre" name="nombre" maxlength="100" required
                       value="<%= Html.esc(producto.getNombreProducto()) %>"></div>
            <div><label for="existencia">Existencia</label>
                <input id="existencia" name="existencia" type="number" min="0" step="1" required
                       value="<%= producto.getExistencia() %>"></div>
            <div><label for="valorVenta">Valor unitario alquiler/venta</label>
                <input id="valorVenta" name="valorVenta" type="number" min="0" step="any" required
                       value="<%= producto.getValorUnitarioVenta() %>"></div>
            <div class="acciones">
                <button class="btn" type="submit">Guardar cambios</button>
                <a class="btn sec" href="<%= request.getContextPath() %>/ProductoServlet?accion=listar">Cancelar</a>
            </div>
        </form>
    </section>
</main>
</body>
</html>
