-- Ajout des nouvelles colonnes
ALTER TABLE restaurants
ADD COLUMN latitude double precision,
ADD COLUMN longitude double precision,
ADD COLUMN address text;

-- Migration des données depuis le JSONB vers les nouvelles colonnes
UPDATE restaurants
SET 
    latitude = (location->>'latitude')::double precision,
    longitude = (location->>'longitude')::double precision,
    address = location->>'address';

-- Vérification que les données ont été migrées correctement
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM restaurants 
        WHERE latitude IS NULL 
        OR longitude IS NULL 
        OR address IS NULL
    ) THEN
        RAISE EXCEPTION 'Migration incomplète : certaines données sont NULL';
    END IF;
END $$;

-- Suppression de la colonne JSONB
ALTER TABLE restaurants
DROP COLUMN location;

-- Mise à jour de la fonction find_restaurants_nearby pour utiliser les nouvelles colonnes
CREATE OR REPLACE FUNCTION find_restaurants_nearby(lat float, lng float, radius_km float)
RETURNS setof restaurants
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM restaurants
  WHERE ST_DWithin(
    ST_SetSRID(ST_MakePoint(longitude, latitude)::geography, 4326),
    ST_SetSRID(ST_MakePoint(lng, lat)::geography, 4326),
    radius_km * 1000
  );
END;
$$;