const fs = require('fs');
const langs = ['en', 'es', 'fr'];
const en = {
  login: {
    title: 'Sign in to Nexus',
    subtitle: 'Please enter your details to continue to your workspace.',
    email: 'Work Email',
    password: 'Password',
    forgotPassword: 'Forgot password?',
    signIn: 'Sign In',
    noAccount: "Don't have an account?",
    createAccount: 'Create Account',
    welcomeBack: 'Welcome back! 👋',
    fillFields: 'Please fill in all fields',
    authFailed: 'Authentication failed'
  },
  register: {
    title: 'Join the next generation of task management.',
    subtitle: 'Secure, high-performance task management designed for elite teams.',
    createAccount: 'Create Account',
    signUpText: 'Join thousands of professionals using Nexus.',
    fullName: 'Full Name',
    email: 'Work Email',
    password: 'Password',
    confirm: 'Confirm Password',
    createWorkspace: 'Create Workspace',
    alreadyHave: 'Already have an account?',
    signIn: 'Sign In',
    enterOtp: 'Verify your email',
    otpSent: 'We sent a 6-digit code to',
    otpCode: 'OTP Code',
    complete: 'Complete Setup',
    wrongEmail: 'Entered the wrong email?',
    otpSentSuccess: 'OTP sent to your email',
    passMismatch: 'Passwords do not match',
    regFailed: 'Registration Failed',
    verified: 'Account verified!',
    invalidOtp: 'Invalid or expired OTP',
    fillFields: 'Please fill in all fields',
    otpLengthError: 'Please enter a 6-digit code'
  }
};
const es = {
  login: {
    title: 'Iniciar sesión en Nexus',
    subtitle: 'Por favor, introduce tus datos para continuar a tu espacio de trabajo.',
    email: 'Correo electrónico de trabajo',
    password: 'Contraseña',
    forgotPassword: '¿Olvidaste tu contraseña?',
    signIn: 'Iniciar Sesión',
    noAccount: '¿No tienes una cuenta?',
    createAccount: 'Crear Cuenta',
    welcomeBack: '¡Bienvenido de nuevo! 👋',
    fillFields: 'Por favor, completa todos los campos',
    authFailed: 'La autenticación falló'
  },
  register: {
    title: 'Únete a la próxima generación de gestión de tareas.',
    subtitle: 'Gestión de tareas segura y de alto rendimiento diseñada para equipos de élite.',
    createAccount: 'Crear Cuenta',
    signUpText: 'Únete a miles de profesionales que usan Nexus.',
    fullName: 'Nombre Completo',
    email: 'Correo electrónico de trabajo',
    password: 'Contraseña',
    confirm: 'Confirmar Contraseña',
    createWorkspace: 'Crear Espacio de Trabajo',
    alreadyHave: '¿Ya tienes una cuenta?',
    signIn: 'Iniciar Sesión',
    enterOtp: 'Verifica tu correo',
    otpSent: 'Hemos enviado un código de 6 dígitos a',
    otpCode: 'Código OTP',
    complete: 'Completar Configuración',
    wrongEmail: '¿Ingresaste el correo equivocado?',
    otpSentSuccess: 'OTP enviado a tu correo',
    passMismatch: 'Las contraseñas no coinciden',
    regFailed: 'Registro Fallido',
    verified: '¡Cuenta verificada!',
    invalidOtp: 'OTP inválido o expirado',
    fillFields: 'Por favor, completa todos los campos',
    otpLengthError: 'Por favor, introduce un código de 6 dígitos'
  }
};
const fr = {
  login: {
    title: 'Se connecter à Nexus',
    subtitle: 'Veuillez saisir vos coordonnées pour continuer vers votre espace de travail.',
    email: 'E-mail professionnel',
    password: 'Mot de passe',
    forgotPassword: 'Mot de passe oublié ?',
    signIn: 'Se connecter',
    noAccount: "Vous n'avez pas de compte ?",
    createAccount: 'Créer un compte',
    welcomeBack: 'Bon retour ! 👋',
    fillFields: 'Veuillez remplir tous les champs',
    authFailed: "L'authentification a échoué"
  },
  register: {
    title: 'Rejoignez la prochaine génération de gestion de tâches.',
    subtitle: 'Gestion de tâches sécurisée et performante conçue pour les équipes d’élite.',
    createAccount: 'Créer un compte',
    signUpText: 'Rejoignez des milliers de professionnels utilisant Nexus.',
    fullName: 'Nom complet',
    email: 'E-mail professionnel',
    password: 'Mot de passe',
    confirm: 'Confirmer le mot de passe',
    createWorkspace: 'Créer un espace de travail',
    alreadyHave: 'Vous avez déjà un compte ?',
    signIn: 'Se connecter',
    enterOtp: 'Vérifiez votre e-mail',
    otpSent: 'Nous avons envoyé un code à 6 chiffres à',
    otpCode: 'Code OTP',
    complete: 'Terminer la configuration',
    wrongEmail: 'Mauvaise adresse e-mail ?',
    otpSentSuccess: 'OTP envoyé sur votre e-mail',
    passMismatch: 'Les mots de passe ne correspondent pas',
    regFailed: "L'inscription a échoué",
    verified: 'Compte vérifié !',
    invalidOtp: 'OTP invalide ou expiré',
    fillFields: 'Veuillez remplir tous les champs',
    otpLengthError: 'Veuillez saisir un code à 6 chiffres'
  }
};

langs.forEach(lng => {
  const path = './public/locales/'+lng+'/translation.json';
  let data = JSON.parse(fs.readFileSync(path, 'utf8'));
  data.login = (lng==='en'?en.login:(lng==='es'?es.login:fr.login));
  data.register = (lng==='en'?en.register:(lng==='es'?es.register:fr.register));
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
});
