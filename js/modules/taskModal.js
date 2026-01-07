/**
 * Module de gestion de la modale tâche avec onglets
 */
export const TaskModal = {
    /**
     * Initialise le module de modale tâche
     */
    init(app) {
        // Ajouter l'état pour les onglets
        app.taskModalTab = 'general';

        // Méthode pour changer d'onglet
        app.switchTaskTab = function(tab) {
            this.taskModalTab = tab;
        };

        // Méthode pour obtenir les classes CSS d'un onglet
        app.getTabClass = function(tab) {
            const isActive = this.taskModalTab === tab;
            return isActive
                ? 'border-b-4 border-primary-600 text-primary-600 dark:text-primary-400 font-bold'
                : 'border-b-4 border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200';
        };

        // Méthode pour obtenir l'icône d'un onglet
        app.getTabIcon = function(tab) {
            const icons = {
                'general': 'fa-solid fa-list-check',
                'planning': 'fa-solid fa-calendar-days',
                'participants': 'fa-solid fa-users',
                'advanced': 'fa-solid fa-sliders'
            };
            return icons[tab] || 'fa-solid fa-file';
        };

        return app;
    },

    /**
     * Génère le HTML pour les onglets de la modale
     */
    getTabsHTML() {
        return `
            <div class="border-b border-gray-200 dark:border-gray-700 flex gap-1">
                <button @click="switchTaskTab('general')"
                        :class="getTabClass('general')"
                        class="px-6 py-3 transition-all duration-200 flex items-center gap-2">
                    <i :class="getTabIcon('general')"></i>
                    <span>Général</span>
                </button>
                <button @click="switchTaskTab('planning')"
                        :class="getTabClass('planning')"
                        class="px-6 py-3 transition-all duration-200 flex items-center gap-2">
                    <i :class="getTabIcon('planning')"></i>
                    <span>Planification</span>
                </button>
                <button @click="switchTaskTab('participants')"
                        :class="getTabClass('participants')"
                        class="px-6 py-3 transition-all duration-200 flex items-center gap-2">
                    <i :class="getTabIcon('participants')"></i>
                    <span>Participants</span>
                </button>
                <button @click="switchTaskTab('advanced')"
                        :class="getTabClass('advanced')"
                        class="px-6 py-3 transition-all duration-200 flex items-center gap-2">
                    <i :class="getTabIcon('advanced')"></i>
                    <span>Avancé</span>
                </button>
            </div>
        `;
    },

    /**
     * Génère le HTML pour le contenu de l'onglet Général
     */
    getGeneralTabHTML() {
        return `
            <div x-show="taskModalTab === 'general'" class="space-y-6">
                <input type="text"
                       x-model="tempTask.title"
                       placeholder="Titre de la tâche..."
                       class="w-full text-2xl font-bold bg-transparent border-none p-0 focus:ring-0 dark:text-white placeholder-gray-300">

                <div>
                    <label class="label-xs mb-2 block">Description</label>
                    <textarea x-model="tempTask.description"
                              placeholder="Ajouter une description détaillée..."
                              rows="6"
                              class="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-primary-500/50 dark:text-gray-200 resize-none"></textarea>
                </div>

                <div>
                    <label class="label-xs mb-2 block">Projet</label>
                    <select x-model="tempTask.projectId" class="input-std bg-white dark:bg-dark-surface">
                        <option value="">-- Aucun projet --</option>
                        <template x-for="p in projects" :key="p.id">
                            <option :value="p.id" x-text="p.name"></option>
                        </template>
                    </select>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="label-xs mb-2 block">Statut</label>
                        <select x-model="tempTask.status" class="input-std bg-white dark:bg-dark-surface">
                            <template x-for="s in kanbanColumns">
                                <option :value="s" x-text="s"></option>
                            </template>
                        </select>
                    </div>
                    <div>
                        <label class="label-xs mb-2 block">Priorité</label>
                        <div class="flex gap-2 mt-2">
                            <button @click="tempTask.urgent = !tempTask.urgent"
                                    class="flex-1 px-3 py-2 rounded-lg text-xs font-bold border-2 transition"
                                    :class="tempTask.urgent ? 'bg-red-50 text-red-600 border-red-300 dark:bg-red-900/30 dark:text-red-400' : 'text-gray-400 border-gray-200 dark:border-gray-700'">
                                <i class="fa-solid fa-fire mr-1"></i> URGENT
                            </button>
                            <button @click="tempTask.important = !tempTask.important"
                                    class="flex-1 px-3 py-2 rounded-lg text-xs font-bold border-2 transition"
                                    :class="tempTask.important ? 'bg-amber-50 text-amber-600 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400' : 'text-gray-400 border-gray-200 dark:border-gray-700'">
                                <i class="fa-solid fa-star mr-1"></i> IMPORTANT
                            </button>
                        </div>
                    </div>
                </div>

                <div>
                    <label class="label-xs mb-2 block">Checklist</label>
                    <div class="space-y-2">
                        <template x-for="(item, index) in tempTask.checklist" :key="index">
                            <div class="flex items-center gap-2 p-3 bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600 transition">
                                <input type="checkbox"
                                       x-model="item.completed"
                                       class="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer">
                                <input type="text"
                                       x-model="item.text"
                                       placeholder="Élément de checklist..."
                                       class="flex-1 bg-transparent border-none p-0 text-sm focus:ring-0 dark:text-white"
                                       :class="item.completed ? 'line-through text-gray-400' : ''">
                                <button @click="tempTask.checklist.splice(index, 1)"
                                        type="button"
                                        class="text-red-500 hover:text-red-700 transition px-2">
                                    <i class="fa-solid fa-trash text-xs"></i>
                                </button>
                            </div>
                        </template>
                        <button @click="tempTask.checklist.push({ text: '', completed: false })"
                                type="button"
                                class="w-full py-3 text-primary-600 hover:text-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition text-sm font-medium flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                            <i class="fa-solid fa-plus"></i> Ajouter un élément
                        </button>
                        <div x-show="tempTask.checklist && tempTask.checklist.length > 0" class="text-xs text-gray-500 dark:text-gray-400 pt-2 text-center">
                            <i class="fa-solid fa-check-circle mr-1"></i>
                            <span x-text="tempTask.checklist.filter(i => i.completed).length"></span> / <span x-text="tempTask.checklist.length"></span> éléments complétés
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Génère le HTML pour le contenu de l'onglet Planification
     */
    getPlanningTabHTML() {
        return `
            <div x-show="taskModalTab === 'planning'" class="space-y-6">
                <div>
                    <label class="label-xs mb-2 block">Échéance</label>
                    <input type="date"
                           x-model="tempTask.dueDate"
                           class="input-std bg-white dark:bg-dark-surface">
                    <div x-show="tempTask.dueDate" class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <i class="fa-solid fa-clock mr-1"></i>
                        <span x-show="getRemainingDays(tempTask.dueDate) > 0">
                            <span x-text="getRemainingDays(tempTask.dueDate)"></span> jours restants
                        </span>
                        <span x-show="getRemainingDays(tempTask.dueDate) < 0" class="text-red-500 font-semibold">
                            <i class="fa-solid fa-exclamation-triangle mr-1"></i> En retard de <span x-text="Math.abs(getRemainingDays(tempTask.dueDate))"></span> jours
                        </span>
                        <span x-show="getRemainingDays(tempTask.dueDate) === 0" class="text-amber-500 font-semibold">
                            <i class="fa-solid fa-bell mr-1"></i> Aujourd'hui !
                        </span>
                    </div>
                </div>

                <div>
                    <label class="label-xs mb-2 block">Récurrence</label>
                    <select x-model="tempTask.recurrence" class="input-std bg-white dark:bg-dark-surface">
                        <option value="Aucune">Aucune</option>
                        <option value="Quotidien">Quotidien</option>
                        <option value="Hebdo">Hebdomadaire</option>
                        <option value="Mensuel">Mensuel</option>
                    </select>
                    <div x-show="tempTask.recurrence !== 'Aucune'" class="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-300">
                        <i class="fa-solid fa-info-circle mr-1"></i>
                        Une nouvelle tâche sera créée automatiquement selon la récurrence choisie.
                    </div>
                </div>

                <div>
                    <label class="label-xs mb-2 block">Estimation / Temps passé (heures)</label>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <input type="number"
                                   x-model="tempTask.timeEst"
                                   placeholder="Estimé"
                                   class="input-std bg-white dark:bg-dark-surface text-center"
                                   min="0"
                                   step="0.5">
                            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                                <i class="fa-solid fa-hourglass-start"></i> Estimation
                            </div>
                        </div>
                        <div>
                            <input type="number"
                                   x-model="tempTask.timeSpent"
                                   placeholder="Réel"
                                   class="input-std bg-white dark:bg-dark-surface text-center"
                                   min="0"
                                   step="0.5">
                            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                                <i class="fa-solid fa-hourglass-end"></i> Temps passé
                            </div>
                        </div>
                    </div>
                    <div x-show="tempTask.timeEst && tempTask.timeSpent" class="mt-3 p-3 rounded-lg" :class="tempTask.timeSpent > tempTask.timeEst ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'">
                        <div class="flex items-center justify-between text-sm">
                            <span :class="tempTask.timeSpent > tempTask.timeEst ? 'text-red-700 dark:text-red-300' : 'text-green-700 dark:text-green-300'">
                                <i class="fa-solid mr-1" :class="tempTask.timeSpent > tempTask.timeEst ? 'fa-exclamation-triangle' : 'fa-check-circle'"></i>
                                <span x-show="tempTask.timeSpent > tempTask.timeEst">Dépassement : </span>
                                <span x-show="tempTask.timeSpent <= tempTask.timeEst">Dans les temps : </span>
                                <strong x-text="Math.round((tempTask.timeSpent / tempTask.timeEst) * 100)"></strong>%
                            </span>
                        </div>
                    </div>
                </div>

                <div x-show="tempTask.id" class="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <label class="label-xs mb-2 block">Timer / Chronomètre</label>
                    <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-3">
                        <div class="text-center">
                            <div class="text-4xl font-mono font-bold text-primary-600 dark:text-primary-400" x-text="formatTimerDisplay(tempTask.id)">00:00:00</div>
                        </div>
                        <div class="flex gap-2">
                            <button @click="startTimer(tempTask.id)"
                                    x-show="!activeTimer || activeTimer !== tempTask.id"
                                    class="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-semibold flex items-center justify-center gap-2">
                                <i class="fa-solid fa-play"></i> Démarrer
                            </button>
                            <button @click="pauseTimer()"
                                    x-show="activeTimer === tempTask.id"
                                    class="flex-1 px-4 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition font-semibold flex items-center justify-center gap-2">
                                <i class="fa-solid fa-pause"></i> Pause
                            </button>
                            <button @click="stopTimer()"
                                    x-show="timers[tempTask.id]"
                                    class="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-semibold flex items-center justify-center gap-2">
                                <i class="fa-solid fa-stop"></i> Stop
                            </button>
                        </div>
                    </div>
                </div>

                <div>
                    <label class="label-xs mb-2 block">Notes de Réunion</label>
                    <textarea x-model="tempTask.notes"
                              placeholder="Ajoutez des notes pendant la réunion..."
                              rows="6"
                              class="w-full bg-white dark:bg-dark-surface input-std p-3 text-sm focus:ring-2 focus:ring-primary-500/50 dark:text-gray-200 resize-none"></textarea>
                    <div class="mt-2 flex gap-2">
                        <button @click="copyNotes(tempTask.notes)"
                                type="button"
                                class="btn-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-xs border border-gray-200 dark:border-gray-600 transition">
                            <i class="fa-solid fa-copy mr-1"></i> Copier
                        </button>
                        <button @click="emailNotes(tempTask.notes, tempTask.title)"
                                type="button"
                                class="btn-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-xs border border-gray-200 dark:border-gray-600 transition">
                            <i class="fa-solid fa-envelope mr-1"></i> Envoyer par e-mail
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Génère le HTML pour le contenu de l'onglet Participants
     */
    getParticipantsTabHTML() {
        return `
            <div x-show="taskModalTab === 'participants'" class="space-y-6">
                <div>
                    <label class="label-xs mb-2 block">Sélectionner les participants</label>
                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-3">
                        <template x-for="c in contacts" :key="c.id">
                            <button @click="toggleParticipant(c.id)"
                                    class="p-4 rounded-xl border-2 transition-all hover:scale-105"
                                    :class="tempTask.participants.includes(c.id) ? 'bg-primary-50 border-primary-500 dark:bg-primary-900/30 dark:border-primary-500' : 'bg-white border-gray-200 dark:bg-dark-surface dark:border-gray-600'">
                                <div class="flex flex-col items-center gap-2">
                                    <div class="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition"
                                         :class="tempTask.participants.includes(c.id) ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'"
                                         x-text="getContactInitials(c.id)"></div>
                                    <div class="text-sm font-medium text-center dark:text-white" x-text="c.name"></div>
                                    <div x-show="c.org" class="text-xs text-gray-500 dark:text-gray-400 text-center" x-text="c.org"></div>
                                    <i x-show="tempTask.participants.includes(c.id)" class="fa-solid fa-check text-primary-600 dark:text-primary-400"></i>
                                </div>
                            </button>
                        </template>
                    </div>
                    <div x-show="contacts.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
                        <i class="fa-solid fa-users text-4xl mb-3 opacity-50"></i>
                        <p>Aucun contact disponible. Créez des contacts dans la section Contacts.</p>
                    </div>
                </div>

                <div x-show="tempTask.participants && tempTask.participants.length > 0" class="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <label class="label-xs mb-3 block">Participants sélectionnés (<span x-text="tempTask.participants.length"></span>)</label>
                    <div class="space-y-2">
                        <template x-for="participantId in tempTask.participants" :key="participantId">
                            <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div class="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold"
                                     x-text="getContactInitials(participantId)"></div>
                                <div class="flex-1">
                                    <div class="font-semibold dark:text-white" x-text="getContactName(participantId)"></div>
                                    <div class="text-xs text-gray-500 dark:text-gray-400" x-text="contacts.find(c => c.id === participantId)?.email || ''"></div>
                                </div>
                                <button @click="toggleParticipant(participantId)"
                                        class="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded transition">
                                    <i class="fa-solid fa-times"></i>
                                </button>
                            </div>
                        </template>
                    </div>
                </div>

                <div x-show="tempTask.id && tempTask.participants && tempTask.participants.length > 0" class="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <label class="label-xs mb-3 block">Actions</label>
                    <div class="flex flex-wrap gap-3">
                        <button @click="generateTaskAssignmentICS(tempTask)"
                                type="button"
                                class="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition flex items-center gap-2 font-semibold">
                            <i class="fa-solid fa-calendar-check"></i> Télécharger fichier ICS
                        </button>
                        <button @click="emailTaskAssignmentICS(tempTask)"
                                type="button"
                                class="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition flex items-center gap-2 font-semibold">
                            <i class="fa-solid fa-paper-plane"></i> Envoyer aux participants
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Génère le HTML pour le contenu de l'onglet Avancé
     */
    getAdvancedTabHTML() {
        return `
            <div x-show="taskModalTab === 'advanced'" class="space-y-6">
                <div>
                    <label class="label-xs mb-2 block">Tags</label>
                    <div class="space-y-3">
                        <!-- Tags existants sur la tâche -->
                        <div class="flex flex-wrap gap-2" x-show="tempTask.tags && tempTask.tags.length > 0">
                            <template x-for="tag in tempTask.tags" :key="tag">
                                <span class="px-3 py-2 rounded-lg text-sm font-medium text-white flex items-center gap-2 shadow-sm"
                                      :style="'background-color:' + getTagColor(tag)">
                                    <span x-text="tag"></span>
                                    <button @click="removeTagFromTask(tag)"
                                            class="hover:bg-white/20 rounded-full w-5 h-5 flex items-center justify-center transition">
                                        <i class="fa-solid fa-xmark text-xs"></i>
                                    </button>
                                </span>
                            </template>
                        </div>

                        <!-- Tags suggérés -->
                        <div>
                            <div class="text-xs text-gray-500 dark:text-gray-400 mb-2">Tags suggérés :</div>
                            <div class="flex flex-wrap gap-2">
                                <template x-for="tag in suggestedTags">
                                    <button @click="addTagToTask(tag)"
                                            x-show="!tempTask.tags || !tempTask.tags.includes(tag)"
                                            class="px-3 py-2 rounded-lg text-sm font-medium border-2 transition hover:opacity-80 hover:scale-105"
                                            :style="'background-color:' + getTagColor(tag) + '20; border-color:' + getTagColor(tag) + '; color:' + getTagColor(tag)"
                                            x-text="tag"></button>
                                </template>
                            </div>
                        </div>

                        <!-- Ajouter un tag personnalisé -->
                        <div class="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                            <input type="text"
                                   x-model="newTag"
                                   @keyup.enter="newTag.trim() && addTagToTask(newTag)"
                                   placeholder="Créer un nouveau tag..."
                                   class="input-std flex-1 bg-white dark:bg-dark-surface">
                            <button @click="newTag.trim() && addTagToTask(newTag)"
                                    type="button"
                                    class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold transition">
                                <i class="fa-solid fa-plus"></i> Ajouter
                            </button>
                        </div>
                    </div>
                </div>

                <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <label class="label-xs mb-3 block">Champs Personnalisés</label>
                    <div class="space-y-3">
                        <template x-for="(field, index) in tempTask._customFieldsArray" :key="index">
                            <div class="flex gap-3 items-center p-3 bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-gray-600">
                                <input type="text"
                                       x-model="field.key"
                                       placeholder="Nom du champ"
                                       class="input-std flex-1 bg-gray-50 dark:bg-gray-800">
                                <input type="text"
                                       x-model="field.value"
                                       placeholder="Valeur"
                                       class="input-std flex-1 bg-gray-50 dark:bg-gray-800">
                                <button @click="tempTask._customFieldsArray.splice(index, 1)"
                                        type="button"
                                        class="w-10 h-10 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </template>

                        <button @click="tempTask._customFieldsArray.push({ key: '', value: '' })"
                                type="button"
                                class="w-full py-3 text-primary-600 hover:text-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition text-sm font-medium flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                            <i class="fa-solid fa-plus"></i> Ajouter un champ personnalisé
                        </button>
                    </div>

                    <div x-show="tempTask._customFieldsArray && tempTask._customFieldsArray.length > 0" class="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-300">
                        <i class="fa-solid fa-info-circle mr-1"></i>
                        Les champs personnalisés vous permettent d'ajouter des informations spécifiques à votre flux de travail.
                    </div>
                </div>

                <div x-show="tempTask.id" class="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <label class="label-xs mb-3 block text-red-600 dark:text-red-400">Zone de danger</label>
                    <button @click="deleteTask(tempTask.id)"
                            class="w-full px-4 py-3 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition font-semibold flex items-center justify-center gap-2 border-2 border-red-200 dark:border-red-800">
                        <i class="fa-solid fa-trash-can"></i> Supprimer définitivement cette tâche
                    </button>
                </div>
            </div>
        `;
    },

    /**
     * Génère le HTML complet de la modale avec onglets
     */
    getModalHTML() {
        return `
            <div x-show="modals.task"
                 @click.away="modals.task = false"
                 x-transition:enter="scale-enter-active"
                 x-transition:enter-start="scale-enter-start"
                 class="bg-white dark:bg-dark-surface w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                <!-- Header -->
                <div class="px-8 py-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white">
                            <i class="fa-solid fa-tasks"></i>
                        </div>
                        <div>
                            <span class="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Tâche</span>
                            <div x-show="tempTask.id" class="text-xs text-gray-400 dark:text-gray-500" x-text="'ID: ' + tempTask.id"></div>
                        </div>
                    </div>
                    <button @click="modals.task = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition text-xl">
                        <i class="fa-solid fa-times"></i>
                    </button>
                </div>

                <!-- Tabs -->
                ${this.getTabsHTML()}

                <!-- Content -->
                <div class="flex-1 overflow-y-auto p-8">
                    ${this.getGeneralTabHTML()}
                    ${this.getPlanningTabHTML()}
                    ${this.getParticipantsTabHTML()}
                    ${this.getAdvancedTabHTML()}
                </div>

                <!-- Footer -->
                <div class="px-8 py-5 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800/50 sticky bottom-0">
                    <button @click="modals.task = false"
                            class="px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition font-semibold text-base border-2 border-gray-300 dark:border-gray-600 flex items-center gap-2">
                        <i class="fa-solid fa-times"></i> Annuler
                    </button>
                    <button @click="saveTask()"
                            class="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg shadow-lg transition font-bold text-base flex items-center gap-2">
                        <i class="fa-solid fa-check"></i> Enregistrer
                    </button>
                </div>
            </div>
        `;
    }
};
