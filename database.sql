-- =====================================================================
-- GUN SERVICE INTERNATIONAL - Módulo de Persistencia JDBC
-- Script de base de datos compatible con MySQL 8.0
-- Evidencia: GA7-220501096-AA2-EV01
-- =====================================================================

CREATE DATABASE IF NOT EXISTS gun_service_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE gun_service_db;

DROP TABLE IF EXISTS producto;

CREATE TABLE producto (
    id_producto           INT          AUTO_INCREMENT PRIMARY KEY,
    id_categoria          SMALLINT     NOT NULL DEFAULT 1 COMMENT '1 = Armas de Fogueo',
    sku_codigo            VARCHAR(50)  NOT NULL UNIQUE,
    nombre_producto       VARCHAR(150) NOT NULL,
    existencia            INT          NOT NULL DEFAULT 0,
    valor_unitario_venta  FLOAT        NOT NULL,
    valor_unitario_compra FLOAT        NOT NULL
) ENGINE = InnoDB;

INSERT INTO producto (id_categoria, sku_codigo, nombre_producto, existencia, valor_unitario_venta, valor_unitario_compra) VALUES
    (1, 'ARM-FOG-001', 'Pistola de fogueo Beretta 92FS (utilería escénica)',        12, 180000, 120000),
    (1, 'ARM-FOG-002', 'Fusil de fogueo M4 Carbine (utilería escénica)',             6,  350000, 240000),
    (1, 'ARM-FOG-003', 'Revólver de fogueo Colt Python 357 (utilería escénica)',     8,  160000, 105000),
    (1, 'ARM-FOG-004', 'Escopeta de fogueo Remington 870 (utilería escénica)',       4,  290000, 195000),
    (1, 'ARM-FOG-005', 'Subfusil de fogueo HK MP5 (utilería escénica)',              5,  320000, 215000);

SELECT * FROM producto;
