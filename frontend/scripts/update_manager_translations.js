const fs = require('fs');
const langs = ['en', 'es', 'fr'];
const en = {
  header: {
    view: 'Manager View',
    welcome: 'Welcome, {{name}}',
    logout: 'Logout'
  },
  stats: {
    teamTasks: 'Team Tasks',
    completed: 'Completed',
    pending: 'Pending'
  },
  overview: {
    title: 'Team Progress Overview',
    noTasks: 'No tasks assigned to your team.',
    assignee: 'Assignee: {{name}}'
  }
};
const es = {
  header: {
    view: 'Vista de Gerente',
    welcome: 'Bienvenido, {{name}}',
    logout: 'Cerrar Sesión'
  },
  stats: {
    teamTasks: 'Tareas del Equipo',
    completed: 'Completado',
    pending: 'Pendiente'
  },
  overview: {
    title: 'Resumen del Progreso del Equipo',
    noTasks: 'No hay tareas asignadas a tu equipo.',
    assignee: 'Asignado: {{name}}'
  }
};
const fr = {
  header: {
    view: 'Vue Gestionnaire',
    welcome: 'Bienvenue, {{name}}',
    logout: 'Déconnexion'
  },
  stats: {
    teamTasks: "Tâches d'équipe",
    completed: 'Terminé',
    pending: 'En attente'
  },
  overview: {
    title: "Aperçu de la progression de l'équipe",
    noTasks: 'Aucune tâche assignée à votre équipe.',
    assignee: 'Assigné : {{name}}'
  }
};

langs.forEach(lng => {
  const path = './public/locales/'+lng+'/translation.json';
  let data = JSON.parse(fs.readFileSync(path, 'utf8'));
  data.managerDashboard = (lng==='en'?en:(lng==='es'?es:fr));
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
});
