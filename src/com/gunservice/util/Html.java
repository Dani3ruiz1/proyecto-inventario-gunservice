package com.gunservice.util;

/**
 * Utilidad para las vistas JSP: escapa texto antes de imprimirlo en HTML
 * y así evitar inyección de código (XSS).
 *
 * @author GUN SERVICE INTERNATIONAL - ADSO SENA
 * @version 1.0
 */
public final class Html {

    private Html() {
    }

    /**
     * Escapa los caracteres especiales de HTML.
     *
     * @param texto texto a mostrar; puede ser {@code null}
     * @return texto seguro para insertar en HTML ({@code ""} si era nulo)
     */
    public static String esc(String texto) {
        if (texto == null) {
            return "";
        }
        return texto.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
                .replace("\"", "&quot;").replace("'", "&#39;");
    }
}
