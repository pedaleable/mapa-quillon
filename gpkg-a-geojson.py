# coding: utf-8
import geopandas as gpd
df = gpd.read_file("geodatos/levantamiento.gpkg")
df = df.to_crs(4326)
df.to_file("geodatos/levantamiento.geojson")
