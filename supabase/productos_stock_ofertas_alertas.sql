ALTER TABLE productos
  ADD COLUMN IF NOT EXISTS stock_actual integer NOT NULL DEFAULT 0 CHECK (stock_actual >= 0);

ALTER TABLE promociones
  ADD COLUMN IF NOT EXISTS tipo text NOT NULL DEFAULT 'promocion' CHECK (tipo IN ('promocion', 'oferta'));

CREATE INDEX IF NOT EXISTS idx_productos_stock_actual ON productos(stock_actual);
CREATE INDEX IF NOT EXISTS idx_promociones_tipo_fechas ON promociones(tipo, activa, fecha_inicio, fecha_fin);

CREATE OR REPLACE FUNCTION sincronizar_alerta_stock_producto()
RETURNS trigger AS $$
DECLARE
  alerta_id uuid;
BEGIN
  SELECT id INTO alerta_id
  FROM alertas
  WHERE tipo = 'stock_bajo'
    AND referencia_tabla = 'productos'
    AND referencia_id = NEW.id
  ORDER BY created_at DESC
  LIMIT 1;

  IF NEW.stock_actual > 3 THEN
    IF alerta_id IS NOT NULL THEN
      UPDATE alertas SET leida = true, updated_at = now() WHERE id = alerta_id;
    END IF;
    RETURN NEW;
  END IF;

  IF alerta_id IS NULL THEN
    INSERT INTO alertas (tipo, titulo, mensaje, nivel, leida, referencia_tabla, referencia_id)
    VALUES (
      'stock_bajo',
      CASE WHEN NEW.stock_actual <= 0 THEN 'Producto agotado: ' || NEW.nombre ELSE 'Stock bajo: ' || NEW.nombre END,
      CASE
        WHEN NEW.stock_actual <= 0 THEN NEW.nombre || ' no tiene stock disponible. La tarjeta publica se mostrara como agotada.'
        ELSE 'Quedan ' || NEW.stock_actual || ' unidades de ' || NEW.nombre || '. Reponer inventario para evitar quedar sin ventas.'
      END,
      CASE WHEN NEW.stock_actual <= 0 THEN 'critica' ELSE 'advertencia' END,
      false,
      'productos',
      NEW.id
    );
  ELSE
    UPDATE alertas
    SET
      titulo = CASE WHEN NEW.stock_actual <= 0 THEN 'Producto agotado: ' || NEW.nombre ELSE 'Stock bajo: ' || NEW.nombre END,
      mensaje = CASE
        WHEN NEW.stock_actual <= 0 THEN NEW.nombre || ' no tiene stock disponible. La tarjeta publica se mostrara como agotada.'
        ELSE 'Quedan ' || NEW.stock_actual || ' unidades de ' || NEW.nombre || '. Reponer inventario para evitar quedar sin ventas.'
      END,
      nivel = CASE WHEN NEW.stock_actual <= 0 THEN 'critica' ELSE 'advertencia' END,
      leida = false,
      updated_at = now()
    WHERE id = alerta_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_productos_stock_alerta ON productos;
CREATE TRIGGER trg_productos_stock_alerta
AFTER INSERT OR UPDATE OF stock_actual, nombre ON productos
FOR EACH ROW EXECUTE FUNCTION sincronizar_alerta_stock_producto();
