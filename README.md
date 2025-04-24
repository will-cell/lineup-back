# LineUp - Backend

LineUp est une application de gestion de file d'attente pour les restaurants. Elle permet aux clients de s'inscrire dans la file d'attente d'un restaurant et d'être notifiés lorsque leur table est prête.

## 🚀 Fonctionnalités

- 👥 Gestion des utilisateurs (clients et restaurateurs)
- 🏪 Gestion des restaurants
- 🎟️ Gestion des tickets d'attente
- 📍 Recherche de restaurants par géolocalisation
- 📱 Notifications en temps réel

## 💻 Technologies

- Node.js
- TypeScript
- Express.js
- Supabase (Base de données PostgreSQL + Authentication)
- Architecture Clean / Hexagonale

## 📁 Structure du Projet

```
src/
├── application/        # Couche application (contrôleurs, middlewares)
├── domain/            # Couche domaine (entités, cas d'utilisation)
├── infrastructure/    # Couche infrastructure (BDD, services externes)
└── interfaces/        # Couche interfaces (routes HTTP)
```

## 🛠️ Installation

1. Cloner le repository
```bash
git clone https://github.com/votre-username/lineup-back.git
cd lineup-back
```

2. Installer les dépendances
```bash
npm install
# ou
yarn install
```

3. Configurer les variables d'environnement
```bash
cp .env.example .env
```
Puis modifiez le fichier `.env` avec vos propres valeurs.

4. Initialiser la base de données Supabase
- Créez un projet sur [Supabase](https://supabase.com)
- Exécutez les scripts SQL dans `src/infrastructure/database/`
  - `supabase_functions.sql` pour la structure
  - `seed_data.sql` pour les données de test (optionnel)

## 🚀 Démarrage

### Développement
```bash
npm run dev
# ou
yarn dev
```

### Production
```bash
npm run build
npm start
# ou
yarn build
yarn start
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/me` - Profil utilisateur

### Restaurants
- `GET /api/restaurants/nearby` - Liste des restaurants à proximité
- `GET /api/restaurants/:id` - Détails d'un restaurant
- `POST /api/restaurants` - Création d'un restaurant
- `PUT /api/restaurants/:id/settings` - Mise à jour des paramètres

### Tickets
- `POST /api/tickets` - Création d'un ticket
- `GET /api/tickets/restaurant/:restaurantId` - Liste des tickets actifs
- `POST /api/tickets/:id/cancel` - Annulation d'un ticket
- `POST /api/tickets/:id/notify` - Notification d'un client
- `POST /api/tickets/:id/seat` - Placement d'un client

## 🔐 Base de données

Les fichiers SQL dans `src/infrastructure/database/` contiennent :
- La structure de la base de données
- Des données de test pour la démo
- Des fonctions utilitaires

⚠️ Pour un environnement de production :
1. Utiliser des mots de passe sécurisés
2. Ne pas utiliser les données de test
3. Configurer correctement les variables d'environnement dans `.env`

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

MIT