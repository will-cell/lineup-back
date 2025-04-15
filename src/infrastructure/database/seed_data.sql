-- Création des utilisateurs dans auth.users
-- Remarque : le mot de passe est 'password123' pour tous les utilisateurs
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at
)
VALUES
    (
        '550e8400-e29b-41d4-a716-446655440000',
        'pierre.dupont@example.com',
        crypt('password123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW()
    ),
    (
        '550e8400-e29b-41d4-a716-446655440001',
        'marie.martin@example.com',
        crypt('password123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW()
    ),
    (
        '550e8400-e29b-41d4-a716-446655440002',
        'jean.dubois@example.com',
        crypt('password123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW()
    ),
    (
        '550e8400-e29b-41d4-a716-446655440003',
        'sophie.bernard@example.com',
        crypt('password123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW()
    ),
    (
        '550e8400-e29b-41d4-a716-446655440004',
        'thomas.petit@example.com',
        crypt('password123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW()
    ),
    (
        '550e8400-e29b-41d4-a716-446655440005',
        'julie.moreau@example.com',
        crypt('password123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW()
    );

-- Insertion des utilisateurs propriétaires de restaurants dans notre table users
INSERT INTO public.users (id, email, first_name, last_name, created_at, updated_at)
VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'pierre.dupont@example.com', 'Pierre', 'Dupont', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440001', 'marie.martin@example.com', 'Marie', 'Martin', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440002', 'jean.dubois@example.com', 'Jean', 'Dubois', NOW(), NOW());

-- Insertion des restaurants avec les nouvelles colonnes séparées
INSERT INTO restaurants (
  id, name, owner_id, latitude, longitude, address, capacity, 
  waiting_time_per_ticket, notification_threshold, 
  average_waiting_time, is_open
)
VALUES
  (
    '660e8400-e29b-41d4-a716-446655440000',
    'Le Bistrot Parisien',
    '550e8400-e29b-41d4-a716-446655440000',
    48.8566,
    2.3522,
    '15 Rue de la Paix, Paris',
    50,
    15,
    10,
    20,
    true
  ),
  (
    '660e8400-e29b-41d4-a716-446655440001',
    'La Brasserie du Port',
    '550e8400-e29b-41d4-a716-446655440001',
    43.2965,
    5.3698,
    '10 Quai du Port, Marseille',
    75,
    20,
    15,
    25,
    true
  ),
  (
    '660e8400-e29b-41d4-a716-446655440002',
    'L''Auberge Lyonnaise',
    '550e8400-e29b-41d4-a716-446655440002',
    45.7640,
    4.8357,
    '5 Rue des Marronniers, Lyon',
    40,
    12,
    8,
    15,
    true
  );

-- Mise à jour des utilisateurs avec leur restaurant_id
UPDATE users
SET restaurant_id = '660e8400-e29b-41d4-a716-446655440000'
WHERE id = '550e8400-e29b-41d4-a716-446655440000';

UPDATE users
SET restaurant_id = '660e8400-e29b-41d4-a716-446655440001'
WHERE id = '550e8400-e29b-41d4-a716-446655440001';

UPDATE users
SET restaurant_id = '660e8400-e29b-41d4-a716-446655440002'
WHERE id = '550e8400-e29b-41d4-a716-446655440002';

-- Insertion des utilisateurs clients
INSERT INTO users (id, email, first_name, last_name, created_at, updated_at)
VALUES
  ('550e8400-e29b-41d4-a716-446655440003', 'sophie.bernard@example.com', 'Sophie', 'Bernard', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440004', 'thomas.petit@example.com', 'Thomas', 'Petit', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440005', 'julie.moreau@example.com', 'Julie', 'Moreau', NOW(), NOW());

-- Insertion des tickets
INSERT INTO tickets (
  id, restaurant_id, user_id,
  party_size, first_name, last_name,
  status, waiting_time, estimated_arrival_time,
  created_at, updated_at
)
VALUES
  (
    '770e8400-e29b-41d4-a716-446655440000',
    '660e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440003',
    4, 'Sophie', 'Bernard',
    'waiting', 10,
    NOW() + INTERVAL '30 minutes',
    NOW() - INTERVAL '10 minutes', NOW()
  ),
  (
    '770e8400-e29b-41d4-a716-446655440001',
    '660e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440004',
    2, 'Thomas', 'Petit',
    'notified', 25,
    NOW() + INTERVAL '10 minutes',
    NOW() - INTERVAL '25 minutes', NOW()
  ),
  (
    '770e8400-e29b-41d4-a716-446655440002',
    '660e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440005',
    6, 'Julie', 'Moreau',
    'waiting', 5,
    NOW() + INTERVAL '45 minutes',
    NOW() - INTERVAL '5 minutes', NOW()
  ),
  (
    '770e8400-e29b-41d4-a716-446655440003',
    '660e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440004',
    3, 'Thomas', 'Petit',
    'seated', 35,
    NOW() - INTERVAL '5 minutes',
    NOW() - INTERVAL '40 minutes', NOW()
  );