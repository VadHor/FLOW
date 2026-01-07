# Guide d'Intégration - Architecture Modulaire

## 🎯 Objectif

Ce guide explique comment intégrer les nouveaux modules dans votre application ProjectFlow existante.

## 📦 Modules Créés

Quatre nouveaux modules ont été créés dans `/js/modules/` :

1. **taskModal.js** - Modale de tâche avec onglets
2. **calendar.js** - Calendrier avec drag & drop
3. **advancedSearch.js** - Recherche avancée avec filtres
4. **dashboard.js** - Dashboard personnalisable avec widgets

## 🔧 Option 1 : Intégration Progressive (Recommandée)

Vous pouvez intégrer les modules progressivement sans casser l'existant.

### Étape 1 : Charger les scripts

Ajoutez ces lignes dans votre `index.html` avant la fermeture de `</body>` :

```html
<!-- Modules -->
<script>
    // Modules exposés globalement (compatible avec Alpine.js)
    // taskModal.js
    window.TaskModal = {
        init: function(app) {
            app.taskModalTab = 'general';
            app.switchTaskTab = function(tab) { this.taskModalTab = tab; };
            app.getTabClass = function(tab) {
                return this.taskModalTab === tab
                    ? 'border-b-4 border-primary-600 text-primary-600 dark:text-primary-400 font-bold'
                    : 'border-b-4 border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400';
            };
            return app;
        }
    };
</script>
<script src="/js/modules/taskModal.js"></script>
<script src="/js/modules/calendar.js"></script>
<script src="/js/modules/advancedSearch.js"></script>
<script src="/js/modules/dashboard.js"></script>
<script src="/js/app.js"></script>
```

### Étape 2 : Modifier la fonction app()

Dans votre `<script>` section où se trouve `function app()`, remplacez par :

```javascript
function app() {
    // Créer l'instance avec la nouvelle architecture modulaire
    const appInstance = window.initModularApp();

    // Conserver toutes vos fonctions existantes ici
    // ... (garder tout le code existant de votre fonction app)

    return appInstance;
}
```

### Étape 3 : Utiliser les nouveaux composants

#### Dashboard avec Widgets

Dans votre section dashboard, remplacez le contenu par :

```html
<div x-show="currentView === 'dashboard'">
    <div x-html="Dashboard ? Dashboard.getDashboardHTML() : 'Chargement...'"></div>
</div>
```

#### Calendrier avec Drag & Drop

Dans votre section calendrier, ajoutez :

```html
<div x-show="currentView === 'calendar'">
    <div x-html="Calendar ? Calendar.getCalendarHTML() : 'Chargement...'"></div>
</div>
```

#### Recherche Avancée

Ajoutez la barre de recherche avancée dans votre header ou sidebar :

```html
<div class="p-4">
    <div x-html="AdvancedSearch ? AdvancedSearch.getSearchBarHTML() : ''"></div>
</div>

<!-- Section des résultats -->
<div x-show="advancedSearchVisible || getActiveFiltersCount() > 0" class="p-4">
    <div x-html="AdvancedSearch ? AdvancedSearch.getResultsHTML() : ''"></div>
</div>
```

#### Modale Tâche avec Onglets

Remplacez votre modale de tâche existante par :

```html
<div x-show="modals.task"
     x-transition.opacity
     class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4"
     x-cloak>
    <div x-html="TaskModal ? TaskModal.getModalHTML() : ''"></div>
</div>
```

---

## 🚀 Option 2 : Intégration Complète

Pour une refonte complète avec la nouvelle architecture :

### 1. Créer un nouveau fichier index-v2.html

```html
<!DOCTYPE html>
<html lang="fr" class="light">
<head>
    <!-- Même head que l'original -->
</head>
<body x-data="app()" x-init="initApp()">
    <!-- Sidebar -->
    <aside>...</aside>

    <!-- Main Content -->
    <main>
        <!-- Dashboard avec widgets -->
        <div x-show="currentView === 'dashboard'" x-html="Dashboard.getDashboardHTML()"></div>

        <!-- Calendrier drag & drop -->
        <div x-show="currentView === 'calendar'" x-html="Calendar.getCalendarHTML()"></div>

        <!-- Autres vues (Kanban, Eisenhower, etc.) -->
        ...
    </main>

    <!-- Modales -->
    <div x-show="modals.task" x-html="TaskModal.getModalHTML()"></div>

    <!-- Scripts -->
    <script src="/js/modules/taskModal.js"></script>
    <script src="/js/modules/calendar.js"></script>
    <script src="/js/modules/advancedSearch.js"></script>
    <script src="/js/modules/dashboard.js"></script>
    <script src="/js/app.js"></script>

    <script>
        function app() {
            return window.initModularApp();
        }
    </script>
</body>
</html>
```

