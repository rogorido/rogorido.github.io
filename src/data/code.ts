export const codesql = `CREATE OR REPLACE FUNCTION order_absent_dioceses_edm (order_searching INT)
  RETURNS TABLE (
    r_order_id int, r_order_acronym varchar, r_order_nickname varchar,
    r_diocese_id INT, r_diocese_name varchar, r_country VARCHAR)
LANGUAGE  plpgsql
AS $$

BEGIN
  RETURN query
  WITH diocconfrailes AS
   (SELECT DISTINCT diocese_id, order_id FROM vistas.b_edm_ss_sa b),
   -- cruzamos todos los datosde diócesis y órdenes
  cruzada AS
    (SELECT r.order_id,
      CASE
        WHEN r.year_foundation = '4th Century' THEN '350'
        WHEN r.year_foundation = '6th Century' THEN '550'
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

   -- lo hacemosmás presentable
  SELECT d.order_id, r.order_acronym, r.order_nickname,
         diocese_id, dd.diocese_name, p.country
  FROM diocorrg d
  JOIN general.dioceses dd USING(diocese_id)
  LEFT JOIN general.places p USING(place_id)
  WHERE d.order_id = order_searching
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

export const codecpp = `class AprobacionesTableModel : public QAbstractTableModel {
  Q_OBJECT

 public:
  explicit AprobacionesTableModel(QObject *parent = 0);

  // Basic functionality:
  int rowCount(const QModelIndex &parent = QModelIndex()) const override;
  int columnCount(const QModelIndex &parent = QModelIndex()) const override;
  QVariant headerData(int section, Qt::Orientation orientation,
                      int role) const override;

  QVariant data(const QModelIndex &index,
                int role = Qt::DisplayRole) const override;

  QList<Aprobacion *> getLista();

  void anadirAprobacion(Aprobacion *aprobracion);
  void quitarAprobacion(const int row);

 private:
  QList<Aprobacion *> lista_aprobaciones;
};
`;

export const codejs = `async function routes(fastify, options) {
  const persons = fastify.mongo.atlanto.db.collection("persons");

  fastify.get("/version", versionSchema, async (request, reply) => {
    return { version: process.env.npm_package_version };
  });

  fastify.get("/eventstypes", eventstypesSchema, async (request, reply) => {
    try {
      const result = await persons.aggregate(q.eventstypes).toArray();
      reply.status(200).send(result);
    } catch (error) {
      console.error(error);
      reply.status(500).send("Error in the server or in the query");
    }
  });
}`;
