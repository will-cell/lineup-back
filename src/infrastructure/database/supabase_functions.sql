-- Extension PostGIS pour la géolocalisation
create extension if not exists postgis;

-- Activation de l'extension pour générer des UUID
create extension if not exists "uuid-ossp";

-- Création de la table restaurants en premier (sans la contrainte owner_id pour le moment)
create table restaurants (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  owner_id uuid,  -- On ajoutera la référence plus tard
  location jsonb not null,
  capacity integer not null,
  waiting_time_per_ticket integer not null,
  notification_threshold integer not null,
  average_waiting_time float default 0,
  is_open boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Création de la table users
create table users (
  id uuid references auth.users primary key,
  email text unique,
  first_name text,
  last_name text,
  restaurant_id uuid references restaurants(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ajout de la contrainte de clé étrangère pour owner_id dans restaurants
alter table restaurants 
add constraint restaurants_owner_id_fkey 
foreign key (owner_id) 
references users(id);

-- Création de la table tickets
create table tickets (
  id uuid default uuid_generate_v4() primary key,
  restaurant_id uuid references restaurants(id) not null,
  user_id uuid references users(id) not null,
  party_size integer not null,
  first_name text not null,
  last_name text not null,
  status text not null,
  waiting_time float default 0,
  estimated_arrival_time timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index pour la géolocalisation
create index restaurants_location_idx on restaurants using gin (location);

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