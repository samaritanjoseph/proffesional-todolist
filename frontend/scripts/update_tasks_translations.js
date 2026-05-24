const fs = require('fs');
const langs = ['en', 'es', 'fr'];
const en = {
  header: {
    title: 'Task Workspace',
    subtitle: 'Search, filter, and manage all projects in one place.'
  },
  filters: {
    search: 'Search tasks or descriptions...',
    status: {
      all: 'All Status',
      pending: 'Pending',
      inProgress: 'In Progress',
      completed: 'Completed'
    }
  },
  taskCard: {
    noDescription: 'No description provided for this task.',
    unassigned: 'Unassigned'
  },
  empty: {
    title: 'No tasks found',
    subtitle: 'Try adjusting your search or filters.'
  }
};
const es = {
  header: {
    title: 'Espacio de Trabajo de Tareas',
    subtitle: 'Busca, filtra y gestiona todos los proyectos en un solo lugar.'
  },
  filters: {
    search: 'Buscar tareas o descripciones...',
    status: {
      all: 'Todos los Estados',
      pending: 'Pendiente',
      inProgress: 'En Curso',
      completed: 'Completado'
    }
  },
  taskCard: {
    noDescription: 'No se ha proporcionado descripción para esta tarea.',
    unassigned: 'Sin asignar'
  },
  empty: {
    title: 'No se encontraron tareas',
    subtitle: 'Intenta ajustar tu búsqueda o filtros.'
  }
};
const fr = {
  header: {
    title: 'Espace de Travail des Tâches',
    subtitle: 'Recherchez, filtrez et gérez tous les projets en un seul endroit.'
  },
  filters: {
    search: 'Rechercher des tâches ou des descriptions...',
    status: {
      all: 'Tous les statuts',
      pending: 'En attente',
      inProgress: 'En cours',
      completed: 'Terminé'
    }
  },
  taskCard: {
    noDescription: 'Aucune description fournie pour cette tâche.',
    unassigned: 'Non assigné'
  },
  empty: {
    title: 'Aucune tâche trouvée',
    subtitle: "Essayez d'ajuster votre recherche ou vos filtres."
  }
};

langs.forEach(lng => {
  const path = './public/locales/'+lng+'/translation.json';
  let data = JSON.parse(fs.readFileSync(path, 'utf8'));
  data.tasksView = (lng==='en'?en:(lng==='es'?es:fr));
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
});
