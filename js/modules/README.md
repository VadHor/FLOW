# ProjectFlow ULTRA - Architecture Modulaire

## 📁 Structure des Modules

Ce dossier contient les modules JavaScript de ProjectFlow ULTRA, organisés de manière modulaire pour faciliter la maintenance et l'évolution du code.

## 🧩 Modules Disponibles

### 1. **taskModal.js** - Modale de Tâche avec Onglets
Gère l'interface de création/modification de tâches avec une navigation par onglets.

**Onglets disponibles :**
- **Général** : Titre, description, projet, statut, priorité, checklist
- **Planification** : Échéance, récurrence, estimation de temps, timer, notes de réunion
- **Participants** : Sélection et gestion des participants, export ICS
- **Avancé** : Tags, champs personnalisés, suppression

**Fonctionnalités clés :**
- Interface à onglets pour une meilleure organisation
- Checklist intégrée avec suivi de progression
- Timer/chronomètre pour le suivi du temps
- Gestion des champs personnalisés
- Export et envoi par email

---

### 2. **calendar.js** - Calendrier avec Drag & Drop
Fournit un calendrier interactif permettant de déplacer les tâches entre les jours.

**Fonctionnalités clés :**
- Vue mois et vue semaine
- Drag & drop natif pour déplacer les tâches
- Affichage visuel des priorités (urgent, important)
- Navigation intuitive (mois précédent/suivant, aujourd'hui)
- Création rapide de tâches sur une date spécifique
- Légende de couleurs pour les priorités

**API principale :**
```javascript
app.handleCalendarDragStart(event, task)   // Début du drag
app.handleCalendarDrop(event, date)        // Drop sur une date
app.getTasksForDate(date)                  // Récupérer les tâches d'un jour
app.setCalendarView('month'|'week')        // Changer la vue
```

---

### 3. **advancedSearch.js** - Recherche Avancée
Module de recherche avancée avec filtres multiples pour trouver rapidement des tâches.

**Filtres disponibles :**
- Recherche textuelle (titre, description, notes)
- Projet
- Statut
- Tags
- Participants
- Plage de dates (date de début et de fin)
- Priorités (urgent, important)
- État (en retard)

**Fonctionnalités clés :**
- Panneau de filtres dépliable
- Combinaison de multiples filtres
- Compteur de filtres actifs
- Affichage du nombre de résultats en temps réel
- Réinitialisation rapide des filtres

**API principale :**
```javascript
app.toggleAdvancedSearch()           // Afficher/masquer les filtres
app.getFilteredTasks()               // Obtenir les tâches filtrées
app.resetSearchFilters()             // Réinitialiser tous les filtres
app.getActiveFiltersCount()          // Nombre de filtres actifs
```

---

### 4. **dashboard.js** - Dashboard Personnalisable
Dashboard avec widgets déplaçables et configurables selon les besoins de l'utilisateur.

**Widgets disponibles :**
- **Vue d'ensemble** : Statistiques globales (total, terminées, urgentes, en retard)
- **Tâches urgentes** : Liste des 5 tâches les plus urgentes
- **Échéances à venir** : Tâches des 7 prochains jours
- **Progression des projets** : Barres de progression par projet
- **Activité récente** : Dernières tâches modifiées
- **Timer actif** : Affichage et contrôle du timer en cours

**Fonctionnalités clés :**
- Configuration des widgets (activer/désactiver)
- Réorganisation des widgets (monter/descendre)
- Sauvegarde automatique de la configuration
- Interface de configuration intuitive
- Widgets responsifs et interactifs

**API principale :**
```javascript
app.toggleWidget(widgetId)           // Activer/désactiver un widget
app.moveWidgetUp(widgetId)           // Déplacer vers le haut
app.moveWidgetDown(widgetId)         // Déplacer vers le bas
app.getEnabledWidgets()              // Obtenir les widgets actifs
app.getGlobalStats()                 // Statistiques globales
```

---

## 🔧 Utilisation

### Chargement des Modules

Les modules sont actuellement chargés comme des scripts globaux. Pour une future migration vers ES modules :

```html
<!-- Dans index.html -->
<script src="/js/modules/taskModal.js"></script>
<script src="/js/modules/calendar.js"></script>
<script src="/js/modules/advancedSearch.js"></script>
<script src="/js/modules/dashboard.js"></script>
<script src="/js/app.js"></script>
```

### Initialisation

```javascript
// L'application s'initialise automatiquement avec Alpine.js
function app() {
    return window.initModularApp();
}
```

Chaque module expose un objet avec :
- Une méthode `init(app)` qui initialise le module
- Des méthodes de génération HTML (si applicable)
- Des fonctions utilitaires

---

## 📝 Convention de Code

### Structure d'un Module

```javascript
export const ModuleName = {
    /**
     * Initialise le module
     * @param {Object} app - Instance de l'application Alpine.js
     * @returns {Object} - L'instance app enrichie
     */
    init(app) {
        // Ajouter des propriétés à app
        app.newProperty = ...;

        // Ajouter des méthodes à app
        app.newMethod = function() { ... };

        return app;
    },

    /**
     * Génère le HTML du module
     * @returns {String} - HTML du module
     */
    getHTML() {
        return `...`;
    }
};
```

### Bonnes Pratiques

1. **Isolation** : Chaque module est autonome et ne dépend pas des autres
2. **Documentation** : Chaque fonction est documentée avec JSDoc
3. **Nommage** : Utilisez des noms descriptifs et cohérents
4. **Performance** : Évitez les calculs lourds dans les getters
5. **Réactivité** : Toutes les propriétés ajoutées à `app` sont réactives avec Alpine.js

---

## 🚀 Extensions Futures

### Migration vers ES Modules

Pour une vraie architecture modulaire avec imports/exports :

```javascript
// taskModal.js
export class TaskModal {
    constructor(app) {
        this.app = app;
    }

    init() { ... }
}

// app.js
import { TaskModal } from './modules/taskModal.js';
import { Calendar } from './modules/calendar.js';

const taskModal = new TaskModal(app);
taskModal.init();
```

### Ajout de Nouveaux Modules

1. Créer un nouveau fichier dans `/js/modules/`
2. Suivre la structure de module établie
3. Exposer le module sur `window` pour l'instant
4. Initialiser dans `app.js`
5. Documenter dans ce README

---

## 🐛 Débogage

Pour déboguer les modules, ouvrez la console du navigateur :

```javascript
// Vérifier les modules chargés
console.log(window.FLOW_MODULES);

// Vérifier l'instance app
console.log(Alpine.raw($data));

// Tester une fonction de module
app.getFilteredTasks();
app.getTasksForDate(new Date());
```

---

## 📄 License

Partie du projet ProjectFlow ULTRA
