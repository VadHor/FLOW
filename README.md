# 🚀 ProjectFlow ULTRA

> Application de gestion de projet moderne et intuitive, 100% Swiss Made.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Made in Switzerland](https://img.shields.io/badge/Made%20in-Switzerland-red.svg)](https://www.myswitzerland.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-success.svg)](https://web.dev/progressive-web-apps/)

**ProjectFlow** est une application de gestion de projet complète et moderne, développée avec les dernières technologies web. Elle offre une expérience utilisateur fluide et intuitive pour organiser vos projets, tâches et contacts, le tout sans nécessiter de serveur backend.

---

## ✨ Fonctionnalités

### 📊 Gestion de Projet
- **Dashboard/Cockpit** - Vue d'ensemble avec KPIs et métriques en temps réel
- **Kanban Drag & Drop** - Tableau visuel avec 4 colonnes personnalisables
- **Matrice Eisenhower** - Priorisez vos tâches par urgence et importance
- **Roadmap/Timeline** - Visualisation chronologique de vos projets
- **Vue Calendrier** - Calendrier mensuel avec navigation et gestion des échéances

### ✅ Gestion des Tâches
- **Tâches Récurrentes** - Créez des tâches quotidiennes, hebdomadaires ou mensuelles
- **Timer Intégré** - Chronomètre pour suivre le temps passé sur chaque tâche
- **Système de Tags** - Organisez et filtrez vos tâches avec des tags colorés
- **Champs Personnalisés** - Ajoutez des données métier spécifiques
- **Checklist** - Sous-tâches avec cases à cocher
- **Notes de Réunion** - Prenez des notes directement dans vos tâches

### 👥 Collaboration
- **Gestion des Contacts** - Carnet d'adresses intégré
- **Attribution de Tâches** - Assignez des participants à vos tâches
- **Export ICS** - Générez des fichiers calendrier pour partager vos tâches
- **Envoi par Email** - Envoyez les détails de tâches par email

### 📈 Productivité
- **Export Excel** - Rapports détaillés au format XLSX
- **Export/Import JSON** - Sauvegarde et restauration complète de vos données
- **Mode Sombre/Clair** - Interface adaptative pour réduire la fatigue oculaire
- **Notifications Navigateur** - Alertes 15min avant échéance et pour tâches en retard
- **Recherche Globale** - Trouvez rapidement vos projets, tâches et contacts

### 📱 Moderne
- **PWA Installable** - Installez l'app sur desktop et mobile
- **Mode Hors Ligne** - Fonctionne sans connexion internet
- **Responsive Design** - S'adapte à tous les écrans
- **Performance Optimisée** - Application rapide et fluide

---

## 🛠️ Technologies

ProjectFlow est construit avec des technologies web modernes et performantes :

| Technologie | Version | Usage |
|------------|---------|-------|
| **Alpine.js** | 3.13.3 | Framework JavaScript réactif et léger |
| **Tailwind CSS** | Latest | Framework CSS utility-first |
| **SortableJS** | 1.15.0 | Drag & drop pour Kanban et listes |
| **SheetJS** | 0.20.0 | Export Excel (XLSX) |
| **Font Awesome** | 6.4.0 | Bibliothèque d'icônes |
| **LocalStorage API** | - | Stockage local des données |
| **Service Worker** | - | PWA et cache offline |
| **Notifications API** | - | Notifications navigateur |

**Stack technique** : HTML5, CSS3, JavaScript ES6+, Progressive Web App

---

## 🚀 Démarrage Rapide

### Option 1 : Utilisation en ligne (GitHub Pages)

Visitez simplement : **[https://vadhor.github.io/FLOW](https://vadhor.github.io/FLOW)**

L'application est immédiatement utilisable, aucune installation requise !

### Option 2 : Installation locale

```bash
# 1. Cloner le repository
git clone https://github.com/VadHor/FLOW.git
cd FLOW

# 2. Ouvrir index.html dans votre navigateur
# Ou utiliser un serveur local (recommandé pour le Service Worker)

# Avec Python 3
python -m http.server 8000

# Avec Node.js (npx)
npx serve .

# Avec Node.js (http-server)
npm install -g http-server
http-server

# Puis ouvrir : http://localhost:8000
```

**C'est tout !** Aucune dépendance à installer, aucun build nécessaire.

---

## 📱 Installation PWA

ProjectFlow peut être installé comme une application native sur votre appareil :

### 🖥️ Chrome Desktop (Windows/Mac/Linux)

1. Ouvrez ProjectFlow dans Chrome
2. Cliquez sur l'icône **⊕** (Installer) dans la barre d'adresse
3. Cliquez sur "Installer"
4. L'application apparaît dans votre menu Démarrer / Applications

### 🍎 Safari iOS (iPhone/iPad)

1. Ouvrez ProjectFlow dans Safari
2. Tapez sur le bouton **Partager** (⎋)
3. Faites défiler et sélectionnez **"Sur l'écran d'accueil"**
4. Tapez **"Ajouter"**
5. L'icône apparaît sur votre écran d'accueil

### 🤖 Chrome Android

1. Ouvrez ProjectFlow dans Chrome
2. Tapez sur le menu **⋮** (trois points)
3. Sélectionnez **"Installer l'application"** ou **"Ajouter à l'écran d'accueil"**
4. Confirmez l'installation
5. L'icône apparaît sur votre écran d'accueil

**Avantages PWA** :
- ✅ Lancement rapide depuis l'écran d'accueil
- ✅ Fonctionne hors ligne
- ✅ Expérience plein écran (pas de barre d'URL)
- ✅ Notifications même quand l'app est fermée

---

## 💾 Gestion des Données

### 📦 Stockage Local

Toutes vos données sont stockées **localement** dans le navigateur (LocalStorage) :
- ✅ Accès instantané
- ✅ Aucune latence réseau
- ✅ Confidentialité totale
- ⚠️ Limité à ~5-10 MB par domaine

### 💼 Export / Import

#### Backup JSON
Pour sauvegarder toutes vos données :
1. Cliquez sur **"Backup (JSON)"** dans la sidebar
2. Le fichier `projectflow-backup-YYYY-MM-DD.json` est téléchargé
3. Conservez ce fichier précieusement !

#### Restauration JSON
Pour restaurer vos données :
1. Cliquez sur **"Restore (JSON)"**
2. Sélectionnez votre fichier de backup
3. Vos données sont restaurées instantanément

#### Export Excel
Pour générer un rapport :
1. Allez dans le **Dashboard**
2. Cliquez sur **"Rapport Excel"**
3. Un fichier XLSX est généré avec :
   - Liste des projets
   - Liste des tâches
   - Statistiques
   - Formatage professionnel

**Recommandation** : Faites des backups réguliers de vos données !

---

## 🔒 Confidentialité & Sécurité

ProjectFlow respecte votre vie privée :

| ✅ Ce que nous FAISONS | ❌ Ce que nous NE FAISONS PAS |
|------------------------|-------------------------------|
| Stocker vos données localement | Envoyer vos données à un serveur |
| Fonctionner hors ligne | Utiliser des cookies tiers |
| Respecter le RGPD | Tracker votre activité |
| Chiffrer les données en transit (HTTPS) | Collecter des informations personnelles |

**100% de vos données restent sur votre appareil.**

- 🔐 Aucune authentification requise
- 🔐 Aucune connexion internet nécessaire (après le premier chargement)
- 🔐 Aucun serveur backend
- 🔐 Code source ouvert (MIT License)

---

## 📸 Captures d'écran

### Dashboard / Cockpit
<!-- ![Dashboard](./screenshots/dashboard.png) -->
*Vue d'ensemble avec KPIs, progression des projets et métriques clés*

### Kanban
<!-- ![Kanban](./screenshots/kanban.png) -->
*Tableau Kanban avec drag & drop, filtrage par projet et tags*

### Vue Calendrier
<!-- ![Calendrier](./screenshots/calendar.png) -->
*Calendrier mensuel avec visualisation des tâches et échéances*

### Matrice Eisenhower
<!-- ![Eisenhower](./screenshots/eisenhower.png) -->
*Matrice de priorisation par urgence et importance*

### Mode Sombre
<!-- ![Dark Mode](./screenshots/dark-mode.png) -->
*Interface complète en mode sombre pour réduire la fatigue oculaire*

> 💡 **Note** : Les captures d'écran seront ajoutées prochainement

---

## 🗺️ Roadmap

### ✅ Version 1.0 (Actuelle)
- [x] Dashboard avec KPIs
- [x] Kanban drag & drop
- [x] Matrice Eisenhower
- [x] Gestion des projets
- [x] Gestion des contacts
- [x] Roadmap/Timeline
- [x] Vue Calendrier mensuelle
- [x] Tâches récurrentes
- [x] Timer/Chronomètre intégré
- [x] Système de tags avec filtrage
- [x] Notifications navigateur
- [x] PWA installable
- [x] Mode sombre/clair
- [x] Export Excel
- [x] Export/Import JSON
- [x] Génération fichiers ICS

### 🔮 Version 2.0 (Planifiée)
- [ ] **Synchronisation Cloud** (optionnel)
  - Support Dropbox, Google Drive
  - Synchronisation multi-appareils
  - Gestion des conflits
- [ ] **Mode Collaboratif** (optionnel)
  - Partage de projets
  - Commentaires sur tâches
  - Notifications en temps réel
- [ ] **Analytics Avancés**
  - Graphiques de productivité
  - Rapports personnalisés
  - Prédictions IA
- [ ] **Intégrations**
  - Calendrier Google/Outlook
  - Slack/Teams
  - GitHub/GitLab issues
- [ ] **Accessibilité**
  - Support complet ARIA
  - Navigation clavier optimisée
  - Mode haute contraste

### 💡 Idées futures
- Templates de projets
- Vue Gantt
- Sous-tâches infinies
- Vue Board (alternative au Kanban)
- Thèmes personnalisables
- Import depuis Trello/Asana/Jira

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment contribuer :

### 🐛 Signaler un bug

1. Vérifiez que le bug n'a pas déjà été signalé dans [Issues](https://github.com/VadHor/FLOW/issues)
2. Créez une nouvelle issue avec :
   - Description claire du problème
   - Étapes pour reproduire
   - Comportement attendu vs actuel
   - Captures d'écran si pertinent
   - Navigateur et version

### ✨ Proposer une fonctionnalité

1. Ouvrez une issue avec le tag `enhancement`
2. Décrivez clairement la fonctionnalité souhaitée
3. Expliquez le cas d'usage et les bénéfices
4. Attendez les retours avant de commencer le développement

### 🔧 Soumettre un Pull Request

```bash
# 1. Forkez le repository
# 2. Créez une branche
git checkout -b feature/ma-super-fonctionnalite

# 3. Committez vos changements
git commit -m "feat: ajout de ma super fonctionnalité"

# 4. Pushez vers votre fork
git push origin feature/ma-super-fonctionnalite

# 5. Ouvrez un Pull Request
```

#### Convention de commits

Nous utilisons [Conventional Commits](https://www.conventionalcommits.org/) :

- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `docs:` Documentation
- `style:` Formatage, point-virgules manquants
- `refactor:` Refactorisation de code
- `perf:` Amélioration des performances
- `test:` Ajout de tests
- `chore:` Maintenance, dépendances

### 📋 Code de conduite

- Soyez respectueux et constructif
- Acceptez les critiques constructives
- Concentrez-vous sur ce qui est meilleur pour la communauté
- Faites preuve d'empathie envers les autres contributeurs

---

## 📄 Licence

Ce projet est sous licence **MIT** - voir le fichier [LICENSE](LICENSE) pour plus de détails.

```
MIT License

Copyright (c) 2024-2026 VadHor

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 👨‍💻 Auteur

**ProjectFlow ULTRA** a été développé avec ❤️ à **Genève, Suisse** 🇨🇭

- 🌐 GitHub: [@VadHor](https://github.com/VadHor)
- 📧 Email: [Contact](https://github.com/VadHor/FLOW/issues)
- 💼 Repository: [FLOW](https://github.com/VadHor/FLOW)

---

## 🙏 Remerciements

Merci aux créateurs et mainteneurs de :
- [Alpine.js](https://alpinejs.dev/) - The magical framework
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [SortableJS](https://sortablejs.github.io/Sortable/) - JavaScript library for reorderable drag-and-drop lists
- [SheetJS](https://sheetjs.com/) - Spreadsheet Data Toolkit
- [Font Awesome](https://fontawesome.com/) - The iconic font and CSS toolkit

---

## 📞 Support

Besoin d'aide ? Vous avez plusieurs options :

- 📖 Consultez ce README
- 🐛 [Ouvrez une issue](https://github.com/VadHor/FLOW/issues) pour les bugs
- 💡 [Démarrez une discussion](https://github.com/VadHor/FLOW/discussions) pour les questions
- ⭐ Donnez une étoile au projet si vous l'appréciez !

---

<div align="center">

**Made with ⚡ by developers, for developers**

[⬆ Retour en haut](#-projectflow-ultra)

</div>
