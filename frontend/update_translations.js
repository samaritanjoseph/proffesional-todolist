const fs = require('fs');
const langs = ['en', 'es', 'fr'];
const en = {
  title: 'My Dashboard',
  subtitle: 'Track your assigned projects and time.',
  projects: 'My Projects',
  ended: 'Ended Projects',
  running: 'Running Projects',
  pending: 'Pending Projects',
  assigned: 'Assigned to Me',
  noProjects: 'No projects assigned yet.',
  table: { name: 'PROJECT NAME', due: 'DUE DATE', status: 'CURRENT STATUS', action: 'ACTION' },
  status: { pending: 'Pending', inProgress: 'In Progress', completed: 'Completed' },
  session: { title: 'Current Session', ready: 'Ready to start?' },
  upcoming: { title: 'Upcoming Deadlines', caughtUp: "You're all caught up!", due: 'Due:' }
};
const es = {
  title: 'Mi Tablero',
  subtitle: 'Haz un seguimiento de tus proyectos y tiempo.',
  projects: 'Mis Proyectos',
  ended: 'Proyectos Terminados',
  running: 'Proyectos en Curso',
  pending: 'Proyectos Pendientes',
  assigned: 'Asignado a Mí',
  noProjects: 'Aún no hay proyectos asignados.',
  table: { name: 'NOMBRE DEL PROYECTO', due: 'FECHA LÍMITE', status: 'ESTADO ACTUAL', action: 'ACCIÓN' },
  status: { pending: 'Pendiente', inProgress: 'En Curso', completed: 'Completado' },
  session: { title: 'Sesión Actual', ready: '¿Listo para empezar?' },
  upcoming: { title: 'Próximos Plazos', caughtUp: '¡Estás al día!', due: 'Vence:' }
};
const fr = {
  title: 'Mon Tableau de Bord',
  subtitle: 'Suivez vos projets et votre temps.',
  projects: 'Mes Projets',
  ended: 'Projets Terminés',
  running: 'Projets en Cours',
  pending: 'Projets en Attente',
  assigned: 'Assigné à Moi',
  noProjects: 'Aucun projet assigné pour le moment.',
  table: { name: 'NOM DU PROJET', due: "DATE D'ÉCHÉANCE", status: 'STATUT ACTUEL', action: 'ACTION' },
  status: { pending: 'En Attente', inProgress: 'En Cours', completed: 'Terminé' },
  session: { title: 'Session Actuelle', ready: 'Prêt à commencer ?' },
  upcoming: { title: 'Échéances à Venir', caughtUp: 'Vous êtes à jour !', due: 'Échéance :' }
};

langs.forEach(lng => {
  const path = './public/locales/'+lng+'/translation.json';
  let data = JSON.parse(fs.readFileSync(path, 'utf8'));
  data.userDashboard = (lng==='en'?en:(lng==='es'?es:fr));
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
});
