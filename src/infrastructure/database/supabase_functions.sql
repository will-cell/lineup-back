-- Extension PostGIS pour la géolocalisation
create extension if not exists postgis;

-- Fonction pour trouver les restaurants à proximité
create or replace function find_restaurants_nearby(lat float, lng float, radius_km float)
returns setof restaurants
language plpgsql
as $$
begin
  return query
  select *
  from restaurants
  where ST_DWithin(
    ST_SetSRID(ST_MakePoint(location->>'longitude', location->>'latitude')::geography, 4326),
    ST_SetSRID(ST_MakePoint(lng, lat)::geography, 4326),
    radius_km * 1000
  );
end;
$$;

-- Fonction pour calculer le temps d'attente moyen d'un restaurant
create or replace function calculate_average_waiting_time(restaurant_id uuid)
returns restaurants
language plpgsql
as $$
declare
  avg_time float;
  restaurant_record restaurants%rowtype;
begin
  -- Calculer le temps moyen des tickets terminés des dernières 24h
  select avg(waiting_time)
  into avg_time
  from tickets
  where restaurant_id = $1
    and status = 'seated'
    and updated_at >= now() - interval '24 hours';

  -- Mettre à jour le restaurant avec le nouveau temps moyen
  update restaurants
  set average_waiting_time = coalesce(avg_time, 0)
  where id = $1
  returning * into restaurant_record;

  return restaurant_record;
end;
$$;

-- Fonction pour mettre à jour le temps d'attente d'un ticket
create or replace function update_ticket_waiting_time(ticket_id uuid)
returns tickets
language plpgsql
as $$
declare
  ticket_record tickets%rowtype;
begin
  update tickets
  set waiting_time = extract(epoch from (now() - created_at))/60
  where id = $1
  returning * into ticket_record;

  return ticket_record;
end;
$$;