/**
 * Module de calendrier avec drag & drop
 */
export const Calendar = {
    /**
     * Initialise le module de calendrier
     */
    init(app) {
        // État du calendrier
        app.calendarDraggedTask = null;
        app.calendarView = 'month'; // 'month', 'week', 'day'

        // Méthode pour obtenir les tâches d'un jour spécifique
        app.getTasksForDate = function(date) {
            const dateStr = this.formatDateForComparison(date);
            return this.tasks.filter(t => {
                if (!t.dueDate) return false;
                return this.formatDateForComparison(new Date(t.dueDate)) === dateStr;
            });
        };

        // Formater une date pour la comparaison (YYYY-MM-DD)
        app.formatDateForComparison = function(date) {
            if (!date) return '';
            const d = new Date(date);
            return d.getFullYear() + '-' +
                   String(d.getMonth() + 1).padStart(2, '0') + '-' +
                   String(d.getDate()).padStart(2, '0');
        };

        // Gérer le début du drag
        app.handleCalendarDragStart = function(event, task) {
            this.calendarDraggedTask = task;
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/html', event.target.innerHTML);
            event.target.style.opacity = '0.4';
        };

        // Gérer la fin du drag
        app.handleCalendarDragEnd = function(event) {
            event.target.style.opacity = '1';
            this.calendarDraggedTask = null;
        };

        // Gérer le drag over
        app.handleCalendarDragOver = function(event) {
            if (event.preventDefault) {
                event.preventDefault();
            }
            event.dataTransfer.dropEffect = 'move';
            return false;
        };

        // Gérer le drop sur une date
        app.handleCalendarDrop = function(event, date) {
            if (event.stopPropagation) {
                event.stopPropagation();
            }

            if (this.calendarDraggedTask) {
                const newDate = this.formatDateForComparison(date);
                const task = this.tasks.find(t => t.id === this.calendarDraggedTask.id);

                if (task) {
                    task.dueDate = newDate;
                    this.save();
                    this.showToast('Succès', `Tâche déplacée au ${this.formatDate(newDate)}`, 'success');
                }
            }

            return false;
        };

        // Obtenir les jours du mois actuel
        app.getCalendarDays = function() {
            const year = this.currentYear;
            const month = this.currentMonth;

            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const daysInMonth = lastDay.getDate();
            const startingDayOfWeek = firstDay.getDay();

            const days = [];

            // Jours du mois précédent
            const prevMonthLastDay = new Date(year, month, 0).getDate();
            for (let i = startingDayOfWeek - 1; i >= 0; i--) {
                days.push({
                    day: prevMonthLastDay - i,
                    date: new Date(year, month - 1, prevMonthLastDay - i),
                    isCurrentMonth: false,
                    isToday: false
                });
            }

            // Jours du mois actuel
            const today = new Date();
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, month, day);
                days.push({
                    day,
                    date,
                    isCurrentMonth: true,
                    isToday: date.toDateString() === today.toDateString()
                });
            }

            // Jours du mois suivant pour compléter la grille
            const remainingDays = 42 - days.length; // 6 semaines * 7 jours
            for (let day = 1; day <= remainingDays; day++) {
                days.push({
                    day,
                    date: new Date(year, month + 1, day),
                    isCurrentMonth: false,
                    isToday: false
                });
            }

            return days;
        };

        // Navigation du calendrier
        app.previousMonth = function() {
            if (this.currentMonth === 0) {
                this.currentMonth = 11;
                this.currentYear--;
            } else {
                this.currentMonth--;
            }
        };

        app.nextMonth = function() {
            if (this.currentMonth === 11) {
                this.currentMonth = 0;
                this.currentYear++;
            } else {
                this.currentMonth++;
            }
        };

        app.goToToday = function() {
            const today = new Date();
            this.currentMonth = today.getMonth();
            this.currentYear = today.getFullYear();
        };

        // Obtenir le nom du mois
        app.getMonthName = function(month) {
            const months = [
                'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
            ];
            return months[month];
        };

        // Obtenir la semaine actuelle pour la vue semaine
        app.getWeekDays = function() {
            const today = new Date();
            const currentDay = today.getDay();
            const monday = new Date(today);
            monday.setDate(today.getDate() - currentDay + (currentDay === 0 ? -6 : 1));

            const days = [];
            for (let i = 0; i < 7; i++) {
                const date = new Date(monday);
                date.setDate(monday.getDate() + i);
                days.push({
                    date,
                    dayName: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][i],
                    isToday: date.toDateString() === today.toDateString()
                });
            }
            return days;
        };

        // Changer la vue du calendrier
        app.setCalendarView = function(view) {
            this.calendarView = view;
        };

        return app;
    },

    /**
     * Génère le HTML du calendrier avec drag & drop
     */
    getCalendarHTML() {
        return `
            <div class="h-full flex flex-col bg-white dark:bg-dark-bg">
                <!-- Header du calendrier -->
                <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-surface">
                    <div class="flex items-center gap-4">
                        <h2 class="text-2xl font-bold dark:text-white">
                            <i class="fa-solid fa-calendar-days mr-2 text-primary-600"></i>
                            <span x-text="getMonthName(currentMonth) + ' ' + currentYear"></span>
                        </h2>
                        <div class="flex gap-2">
                            <button @click="setCalendarView('month')"
                                    :class="calendarView === 'month' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'"
                                    class="px-3 py-1.5 rounded-lg text-sm font-medium transition">
                                Mois
                            </button>
                            <button @click="setCalendarView('week')"
                                    :class="calendarView === 'week' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'"
                                    class="px-3 py-1.5 rounded-lg text-sm font-medium transition">
                                Semaine
                            </button>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <button @click="previousMonth()"
                                class="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition">
                            <i class="fa-solid fa-chevron-left text-gray-700 dark:text-gray-300"></i>
                        </button>
                        <button @click="goToToday()"
                                class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition">
                            Aujourd'hui
                        </button>
                        <button @click="nextMonth()"
                                class="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition">
                            <i class="fa-solid fa-chevron-right text-gray-700 dark:text-gray-300"></i>
                        </button>
                    </div>
                </div>

                <!-- Vue Mois -->
                <div x-show="calendarView === 'month'" class="flex-1 overflow-auto p-6">
                    <!-- Jours de la semaine -->
                    <div class="grid grid-cols-7 gap-2 mb-2">
                        <template x-for="day in ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']">
                            <div class="text-center font-bold text-sm text-gray-600 dark:text-gray-400 py-2" x-text="day"></div>
                        </template>
                    </div>

                    <!-- Grille du calendrier -->
                    <div class="grid grid-cols-7 gap-2">
                        <template x-for="dayInfo in getCalendarDays()" :key="dayInfo.date.toISOString()">
                            <div @dragover="handleCalendarDragOver($event)"
                                 @drop="handleCalendarDrop($event, dayInfo.date)"
                                 class="min-h-[120px] p-2 rounded-lg border-2 transition-all cursor-pointer hover:shadow-lg"
                                 :class="{
                                     'bg-white dark:bg-dark-surface border-gray-200 dark:border-gray-700': dayInfo.isCurrentMonth && !dayInfo.isToday,
                                     'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 opacity-50': !dayInfo.isCurrentMonth,
                                     'bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700 ring-2 ring-primary-200 dark:ring-primary-800': dayInfo.isToday,
                                     'hover:border-primary-400 dark:hover:border-primary-600': true
                                 }">
                                <div class="flex justify-between items-start mb-2">
                                    <span class="text-sm font-bold"
                                          :class="{
                                              'text-gray-900 dark:text-white': dayInfo.isCurrentMonth,
                                              'text-gray-400 dark:text-gray-600': !dayInfo.isCurrentMonth,
                                              'text-primary-600 dark:text-primary-400': dayInfo.isToday
                                          }"
                                          x-text="dayInfo.day"></span>
                                    <span x-show="dayInfo.isToday" class="text-xs bg-primary-600 text-white px-2 py-0.5 rounded-full">
                                        Aujourd'hui
                                    </span>
                                </div>

                                <!-- Tâches du jour -->
                                <div class="space-y-1">
                                    <template x-for="task in getTasksForDate(dayInfo.date)" :key="task.id">
                                        <div draggable="true"
                                             @dragstart="handleCalendarDragStart($event, task)"
                                             @dragend="handleCalendarDragEnd($event)"
                                             @click="openTaskModal(task)"
                                             class="p-2 rounded text-xs cursor-move hover:scale-105 transition-all shadow-sm"
                                             :class="{
                                                 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-300': task.urgent,
                                                 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border border-amber-300': task.important && !task.urgent,
                                                 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-300': !task.urgent && !task.important
                                             }">
                                            <div class="font-medium truncate" x-text="task.title"></div>
                                            <div class="flex items-center gap-1 mt-1 text-[10px] opacity-75">
                                                <i class="fa-solid fa-folder" x-show="task.projectId"></i>
                                                <span x-show="task.projectId" x-text="getProjectName(task.projectId)" class="truncate"></span>
                                            </div>
                                        </div>
                                    </template>
                                </div>

                                <!-- Ajouter une tâche rapide -->
                                <button @click="openTaskModal({ dueDate: formatDateForComparison(dayInfo.date) })"
                                        x-show="dayInfo.isCurrentMonth"
                                        class="w-full mt-2 py-1 text-xs text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded transition">
                                    <i class="fa-solid fa-plus"></i>
                                </button>
                            </div>
                        </template>
                    </div>
                </div>

                <!-- Vue Semaine -->
                <div x-show="calendarView === 'week'" class="flex-1 overflow-auto p-6">
                    <div class="grid grid-cols-7 gap-4">
                        <template x-for="dayInfo in getWeekDays()" :key="dayInfo.date.toISOString()">
                            <div class="flex flex-col">
                                <!-- En-tête du jour -->
                                <div class="text-center p-3 rounded-t-lg"
                                     :class="dayInfo.isToday ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'">
                                    <div class="text-xs font-medium uppercase" x-text="dayInfo.dayName"></div>
                                    <div class="text-2xl font-bold mt-1" x-text="dayInfo.date.getDate()"></div>
                                </div>

                                <!-- Tâches du jour -->
                                <div @dragover="handleCalendarDragOver($event)"
                                     @drop="handleCalendarDrop($event, dayInfo.date)"
                                     class="flex-1 min-h-[400px] p-3 bg-white dark:bg-dark-surface border-2 border-t-0 rounded-b-lg space-y-2"
                                     :class="dayInfo.isToday ? 'border-primary-300 dark:border-primary-700' : 'border-gray-200 dark:border-gray-700'">
                                    <template x-for="task in getTasksForDate(dayInfo.date)" :key="task.id">
                                        <div draggable="true"
                                             @dragstart="handleCalendarDragStart($event, task)"
                                             @dragend="handleCalendarDragEnd($event)"
                                             @click="openTaskModal(task)"
                                             class="p-3 rounded-lg cursor-move hover:scale-105 transition-all shadow-sm border-l-4"
                                             :class="{
                                                 'bg-red-50 dark:bg-red-900/20 border-l-red-500': task.urgent,
                                                 'bg-amber-50 dark:bg-amber-900/20 border-l-amber-500': task.important && !task.urgent,
                                                 'bg-blue-50 dark:bg-blue-900/20 border-l-blue-500': !task.urgent && !task.important
                                             }">
                                            <div class="font-semibold text-sm dark:text-white" x-text="task.title"></div>
                                            <div class="text-xs text-gray-600 dark:text-gray-400 mt-1" x-show="task.projectId">
                                                <i class="fa-solid fa-folder mr-1"></i>
                                                <span x-text="getProjectName(task.projectId)"></span>
                                            </div>
                                            <div x-show="task.tags && task.tags.length > 0" class="flex flex-wrap gap-1 mt-2">
                                                <template x-for="tag in task.tags.slice(0, 2)">
                                                    <span class="text-[10px] px-2 py-0.5 rounded-full text-white"
                                                          :style="'background-color:' + getTagColor(tag)"
                                                          x-text="tag"></span>
                                                </template>
                                            </div>
                                        </div>
                                    </template>

                                    <!-- Ajouter une tâche -->
                                    <button @click="openTaskModal({ dueDate: formatDateForComparison(dayInfo.date) })"
                                            class="w-full py-2 text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition border-2 border-dashed border-gray-300 dark:border-gray-600">
                                        <i class="fa-solid fa-plus mr-1"></i> Ajouter une tâche
                                    </button>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>

                <!-- Légende -->
                <div class="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-surface">
                    <div class="flex items-center justify-center gap-6 text-sm">
                        <div class="flex items-center gap-2">
                            <div class="w-4 h-4 rounded bg-red-500"></div>
                            <span class="text-gray-700 dark:text-gray-300">Urgent</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <div class="w-4 h-4 rounded bg-amber-500"></div>
                            <span class="text-gray-700 dark:text-gray-300">Important</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <div class="w-4 h-4 rounded bg-blue-500"></div>
                            <span class="text-gray-700 dark:text-gray-300">Normal</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <i class="fa-solid fa-hand-pointer text-gray-500"></i>
                            <span class="text-gray-700 dark:text-gray-300">Glissez-déposez pour déplacer</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};