### 2. Tester la nouvelle version

1. Ouvrez `index-v2.html` dans votre navigateur
2. Vérifiez que tous les modules se chargent (console)
3. Testez chaque fonctionnalité
4. Une fois validé, remplacez `index.html` par `index-v2.html`

---

## 🎨 Personnalisation

### Modifier les Styles

Les modules utilisent les classes Tailwind existantes. Pour personnaliser :

```css
/* css/custom.css */
.task-modal-tab-active {
    @apply border-primary-600 text-primary-600 font-bold;
}

.calendar-day-hover {
    @apply hover:border-primary-400 hover:shadow-lg;
}
```

### Ajouter des Widgets au Dashboard

Dans `js/modules/dashboard.js`, ajoutez un nouveau widget :

```javascript
app.availableWidgets.push({
    id: 'custom-widget',
    name: 'Mon Widget',
    icon: 'fa-star',
    enabled: true
});
```

Puis créez la fonction de génération HTML :

```javascript
getCustomWidgetHTML() {
    return `<div>Mon contenu personnalisé</div>`;
}
```

---

## 🧪 Tests

### Test du Dashboard

```javascript
// Console navigateur
app.getGlobalStats()
// Doit retourner: { totalTasks: X, completedTasks: Y, ... }

app.getEnabledWidgets()
// Doit retourner: Array de widgets actifs
```

### Test du Calendrier

```javascript
app.getTasksForDate(new Date())
// Doit retourner: Array des tâches d'aujourd'hui

app.setCalendarView('week')
// Change la vue du calendrier
```

### Test de la Recherche

```javascript
app.searchFilters.urgent = true
app.getFilteredTasks()
// Doit retourner: Array des tâches urgentes uniquement
```

---

## 🐛 Dépannage

### Les modules ne se chargent pas

1. Vérifiez la console : `console.log(window.TaskModal)`
2. Vérifiez les chemins des scripts
3. Assurez-vous que `app.js` est chargé en dernier

### Alpine.js ne reconnaît pas les nouvelles fonctions

1. Les modules doivent être initialisés dans `initApp()`
2. Vérifiez que `initModules()` est appelé
3. Rechargez la page (Ctrl+F5)

### Le drag & drop ne fonctionne pas

1. Vérifiez que l'attribut `draggable="true"` est présent
2. Les handlers `@dragstart` et `@drop` doivent être définis
3. Testez avec `app.handleCalendarDragStart(event, task)`

---

## 📊 Comparaison Avant/Après

| Fonctionnalité | Avant | Après |
|----------------|-------|-------|
| Modale tâche | Simple formulaire | 4 onglets organisés |
| Calendrier | Affichage statique | Drag & drop interactif |
| Recherche | Recherche simple | Filtres multiples avancés |
| Dashboard | Vue fixe | Widgets personnalisables |
| Architecture | Monolithique | Modulaire |
| Maintenance | Difficile | Facile |
| Extensions | Compliquées | Simples |

---

## 🎓 Ressources

- **Documentation Alpine.js** : https://alpinejs.dev/
- **Tailwind CSS** : https://tailwindcss.com/
- **Drag & Drop API** : https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API

---

## ✅ Checklist d'Intégration

- [ ] Scripts chargés dans index.html
- [ ] Fonction app() modifiée
- [ ] Dashboard avec widgets testé
- [ ] Calendrier drag & drop testé
- [ ] Recherche avancée testée
- [ ] Modale à onglets testée
- [ ] Données existantes préservées
- [ ] Tests navigateurs (Chrome, Firefox, Safari)
- [ ] Tests mobile (responsive)
- [ ] Performance vérifiée

---

## 📞 Support

Pour toute question ou problème :
1. Consultez le README.md dans `/js/modules/`
2. Vérifiez la console navigateur pour les erreurs
3. Testez module par module pour isoler le problème
