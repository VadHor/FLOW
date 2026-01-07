/**
 * Module de recherche avancée avec filtres
 */
export const AdvancedSearch = {
    /**
     * Initialise le module de recherche avancée
     */
    init(app) {
        // État de la recherche avancée
        app.advancedSearchVisible = false;
        app.searchFilters = {
            query: '',
            project: null,
            status: null,
            tags: [],
            participants: [],
            dateFrom: '',
            dateTo: '',
            urgent: null,
            important: null,
            overdue: null
        };

        // Basculer la visibilité de la recherche avancée
        app.toggleAdvancedSearch = function() {
            this.advancedSearchVisible = !this.advancedSearchVisible;
        };

        // Réinitialiser les filtres
        app.resetSearchFilters = function() {
            this.searchFilters = {
                query: '',
                project: null,
                status: null,
                tags: [],
                participants: [],
                dateFrom: '',
                dateTo: '',
                urgent: null,
                important: null,
                overdue: null
            };
        };

        // Basculer un tag dans les filtres
        app.toggleSearchTag = function(tag) {
            const index = this.searchFilters.tags.indexOf(tag);
            if (index > -1) {
                this.searchFilters.tags.splice(index, 1);
            } else {
                this.searchFilters.tags.push(tag);
            }
        };

        // Basculer un participant dans les filtres
        app.toggleSearchParticipant = function(participantId) {
            const index = this.searchFilters.participants.indexOf(participantId);
            if (index > -1) {
                this.searchFilters.participants.splice(index, 1);
            } else {
                this.searchFilters.participants.push(participantId);
            }
        };

        // Obtenir les tâches filtrées
        app.getFilteredTasks = function() {
            let tasks = this.tasks;

            // Filtre par recherche textuelle
            if (this.searchFilters.query) {
                const query = this.searchFilters.query.toLowerCase();
                tasks = tasks.filter(t =>
                    t.title.toLowerCase().includes(query) ||
                    (t.description && t.description.toLowerCase().includes(query)) ||
                    (t.notes && t.notes.toLowerCase().includes(query))
                );
            }

            // Filtre par projet
            if (this.searchFilters.project) {
                tasks = tasks.filter(t => t.projectId === this.searchFilters.project);
            }

            // Filtre par statut
            if (this.searchFilters.status) {
                tasks = tasks.filter(t => t.status === this.searchFilters.status);
            }

            // Filtre par tags
            if (this.searchFilters.tags.length > 0) {
                tasks = tasks.filter(t =>
                    t.tags && this.searchFilters.tags.some(tag => t.tags.includes(tag))
                );
            }

            // Filtre par participants
            if (this.searchFilters.participants.length > 0) {
                tasks = tasks.filter(t =>
                    t.participants && this.searchFilters.participants.some(p => t.participants.includes(p))
                );
            }

            // Filtre par date de début
            if (this.searchFilters.dateFrom) {
                tasks = tasks.filter(t =>
                    t.dueDate && new Date(t.dueDate) >= new Date(this.searchFilters.dateFrom)
                );
            }

            // Filtre par date de fin
            if (this.searchFilters.dateTo) {
                tasks = tasks.filter(t =>
                    t.dueDate && new Date(t.dueDate) <= new Date(this.searchFilters.dateTo)
                );
            }

            // Filtre par urgent
            if (this.searchFilters.urgent !== null) {
                tasks = tasks.filter(t => t.urgent === this.searchFilters.urgent);
            }

            // Filtre par important
            if (this.searchFilters.important !== null) {
                tasks = tasks.filter(t => t.important === this.searchFilters.important);
            }

            // Filtre par en retard
            if (this.searchFilters.overdue === true) {
                tasks = tasks.filter(t => this.isOverdue(t.dueDate));
            }

            return tasks;
        };

        // Obtenir le nombre de filtres actifs
        app.getActiveFiltersCount = function() {
            let count = 0;
            if (this.searchFilters.query) count++;
            if (this.searchFilters.project) count++;
            if (this.searchFilters.status) count++;
            if (this.searchFilters.tags.length > 0) count++;
            if (this.searchFilters.participants.length > 0) count++;
            if (this.searchFilters.dateFrom) count++;
            if (this.searchFilters.dateTo) count++;
            if (this.searchFilters.urgent !== null) count++;
            if (this.searchFilters.important !== null) count++;
            if (this.searchFilters.overdue !== null) count++;
            return count;
        };

        // Obtenir tous les tags uniques
        app.getAllTags = function() {
            const tagsSet = new Set();
            this.tasks.forEach(t => {
                if (t.tags && Array.isArray(t.tags)) {
                    t.tags.forEach(tag => tagsSet.add(tag));
                }
            });
            return Array.from(tagsSet);
        };

        return app;
    },

    /**
     * Génère le HTML de la barre de recherche avancée
     */
    getSearchBarHTML() {
        return `
            <div class="relative">
                <div class="flex items-center gap-2">
                    <div class="relative flex-1">
                        <input type="text"
                               x-model="searchFilters.query"
                               placeholder="Rechercher une tâche..."
                               class="w-full pl-10 pr-4 py-3 bg-white dark:bg-dark-surface border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition text-sm">
                        <i class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    </div>
                    <button @click="toggleAdvancedSearch()"
                            class="px-4 py-3 rounded-xl transition flex items-center gap-2 font-medium text-sm"
                            :class="advancedSearchVisible || getActiveFiltersCount() > 0 ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'">
                        <i class="fa-solid fa-sliders"></i>
                        Filtres
                        <span x-show="getActiveFiltersCount() > 0"
                              class="ml-1 px-2 py-0.5 bg-white/30 rounded-full text-xs font-bold"
                              x-text="getActiveFiltersCount()"></span>
                    </button>
                </div>

                <!-- Panneau de filtres avancés -->
                <div x-show="advancedSearchVisible"
                     x-transition:enter="transition ease-out duration-200"
                     x-transition:enter-start="opacity-0 transform scale-95"
                     x-transition:enter-end="opacity-100 transform scale-100"
                     x-transition:leave="transition ease-in duration-150"
                     x-transition:leave-start="opacity-100 transform scale-100"
                     x-transition:leave-end="opacity-0 transform scale-95"
                     class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-dark-surface border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 p-6"
                     x-cloak>
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-bold dark:text-white">
                            <i class="fa-solid fa-filter mr-2 text-primary-600"></i>
                            Filtres avancés
                        </h3>
                        <button @click="resetSearchFilters()"
                                class="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium">
                            <i class="fa-solid fa-rotate-left mr-1"></i>
                            Réinitialiser
                        </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <!-- Projet -->
                        <div>
                            <label class="label-xs mb-2 block">Projet</label>
                            <select x-model="searchFilters.project" class="input-std bg-white dark:bg-dark-surface">
                                <option :value="null">Tous les projets</option>
                                <template x-for="p in projects" :key="p.id">
                                    <option :value="p.id" x-text="p.name"></option>
                                </template>
                            </select>
                        </div>

                        <!-- Statut -->
                        <div>
                            <label class="label-xs mb-2 block">Statut</label>
                            <select x-model="searchFilters.status" class="input-std bg-white dark:bg-dark-surface">
                                <option :value="null">Tous les statuts</option>
                                <template x-for="s in kanbanColumns">
                                    <option :value="s" x-text="s"></option>
                                </template>
                            </select>
                        </div>

                        <!-- Date de début -->
                        <div>
                            <label class="label-xs mb-2 block">Date de début</label>
                            <input type="date"
                                   x-model="searchFilters.dateFrom"
                                   class="input-std bg-white dark:bg-dark-surface">
                        </div>

                        <!-- Date de fin -->
                        <div>
                            <label class="label-xs mb-2 block">Date de fin</label>
                            <input type="date"
                                   x-model="searchFilters.dateTo"
                                   class="input-std bg-white dark:bg-dark-surface">
                        </div>

                        <!-- Priorités -->
                        <div>
                            <label class="label-xs mb-2 block">Priorités</label>
                            <div class="flex gap-2">
                                <button @click="searchFilters.urgent = searchFilters.urgent === true ? null : true"
                                        class="flex-1 px-3 py-2 rounded-lg text-xs font-bold border-2 transition"
                                        :class="searchFilters.urgent === true ? 'bg-red-50 text-red-600 border-red-300 dark:bg-red-900/30 dark:text-red-400' : 'text-gray-400 border-gray-200 dark:border-gray-700'">
                                    <i class="fa-solid fa-fire"></i> Urgent
                                </button>
                                <button @click="searchFilters.important = searchFilters.important === true ? null : true"
                                        class="flex-1 px-3 py-2 rounded-lg text-xs font-bold border-2 transition"
                                        :class="searchFilters.important === true ? 'bg-amber-50 text-amber-600 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400' : 'text-gray-400 border-gray-200 dark:border-gray-700'">
                                    <i class="fa-solid fa-star"></i> Important
                                </button>
                            </div>
                        </div>

                        <!-- En retard -->
                        <div>
                            <label class="label-xs mb-2 block">État</label>
                            <button @click="searchFilters.overdue = searchFilters.overdue === true ? null : true"
                                    class="w-full px-3 py-2 rounded-lg text-xs font-bold border-2 transition"
                                    :class="searchFilters.overdue === true ? 'bg-red-50 text-red-600 border-red-300 dark:bg-red-900/30 dark:text-red-400' : 'text-gray-400 border-gray-200 dark:border-gray-700'">
                                <i class="fa-solid fa-exclamation-triangle"></i> En retard uniquement
                            </button>
                        </div>
                    </div>

                    <!-- Tags -->
                    <div class="mt-4">
                        <label class="label-xs mb-2 block">Tags</label>
                        <div class="flex flex-wrap gap-2">
                            <template x-for="tag in getAllTags()" :key="tag">
                                <button @click="toggleSearchTag(tag)"
                                        class="px-3 py-2 rounded-lg text-sm font-medium transition border-2"
                                        :class="searchFilters.tags.includes(tag) ? 'border-current shadow-md' : 'border-transparent'"
                                        :style="'background-color:' + getTagColor(tag) + (searchFilters.tags.includes(tag) ? '' : '40') + '; color:' + getTagColor(tag)">
                                    <i x-show="searchFilters.tags.includes(tag)" class="fa-solid fa-check mr-1"></i>
                                    <span x-text="tag"></span>
                                </button>
                            </template>
                            <div x-show="getAllTags().length === 0" class="text-sm text-gray-500 dark:text-gray-400 italic">
                                Aucun tag disponible
                            </div>
                        </div>
                    </div>

                    <!-- Participants -->
                    <div class="mt-4">
                        <label class="label-xs mb-2 block">Participants</label>
                        <div class="flex flex-wrap gap-2">
                            <template x-for="c in contacts" :key="c.id">
                                <button @click="toggleSearchParticipant(c.id)"
                                        class="flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition"
                                        :class="searchFilters.participants.includes(c.id) ? 'bg-primary-50 border-primary-500 dark:bg-primary-900/30 dark:border-primary-500' : 'bg-white border-gray-200 dark:bg-dark-surface dark:border-gray-600'">
                                    <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                                         :class="searchFilters.participants.includes(c.id) ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'"
                                         x-text="getContactInitials(c.id)"></div>
                                    <span class="text-sm font-medium dark:text-white" x-text="c.name"></span>
                                    <i x-show="searchFilters.participants.includes(c.id)" class="fa-solid fa-check text-primary-600 dark:text-primary-400"></i>
                                </button>
                            </template>
                            <div x-show="contacts.length === 0" class="text-sm text-gray-500 dark:text-gray-400 italic">
                                Aucun participant disponible
                            </div>
                        </div>
                    </div>

                    <!-- Résultats -->
                    <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div class="text-sm text-gray-600 dark:text-gray-400">
                            <i class="fa-solid fa-check-circle text-green-500 mr-1"></i>
                            <strong x-text="getFilteredTasks().length"></strong> tâche(s) trouvée(s)
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Génère le HTML de la liste des résultats de recherche
     */
    getResultsHTML() {
        return `
            <div class="space-y-3">
                <div x-show="getFilteredTasks().length === 0" class="text-center py-12">
                    <i class="fa-solid fa-search text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
                    <p class="text-gray-500 dark:text-gray-400 text-lg">Aucune tâche ne correspond à vos critères</p>
                    <button @click="resetSearchFilters()"
                            class="mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition">
                        Réinitialiser les filtres
                    </button>
                </div>

                <template x-for="task in getFilteredTasks()" :key="task.id">
                    <div @click="openTaskModal(task)"
                         class="p-4 bg-white dark:bg-dark-surface rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600 transition-all cursor-pointer hover:shadow-lg">
                        <div class="flex items-start justify-between">
                            <div class="flex-1">
                                <div class="flex items-center gap-2 mb-2">
                                    <h3 class="font-bold text-lg dark:text-white" x-text="task.title"></h3>
                                    <span x-show="task.urgent"
                                          class="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-xs font-bold">
                                        URGENT
                                    </span>
                                    <span x-show="task.important"
                                          class="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full text-xs font-bold">
                                        IMPORTANT
                                    </span>
                                </div>

                                <p x-show="task.description"
                                   class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2"
                                   x-text="task.description"></p>

                                <div class="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                                    <div x-show="task.projectId" class="flex items-center gap-1">
                                        <i class="fa-solid fa-folder text-primary-600"></i>
                                        <span x-text="getProjectName(task.projectId)"></span>
                                    </div>

                                    <div class="flex items-center gap-1">
                                        <i class="fa-solid fa-flag"></i>
                                        <span x-text="task.status"></span>
                                    </div>

                                    <div x-show="task.dueDate" class="flex items-center gap-1"
                                         :class="isOverdue(task.dueDate) ? 'text-red-600 dark:text-red-400 font-semibold' : ''">
                                        <i class="fa-solid fa-calendar"></i>
                                        <span x-text="formatDate(task.dueDate)"></span>
                                    </div>

                                    <div x-show="task.participants && task.participants.length > 0" class="flex items-center gap-1">
                                        <i class="fa-solid fa-users"></i>
                                        <span x-text="task.participants.length + ' participant(s)'"></span>
                                    </div>
                                </div>

                                <div x-show="task.tags && task.tags.length > 0" class="flex flex-wrap gap-1 mt-3">
                                    <template x-for="tag in task.tags" :key="tag">
                                        <span class="px-2 py-1 rounded-md text-xs font-medium text-white"
                                              :style="'background-color:' + getTagColor(tag)"
                                              x-text="tag"></span>
                                    </template>
                                </div>
                            </div>

                            <div class="ml-4">
                                <button class="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-primary-600 hover:text-white rounded-lg transition">
                                    <i class="fa-solid fa-arrow-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        `;
    }
};
