const fs = require('fs');
const langs = ['en', 'es', 'fr'];
const en = {
  header: {
    title: 'Team Management',
    subtitle: 'View and manage your team members and their productivity.',
    invite: 'INVITE MEMBER'
  },
  table: {
    member: 'Member',
    role: 'Role',
    taskStats: 'Task Stats',
    progress: 'Progress',
    actions: 'Actions',
    total: 'Total',
    done: 'Done',
    efficiency: 'Efficiency'
  },
  messages: {
    confirmDelete: 'Are you sure you want to remove this team member?',
    memberRemoved: 'Member removed',
    removeFailed: 'Failed to remove member'
  }
};
const es = {
  header: {
    title: 'Gestión de Equipo',
    subtitle: 'Visualiza y gestiona a los miembros de tu equipo y su productividad.',
    invite: 'INVITAR MIEMBRO'
  },
  table: {
    member: 'Miembro',
    role: 'Rol',
    taskStats: 'Estadísticas de Tareas',
    progress: 'Progreso',
    actions: 'Acciones',
    total: 'Total',
    done: 'Hecho',
    efficiency: 'Eficiencia'
  },
  messages: {
    confirmDelete: '¿Estás seguro de que deseas eliminar a este miembro del equipo?',
    memberRemoved: 'Miembro eliminado',
    removeFailed: 'Error al eliminar al miembro'
  }
};
const fr = {
  header: {
    title: "Gestion de l'Équipe",
    subtitle: 'Visualisez et gérez les membres de votre équipe et leur productivité.',
    invite: 'INVITER UN MEMBRE'
  },
  table: {
    member: 'Membre',
    role: 'Rôle',
    taskStats: 'Stats des tâches',
    progress: 'Progression',
    actions: 'Actions',
    total: 'Total',
    done: 'Fait',
    efficiency: 'Efficacité'
  },
  messages: {
    confirmDelete: 'Êtes-vous sûr de vouloir supprimer ce membre de l’équipe ?',
    memberRemoved: 'Membre supprimé',
    removeFailed: 'Échec de la suppression du membre'
  }
};

langs.forEach(lng => {
  const path = './public/locales/'+lng+'/translation.json';
  let data = JSON.parse(fs.readFileSync(path, 'utf8'));
  data.team = (lng==='en'?en:(lng==='es'?es:fr));
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
});
