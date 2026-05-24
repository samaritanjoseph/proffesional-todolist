const fs = require('fs');
const langs = ['en', 'es', 'fr'];
const en = {
  header: {
    title: 'Calendar Workspace',
    subtitle: 'Track deadlines and stay ahead of your schedule.'
  },
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  details: {
    schedule: 'Schedule for today',
    noTasks: 'No tasks due on this day',
    more: '+ {{count}} more',
    overdue: 'Overdue check'
  }
};
const es = {
  header: {
    title: 'Espacio de Trabajo de Calendario',
    subtitle: 'Haz un seguimiento de los plazos y mantente al día.'
  },
  months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
  days: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  details: {
    schedule: 'Agenda para hoy',
    noTasks: 'No hay tareas para este día',
    more: '+ {{count}} más',
    overdue: 'Control de atrasos'
  }
};
const fr = {
  header: {
    title: 'Espace de Travail du Calendrier',
    subtitle: "Suivez les échéances et restez en avance sur votre planning."
  },
  months: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
  days: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
  details: {
    schedule: "Programme d'aujourd'hui",
    noTasks: 'Aucune tâche pour ce jour',
    more: '+ {{count}} de plus',
    overdue: 'Vérification du retard'
  }
};

langs.forEach(lng => {
  const path = './public/locales/'+lng+'/translation.json';
  let data = JSON.parse(fs.readFileSync(path, 'utf8'));
  data.calendar = (lng==='en'?en:(lng==='es'?es:fr));
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
});
