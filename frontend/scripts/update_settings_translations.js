const fs = require('fs');
const langs = ['en', 'es', 'fr'];
const en = {
  header: {
    title: 'Account Settings',
    subtitle: 'Manage your profile, notifications, and preferences.'
  },
  tabs: {
    profile: 'Profile Information',
    security: 'Security & Password',
    notifications: 'Notifications',
    appearance: 'Appearance'
  },
  profile: {
    fullName: 'Full Name',
    email: 'Email Address',
    save: 'SAVE CHANGES',
    success: 'Profile updated successfully!',
    failed: 'Update failed'
  },
  security: {
    title: 'Change Password',
    subtitle: 'Ensure your account is using a long, random password to stay secure.',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password',
    update: 'UPDATE PASSWORD',
    matchError: 'Passwords do not match',
    success: 'Password changed successfully!',
    failed: 'Failed to change password'
  },
  appearance: {
    title: 'Theme Selection',
    subtitle: 'Choose the look and feel that suits your workflow.',
    catchy: 'Catchy Vibrant',
    bw: 'Black & White',
    switched: 'Theme switched!'
  },
  notifications: {
    info: 'Notifications system is automated and always ON.'
  }
};
const es = {
  header: {
    title: 'Configuración de la Cuenta',
    subtitle: 'Gestiona tu perfil, notificaciones y preferencias.'
  },
  tabs: {
    profile: 'Información del Perfil',
    security: 'Seguridad y Contraseña',
    notifications: 'Notificaciones',
    appearance: 'Apariencia'
  },
  profile: {
    fullName: 'Nombre Completo',
    email: 'Correo Electrónico',
    save: 'GUARDAR CAMBIOS',
    success: '¡Perfil actualizado con éxito!',
    failed: 'Error al actualizar'
  },
  security: {
    title: 'Cambiar Contraseña',
    subtitle: 'Asegúrate de que tu cuenta utilice una contraseña larga y aleatoria para mantenerte seguro.',
    currentPassword: 'Contraseña Actual',
    newPassword: 'Nueva Contraseña',
    confirmPassword: 'Confirmar Contraseña',
    update: 'ACTUALIZAR CONTRASEÑA',
    matchError: 'Las contraseñas no coinciden',
    success: '¡Contraseña cambiada con éxito!',
    failed: 'Error al cambiar la contraseña'
  },
  appearance: {
    title: 'Selección de Tema',
    subtitle: 'Elige el aspecto que mejor se adapte a tu flujo de trabajo.',
    catchy: 'Vibrante y Llamativo',
    bw: 'Blanco y Negro',
    switched: '¡Tema cambiado!'
  },
  notifications: {
    info: 'El sistema de notificaciones está automatizado y siempre ACTIVO.'
  }
};
const fr = {
  header: {
    title: 'Paramètres du Compte',
    subtitle: 'Gérez votre profil, vos notifications et vos préférences.'
  },
  tabs: {
    profile: 'Informations du profil',
    security: 'Sécurité et mot de passe',
    notifications: 'Notifications',
    appearance: 'Apparence'
  },
  profile: {
    fullName: 'Nom complet',
    email: 'Adresse e-mail',
    save: 'ENREGISTRER LES MODIFICATIONS',
    success: 'Profil mis à jour avec succès !',
    failed: 'Échec de la mise à jour'
  },
  security: {
    title: 'Changer le mot de passe',
    subtitle: 'Assurez-vous que votre compte utilise un mot de passe long et aléatoire pour rester en sécurité.',
    currentPassword: 'Mot de passe actuel',
    newPassword: 'Nouveau mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    update: 'METTRE À JOUR LE MOT DE PASSE',
    matchError: 'Les mots de passe ne correspondent pas',
    success: 'Mot de passe changé avec succès !',
    failed: 'Échec du changement de mot de passe'
  },
  appearance: {
    title: 'Sélection du thème',
    subtitle: 'Choisissez l’apparence qui convient à votre flux de travail.',
    catchy: 'Vibrant et accrocheur',
    bw: 'Noir et Blanc',
    switched: 'Thème changé !'
  },
  notifications: {
    info: 'Le système de notifications est automatisé et toujours ACTIF.'
  }
};

langs.forEach(lng => {
  const path = './public/locales/'+lng+'/translation.json';
  let data = JSON.parse(fs.readFileSync(path, 'utf8'));
  data.settings = (lng==='en'?en:(lng==='es'?es:fr));
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
});
