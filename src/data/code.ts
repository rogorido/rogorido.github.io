export const codesql = `CREATE OR REPLACE FUNCTION order_absent_dioceses_edm (order_searching INT)
  RETURNS TABLE (
    r_order_id int, r_order_acronym varchar, r_order_nickname varchar,
    r_diocese_id INT, r_diocese_name varchar, r_country VARCHAR,
    r_longitude REAL, r_latitude real)
LANGUAGE  plpgsql
AS $$

BEGIN
  RETURN query
  WITH diocconfrailes AS
   (SELECT DISTINCT
     diocese_id, order_id
     FROM vistas.b_edm_ss_sa b),
-- cruzamos todos los datosde diócesis y órdenes
  cruzada AS
    (SELECT r.order_id,
      CASE
        WHEN r.year_foundation = '4th Century' THEN '350'
        WHEN r.year_foundation = '6th Century' THEN '550'
        WHEN r.year_foundation = '11th Century' THEN '1050'
        WHEN r.year_foundation = '13th Century' THEN '1250'
        WHEN r.year_foundation = '14th Century' THEN '1350'
        ELSE r.year_foundation
      END AS fundacionorder,
      diocese_id, (other_data->'gcatholic'->>'foundation')::integer AS fundaciondioc
     FROM general.dioceses d, general.religious_orders r),
-- miramos donde noestán
   diocsinfrailes AS (
     SELECT order_id, fundacionorder, diocese_id, fundaciondioc
     FROM cruzada c
     WHERE NOT EXISTS (SELECT 1, 2 FROM diocconfrailes df
                       WHERE df.diocese_id = c.diocese_id AND df.order_id = c.order_id )),
-- lo juntamostodo
    diocorrg AS (
     SELECT order_id, fundacionorder, diocese_id, fundaciondioc
     FROM diocsinfrailes) --WHERE fundacionorder::integer > fundaciondioc;
-- lo hacemosmás presentable
  SELECT d.order_id, r.order_acronym, r.order_nickname,
         diocese_id, dd.diocese_name, p.country,
         p.longitude, p.latitude
  FROM diocorrg d
  JOIN general.religious_orders r USING(order_id)
  JOIN general.dioceses dd USING(diocese_id)
  LEFT JOIN general.places p USING(place_id)
  WHERE d.order_id = order_searching
  ORDER BY dd.diocese_name;
END;
$$`;

export const coder = `library(RPostgreSQL)
library(tidyverse)

con <- dbConnect(drv= "PostgreSQL",
          dbname = "dominicos")

source("./dash/functions.R")

datossql <- getSQL("./sqls/ordenes_seriestemporales_edm.sql")
orrg_series_edm_general <- dbGetQuery(con, datossql)
orrg_series_edm_general$order_acronym <- factor(orrg_series_edm_general$order_acronym)
orrg_series_edm_general$country <- factor(orrg_series_edm_general$country)

p <- ggplot(orrg_series_edm_general, aes(x=serie, y= totalobispos)) +
    geom_line() + facet_wrap(~order_acronym)

ggsave(p, filename= 'series_obispos_general.png',
       path = dir_edm)`;
