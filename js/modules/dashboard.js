/**
 * Module de dashboard personnalisable avec widgets déplaçables
 */
export const Dashboard = {
    /**
     * Initialise le module de dashboard
     */
    init(app) {
        // Configuration des widgets disponibles
        app.availableWidgets = [
            { id: 'overview', name: 'Vue d\'ensemble', icon: 'fa-chart-pie', enabled: true },
            { id: 'tasks-urgent', name: 'Tâches urgentes', icon: 'fa-fire', enabled: true },
            { id: 'upcoming-tasks', name: 'Échéances à venir', icon: 'fa-calendar-check', enabled: true },
            { id: 'project-progress', name: 'Progression des projets', icon: 'fa-chart-line', enabled: true },
            { id: 'recent-activity', name: 'Activité récente', icon: 'fa-clock', enabled: true },
            { id: 'timer', name: 'Timer actif', icon: 'fa-stopwatch', enabled: true }
        ];

        // Charger la configuration des widgets depuis le localStorage
        app.loadWidgetConfig = function() {
            const config = localStorage.getItem('pf_widget_config');
            if (config) {
                try {
                    const parsed = JSON.parse(config);
                    this.availableWidgets = parsed;
                } catch (e) {
                    console.error('Error loading widget config:', e);
                }
            }
        };

        // Sauvegarder la configuration des widgets
        app.saveWidgetConfig = function() {
            localStorage.setItem('pf_widget_config', JSON.stringify(this.availableWidgets));
        };

        // Basculer l'activation d'un widget
        app.toggleWidget = function(widgetId) {
            const widget = this.availableWidgets.find(w => w.id === widgetId);
            if (widget) {
                widget.enabled = !widget.enabled;
                this.saveWidgetConfig();
            }
        };

        // Obtenir les widgets activés
        app.getEnabledWidgets = function() {
            return this.availableWidgets.filter(w => w.enabled);
        };

        // Déplacer un widget vers le haut
        app.moveWidgetUp = function(widgetId) {
            const index = this.availableWidgets.findIndex(w => w.id === widgetId);
            if (index > 0) {
                const widget = this.availableWidgets[index];
                this.availableWidgets.splice(index, 1);
                this.availableWidgets.splice(index - 1, 0, widget);
                this.saveWidgetConfig();
            }
        };

        // Déplacer un widget vers le bas
        app.moveWidgetDown = function(widgetId) {
            const index = this.availableWidgets.findIndex(w => w.id === widgetId);
            if (index < this.availableWidgets.length - 1) {
                const widget = this.availableWidgets[index];
                this.availableWidgets.splice(index, 1);
                this.availableWidgets.splice(index + 1, 0, widget);
                this.saveWidgetConfig();
            }
        };

        // Obtenir les tâches urgentes
        app.getUrgentTasks = function() {
            return this.tasks.filter(t => t.urgent && t.status !== 'Terminé').slice(0, 5);
        };

        // Obtenir les tâches avec échéances à venir (7 prochains jours)
        app.getUpcomingTasks = function() {
            const now = new Date();
            const future = new Date();
            future.setDate(now.getDate() + 7);

            return this.tasks
                .filter(t => t.dueDate && t.status !== 'Terminé')
                .filter(t => {
                    const dueDate = new Date(t.dueDate);
                    return dueDate >= now && dueDate <= future;
                })
                .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                .slice(0, 5);
        };

        // Obtenir les statistiques globales
        app.getGlobalStats = function() {
            const totalTasks = this.tasks.length;
            const completedTasks = this.tasks.filter(t => t.status === 'Terminé').length;
            const urgentTasks = this.tasks.filter(t => t.urgent && t.status !== 'Terminé').length;
            const overdueTasks = this.tasks.filter(t => this.isOverdue(t.dueDate) && t.status !== 'Terminé').length;

            return {
                totalTasks,
                completedTasks,
                urgentTasks,
                overdueTasks,
                completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
            };
        };

        // Charger la configuration au démarrage
        app.loadWidgetConfig();

        return app;
    },

    /**
     * Génère le HTML du widget Vue d'ensemble
     */
    getOverviewWidgetHTML() {
        return `
            <div class="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-bold dark:text-white">
                        <i class="fa-solid fa-chart-pie text-primary-600 mr-2"></i>
                        Vue d'ensemble
                    </h3>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                        <div class="text-3xl font-bold text-blue-600 dark:text-blue-400" x-text="getGlobalStats().totalTasks"></div>
                        <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">Total tâches</div>
                    </div>

                    <div class="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                        <div class="text-3xl font-bold text-green-600 dark:text-green-400" x-text="getGlobalStats().completedTasks"></div>
                        <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">Terminées</div>
                    </div>

                    <div class="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg">
                        <div class="text-3xl font-bold text-red-600 dark:text-red-400" x-text="getGlobalStats().urgentTasks"></div>
                        <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">Urgentes</div>
                    </div>

                    <div class="text-center p-4 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg">
                        <div class="text-3xl font-bold text-amber-600 dark:text-amber-400" x-text="getGlobalStats().overdueTasks"></div>
                        <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">En retard</div>
                    </div>
                </div>

                <!-- Barre de progression -->
                <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Taux de complétion</span>
                        <span class="text-sm font-bold text-primary-600 dark:text-primary-400" x-text="getGlobalStats().completionRate + '%'"></span>
                    </div>
                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div class="bg-gradient-to-r from-primary-600 to-primary-400 h-full rounded-full transition-all duration-500"
                             :style="'width: ' + getGlobalStats().completionRate + '%'"></div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Génère le HTML du widget Tâches urgentes
     */
    getUrgentTasksWidgetHTML() {
        return `
            <div class="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-bold dark:text-white">
                        <i class="fa-solid fa-fire text-red-600 mr-2"></i>
                        Tâches urgentes
                    </h3>
                    <span class="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-xs font-bold"
                          x-text="getUrgentTasks().length"></span>
                </div>

                <div class="space-y-2">
                    <template x-for="task in getUrgentTasks()" :key="task.id">
                        <div @click="openTaskModal(task)"
                             class="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500 cursor-pointer hover:shadow-md transition">
                            <div class="font-semibold text-sm dark:text-white" x-text="task.title"></div>
                            <div class="flex items-center gap-2 mt-1 text-xs text-gray-600 dark:text-gray-400">
                                <span x-show="task.projectId" class="flex items-center gap-1">
                                    <i class="fa-solid fa-folder"></i>
                                    <span x-text="getProjectName(task.projectId)"></span>
                                </span>
                                <span x-show="task.dueDate" class="flex items-center gap-1">
                                    <i class="fa-solid fa-calendar"></i>
                                    <span x-text="formatDate(task.dueDate)"></span>
                                </span>
                            </div>
                        </div>
                    </template>

                    <div x-show="getUrgentTasks().length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
                        <i class="fa-solid fa-check-circle text-4xl text-green-500 mb-2"></i>
                        <p class="text-sm">Aucune tâche urgente !</p>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Génère le HTML du widget Échéances à venir
     */
    getUpcomingTasksWidgetHTML() {
        return `
            <div class="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-bold dark:text-white">
                        <i class="fa-solid fa-calendar-check text-blue-600 mr-2"></i>
                        Échéances à venir
                    </h3>
                    <span class="text-xs text-gray-500 dark:text-gray-400">7 prochains jours</span>
                </div>

                <div class="space-y-2">
                    <template x-for="task in getUpcomingTasks()" :key="task.id">
                        <div @click="openTaskModal(task)"
                             class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500 cursor-pointer hover:shadow-md transition">
                            <div class="flex items-start justify-between">
                                <div class="flex-1">
                                    <div class="font-semibold text-sm dark:text-white" x-text="task.title"></div>
                                    <div class="text-xs text-gray-600 dark:text-gray-400 mt-1" x-show="task.projectId">
                                        <i class="fa-solid fa-folder"></i>
                                        <span x-text="getProjectName(task.projectId)"></span>
                                    </div>
                                </div>
                                <div class="text-right ml-2">
                                    <div class="text-xs font-bold text-blue-600 dark:text-blue-400" x-text="formatDate(task.dueDate)"></div>
                                    <div class="text-[10px] text-gray-500 dark:text-gray-400" x-text="'J-' + getRemainingDays(task.dueDate)"></div>
                                </div>
                            </div>
                        </div>
                    </template>

                    <div x-show="getUpcomingTasks().length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
                        <i class="fa-solid fa-inbox text-4xl text-gray-300 dark:text-gray-600 mb-2"></i>
                        <p class="text-sm">Aucune échéance prochaine</p>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Génère le HTML du widget Progression des projets
     */
    getProjectProgressWidgetHTML() {
        return `
            <div class="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-bold dark:text-white">
                        <i class="fa-solid fa-chart-line text-green-600 mr-2"></i>
                        Progression des projets
                    </h3>
                </div>

                <div class="space-y-4">
                    <template x-for="project in projects.slice(0, 5)" :key="project.id">
                        <div class="space-y-2">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <div class="w-3 h-3 rounded-full" :style="'background-color: ' + project.color"></div>
                                    <span class="font-medium text-sm dark:text-white" x-text="project.name"></span>
                                </div>
                                <span class="text-sm font-bold text-gray-600 dark:text-gray-400" x-text="getProjectProgress(project.id) + '%'"></span>
                            </div>
                            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                <div class="h-full rounded-full transition-all duration-500"
                                     :style="'width: ' + getProjectProgress(project.id) + '%; background-color: ' + project.color"></div>
                            </div>
                        </div>
                    </template>

                    <div x-show="projects.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
                        <i class="fa-solid fa-folder-open text-4xl text-gray-300 dark:text-gray-600 mb-2"></i>
                        <p class="text-sm">Aucun projet</p>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Génère le HTML du widget Timer actif
     */
    getTimerWidgetHTML() {
        return `
            <div class="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-bold dark:text-white">
                        <i class="fa-solid fa-stopwatch text-purple-600 mr-2"></i>
                        Timer actif
                    </h3>
                </div>

                <div x-show="activeTimer">
                    <div class="text-center py-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                        <div class="text-4xl font-mono font-bold text-purple-600 dark:text-purple-400 mb-2"
                             x-text="formatTimerDisplay(activeTimer)">00:00:00</div>
                        <div class="text-sm text-gray-600 dark:text-gray-400"
                             x-text="tasks.find(t => t.id === activeTimer)?.title || 'Tâche inconnue'"></div>
                    </div>
                    <div class="flex gap-2 mt-4">
                        <button @click="pauseTimer()"
                                class="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition font-semibold">
                            <i class="fa-solid fa-pause mr-1"></i> Pause
                        </button>
                        <button @click="stopTimer()"
                                class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-semibold">
                            <i class="fa-solid fa-stop mr-1"></i> Stop
                        </button>
                    </div>
                </div>

                <div x-show="!activeTimer" class="text-center py-12 text-gray-500 dark:text-gray-400">
                    <i class="fa-solid fa-clock text-4xl text-gray-300 dark:text-gray-600 mb-2"></i>
                    <p class="text-sm">Aucun timer actif</p>
                    <p class="text-xs mt-2">Ouvrez une tâche pour démarrer un timer</p>
                </div>
            </div>
        `;
    },

    /**
     * Génère le HTML du widget Activité récente
     */
    getRecentActivityWidgetHTML() {
        return `
            <div class="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-bold dark:text-white">
                        <i class="fa-solid fa-clock text-indigo-600 mr-2"></i>
                        Activité récente
                    </h3>
                </div>

                <div class="space-y-3">
                    <template x-for="task in tasks.slice(0, 5)" :key="task.id">
                        <div @click="openTaskModal(task)"
                             class="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg cursor-pointer hover:shadow-md transition border border-gray-200 dark:border-gray-700">
                            <div class="flex items-start gap-3">
                                <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                                     :class="{
                                         'bg-green-500 text-white': task.status === 'Terminé',
                                         'bg-blue-500 text-white': task.status === 'En cours',
                                         'bg-gray-400 text-white': task.status === 'À faire'
                                     }">
                                    <i class="fa-solid" :class="{
                                        'fa-check': task.status === 'Terminé',
                                        'fa-spinner': task.status === 'En cours',
                                        'fa-circle': task.status === 'À faire'
                                    }"></i>
                                </div>
                                <div class="flex-1">
                                    <div class="font-medium text-sm dark:text-white" x-text="task.title"></div>
                                    <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        <span x-text="task.status"></span>
                                        <span x-show="task.projectId">
                                            • <span x-text="getProjectName(task.projectId)"></span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>

                    <div x-show="tasks.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
                        <i class="fa-solid fa-history text-4xl text-gray-300 dark:text-gray-600 mb-2"></i>
                        <p class="text-sm">Aucune activité</p>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Génère le HTML complet du dashboard avec tous les widgets
     */
    getDashboardHTML() {
        return `
            <div class="h-full overflow-auto p-6 space-y-6">
                <!-- Header avec configuration -->
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-3xl font-bold dark:text-white">
                        <i class="fa-solid fa-chart-pie mr-3 text-primary-600"></i>
                        Dashboard
                    </h2>
                    <button @click="modals.widgetConfig = !modals.widgetConfig"
                            class="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition font-medium flex items-center gap-2">
                        <i class="fa-solid fa-cog"></i>
                        Configurer les widgets
                    </button>
                </div>

                <!-- Modal de configuration des widgets -->
                <div x-show="modals.widgetConfig"
                     @click.away="modals.widgetConfig = false"
                     x-transition.opacity
                     class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4"
                     x-cloak>
                    <div class="bg-white dark:bg-dark-surface w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
                        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <h3 class="text-xl font-bold dark:text-white">
                                <i class="fa-solid fa-cog mr-2 text-primary-600"></i>
                                Configuration des widgets
                            </h3>
                            <button @click="modals.widgetConfig = false" class="text-gray-400 hover:text-gray-600">
                                <i class="fa-solid fa-times"></i>
                            </button>
                        </div>
                        <div class="p-6 max-h-96 overflow-y-auto">
                            <div class="space-y-2">
                                <template x-for="(widget, index) in availableWidgets" :key="widget.id">
                                    <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div class="flex gap-1">
                                            <button @click="moveWidgetUp(widget.id)"
                                                    :disabled="index === 0"
                                                    class="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition disabled:opacity-30">
                                                <i class="fa-solid fa-chevron-up text-xs"></i>
                                            </button>
                                            <button @click="moveWidgetDown(widget.id)"
                                                    :disabled="index === availableWidgets.length - 1"
                                                    class="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition disabled:opacity-30">
                                                <i class="fa-solid fa-chevron-down text-xs"></i>
                                            </button>
                                        </div>
                                        <div class="flex-1 flex items-center gap-3">
                                            <i :class="widget.icon" class="fa-solid text-primary-600"></i>
                                            <span class="font-medium dark:text-white" x-text="widget.name"></span>
                                        </div>
                                        <label class="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox"
                                                   :checked="widget.enabled"
                                                   @change="toggleWidget(widget.id)"
                                                   class="sr-only peer">
                                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                                        </label>
                                    </div>
                                </template>
                            </div>
                        </div>
                        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                            <button @click="modals.widgetConfig = false"
                                    class="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition font-semibold">
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Grille de widgets -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <template x-for="widget in getEnabledWidgets()" :key="widget.id">
                        <div x-show="widget.enabled">
                            <div x-show="widget.id === 'overview'">${this.getOverviewWidgetHTML()}</div>
                            <div x-show="widget.id === 'tasks-urgent'">${this.getUrgentTasksWidgetHTML()}</div>
                            <div x-show="widget.id === 'upcoming-tasks'">${this.getUpcomingTasksWidgetHTML()}</div>
                            <div x-show="widget.id === 'project-progress'">${this.getProjectProgressWidgetHTML()}</div>
                            <div x-show="widget.id === 'recent-activity'">${this.getRecentActivityWidgetHTML()}</div>
                            <div x-show="widget.id === 'timer'">${this.getTimerWidgetHTML()}</div>
                        </div>
                    </template>
                </div>

                <!-- Message si aucun widget activé -->
                <div x-show="getEnabledWidgets().length === 0" class="text-center py-20">
                    <i class="fa-solid fa-inbox text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
                    <p class="text-gray-500 dark:text-gray-400 text-lg mb-4">Aucun widget activé</p>
                    <button @click="modals.widgetConfig = true"
                            class="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition font-semibold">
                        <i class="fa-solid fa-cog mr-2"></i>
                        Configurer les widgets
                    </button>
                </div>
            </div>
        `;
    }
};
