const fs = require('fs');
const langs = ['en', 'es', 'fr'];
const en = {
  title: 'Dashboard',
  welcome: "Welcome back! Here's an overview of your projects.",
  newTask: '+ NEW TASK',
  stats: {
    total: 'Total Projects',
    ended: 'Ended Projects',
    running: 'Running Projects',
    pending: 'Pending Projects'
  },
  charts: {
    analytics: 'Project Analytics',
    week: 'This Week',
    month: 'This Month'
  },
  session: {
    title: 'Current Session',
    pausing: 'PAUSING...',
    stop: 'STOP'
  },
  reminders: {
    title: 'Reminders',
    viewAll: 'View All'
  },
  projects: {
    title: 'All Projects',
    name: 'PROJECT NAME',
    assignee: 'ASSIGNEE',
    due: 'DUE DATE',
    status: 'STATUS'
  },
  team: {
    title: 'Team Members',
    noMembers: 'No team members.',
    deleteTitle: 'Delete User'
  },
  modal: {
    title: 'Create New Task',
    taskTitle: 'Task Title',
    description: 'Description (Optional)',
    assignTo: 'Assign To',
    selectUser: 'Select User',
    dueDate: 'Due Date',
    cancel: 'Cancel',
    create: 'CREATE TASK'
  }
};
const es = {
  title: 'Tablero',
  welcome: '¡Bienvenido de nuevo! Aquí tienes una vista general de tus proyectos.',
  newTask: '+ NUEVA TAREA',
  stats: {
    total: 'Proyectos Totales',
    ended: 'Proyectos Terminados',
    running: 'Proyectos en Curso',
    pending: 'Proyectos Pendientes'
  },
  charts: {
    analytics: 'Analítica del Proyecto',
    week: 'Esta Semana',
    month: 'Este Mes'
  },
  session: {
    title: 'Sesión Actual',
    pausing: 'PAUSANDO...',
    stop: 'DETENER'
  },
  reminders: {
    title: 'Recordatorios',
    viewAll: 'Ver Todo'
  },
  projects: {
    title: 'Todos los Proyectos',
    name: 'NOMBRE DEL PROYECTO',
    assignee: 'ASIGNADO',
    due: 'FECHA LÍMITE',
    status: 'ESTADO'
  },
  team: {
    title: 'Miembros del Equipo',
    noMembers: 'Sin miembros del equipo.',
    deleteTitle: 'Eliminar Usuario'
  },
  modal: {
    title: 'Crear Nueva Tarea',
    taskTitle: 'Título de la Tarea',
    description: 'Descripción (Opcional)',
    assignTo: 'Asignar a',
    selectUser: 'Seleccionar Usuario',
    dueDate: 'Fecha Límite',
    cancel: 'Cancelar',
    create: 'CREAR TAREA'
  }
};
const fr = {
  title: 'Tableau de bord',
  welcome: 'Bon retour ! Voici un aperçu de vos projets.',
  newTask: '+ NOUVELLE TÂCHE',
  stats: {
    total: 'Total des projets',
    ended: 'Projets terminés',
    running: 'Projets en cours',
    pending: 'Projets en attente'
  },
  charts: {
    analytics: 'Analyse du projet',
    week: 'Cette semaine',
    month: 'Ce mois-ci'
  },
  session: {
    title: 'Session actuelle',
    pausing: 'PAUSE...',
    stop: 'ARRÊTER'
  },
  reminders: {
    title: 'Rappels',
    viewAll: 'Voir tout'
  },
  projects: {
    title: 'Tous les projets',
    name: 'NOM DU PROJET',
    assignee: 'ASSIGNÉ',
    due: "DATE D'ÉCHÉANCE",
    status: 'STATUT'
  },
  team: {
    title: "Membres de l'équipe",
    noMembers: 'Aucun membre.',
    deleteTitle: "Supprimer l'utilisateur"
  },
  modal: {
    title: 'Créer une nouvelle tâche',
    taskTitle: 'Titre de la tâche',
    description: 'Description (facultatif)',
    assignTo: 'Assigner à',
    selectUser: 'Sélectionner un utilisateur',
    dueDate: "Date d'échéance",
    cancel: 'Annuler',
    create: 'CRÉER LA TÂCHE'
  }
};

langs.forEach(lng => {
  const path = './public/locales/'+lng+'/translation.json';
  let data = JSON.parse(fs.readFileSync(path, 'utf8'));
  data.adminDashboard = (lng==='en'?en:(lng==='es'?es:fr));
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
});
