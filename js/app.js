/**
 * ProjectFlow ULTRA - Application principale
 * Architecture modulaire
 */

// Import des modules (pour future migration vers ES modules)
// Pour l'instant, les modules sont chargés via des scripts séparés

/**
 * Fonction principale de l'application
 * Intègre tous les modules et initialise l'application
 */
window.initModularApp = function() {
    const app = {
        // États de base
        isDark: false,
        currentView: 'dashboard',
        searchQuery: '',
        filterProject: null,
        filterRoadmapProject: null,
        currentMonth: new Date().getMonth(),
        currentYear: new Date().getFullYear(),

        // Données
        projects: [],
        tasks: [],
        contacts: [],
        toasts: [],

        // Timer
        activeTimer: null,
        timerInterval: null,
        timers: {},

        // Tags
        filterTags: [],
        suggestedTags: ['Bug', 'Feature', 'Design', 'Backend', 'Frontend', 'Testing', 'Documentation', 'Urgent', 'Review'],
        newTag: '',

        // Notifications
        notificationsEnabled: false,
        notificationInterval: null,
        notifiedTasks: [],

        // Config
        kanbanColumns: ['À faire', 'En cours', 'En attente', 'Terminé'],
        eisenhowerQuadrants: [
            { u: true, i: true, title: 'Faire (Urgent & Important)', bgClass: 'bg-red-50 dark:bg-red-900/10', headerClass: 'text-red-700 dark:text-red-400', borderClass: 'border-l-red-500', icon: '<i class="fa-solid fa-fire"></i>' },
            { u: false, i: true, title: 'Planifier (Important)', bgClass: 'bg-blue-50 dark:bg-blue-900/10', headerClass: 'text-blue-700 dark:text-blue-400', borderClass: 'border-l-blue-500', icon: '<i class="fa-solid fa-calendar"></i>' },
            { u: true, i: false, title: 'Déléguer (Urgent)', bgClass: 'bg-amber-50 dark:bg-amber-900/10', headerClass: 'text-amber-700 dark:text-amber-400', borderClass: 'border-l-amber-500', icon: '<i class="fa-solid fa-user-clock"></i>' },
            { u: false, i: false, title: 'Éliminer', bgClass: 'bg-gray-100 dark:bg-gray-800/30', headerClass: 'text-gray-600 dark:text-gray-400', borderClass: 'border-l-gray-400', icon: '<i class="fa-solid fa-trash-can"></i>' }
        ],
        menuItems: [
            { id: 'dashboard', label: 'Cockpit', icon: 'fa-solid fa-chart-pie' },
            { id: 'roadmap', label: 'Roadmap', icon: 'fa-solid fa-route' },
            { id: 'calendar', label: 'Calendrier', icon: 'fa-solid fa-calendar-days' },
            { id: 'projects', label: 'Projets', icon: 'fa-solid fa-folder-open' },
            { id: 'kanban', label: 'Kanban', icon: 'fa-solid fa-table-columns' },
            { id: 'eisenhower', label: 'Matrice Eisenhower', icon: 'fa-solid fa-border-all' },
            { id: 'contacts', label: 'Contacts', icon: 'fa-solid fa-address-book' }
        ],

        // Modals
        modals: {
            project: false,
            task: false,
            contact: false,
            meeting: false,
            widgetConfig: false
        },

        // Objets temporaires pour les modals
        tempProject: {},
        tempTask: { participants: [], notes: '', customFields: {}, _customFieldsArray: [] },
        tempContact: {},
        tempMeeting: {},

        /**
         * Initialisation de l'application
         */
        initApp() {
            console.log('🚀 Initialisation de ProjectFlow ULTRA (Architecture Modulaire)');

            // Theme Init
            if (localStorage.getItem('pf_theme') === 'dark' || (!('pf_theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                this.isDark = true;
                document.documentElement.classList.add('dark');
            }

            // Charger les données
            this.load();
            if (this.projects.length === 0) this.seed();

            // Initialiser les modules
            this.initModules();

            // Charger les configurations
            this.loadTimers();
            this.loadNotificationSettings();

            console.log('✅ Application initialisée avec succès');
        },

        /**
         * Initialise tous les modules
         */
        initModules() {
            console.log('📦 Chargement des modules...');

            // Initialiser le module TaskModal (modale avec onglets)
            if (window.TaskModal) {
                window.TaskModal.init(this);
                console.log('  ✓ Module TaskModal chargé');
            }

            // Initialiser le module Calendar (drag & drop)
            if (window.Calendar) {
                window.Calendar.init(this);
                console.log('  ✓ Module Calendar chargé');
            }

            // Initialiser le module AdvancedSearch
            if (window.AdvancedSearch) {
                window.AdvancedSearch.init(this);
                console.log('  ✓ Module AdvancedSearch chargé');
            }

            // Initialiser le module Dashboard (widgets personnalisables)
            if (window.Dashboard) {
                window.Dashboard.init(this);
                console.log('  ✓ Module Dashboard chargé');
            }

            console.log('✅ Tous les modules sont chargés');
        }
    };

    return app;
};

/**
 * Configuration pour le chargement des modules
 * Cette configuration sera utilisée pour une future migration vers ES modules
 */
window.FLOW_MODULES = {
    taskModal: {
        name: 'TaskModal',
        path: '/js/modules/taskModal.js',
        description: 'Modale de tâche avec onglets (Général, Planification, Participants, Avancé)'
    },
    calendar: {
        name: 'Calendar',
        path: '/js/modules/calendar.js',
        description: 'Calendrier avec drag & drop pour déplacer les tâches'
    },
    advancedSearch: {
        name: 'AdvancedSearch',
        path: '/js/modules/advancedSearch.js',
        description: 'Recherche avancée avec filtres multiples'
    },
    dashboard: {
        name: 'Dashboard',
        path: '/js/modules/dashboard.js',
        description: 'Dashboard personnalisable avec widgets déplaçables'
    }
};

// Log de la version
console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║           🚀 ProjectFlow ULTRA v2.0                      ║
║           Architecture Modulaire                         ║
║                                                          ║
║  Nouvelles fonctionnalités:                              ║
║  • Modale tâche en onglets                               ║
║  • Calendrier drag & drop                                ║
║  • Recherche avancée avec filtres                        ║
║  • Dashboard personnalisable                             ║
║  • Code refactorisé en modules                           ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
`);
