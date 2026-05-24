const fs = require('fs');
const path = require('path');

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'ar', name: 'العربية' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ' },
  { code: 'jv', name: 'Basa Jawa' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'vi', name: 'Tiếng Việt' },
  { code: 'mr', name: 'मराठी' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'ur', name: 'اردو' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'ml', name: 'മലയാളം' },
  { code: 'kn', name: 'ಕನ್ನಡ' },
  { code: 'or', name: 'ଓଡ଼ିଆ' },
  { code: 'fa', name: 'فارسی' },
  { code: 'pl', name: 'Polski' },
  { code: 'uk', name: 'Українська' },
  { code: 'ro', name: 'Română' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'el', name: 'Ελληνικά' },
  { code: 'hu', name: 'Magyar' },
  { code: 'cs', name: 'Čeština' },
  { code: 'sv', name: 'Svenska' },
  { code: 'sk', name: 'Slovenčina' },
  { code: 'he', name: 'עברית' },
  { code: 'da', name: 'Dansk' },
  { code: 'fi', name: 'Suomi' },
  { code: 'no', name: 'Norsk' },
  { code: 'hr', name: 'Hrvatski' },
  { code: 'bg', name: 'Български' },
  { code: 'lt', name: 'Lietuvių' },
  { code: 'sl', name: 'Slovenščina' },
  { code: 'et', name: 'Eesti' },
  { code: 'lv', name: 'Latviešu' },
  { code: 'ms', name: 'Bahasa Melayu' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'th', name: 'ไทย' },
  { code: 'am', name: 'አማርኛ' },
  { code: 'az', name: 'Azərbaycanca' },
  { code: 'ka', name: 'ქართული' },
  { code: 'af', name: 'Afrikaans' },
  { code: 'sw', name: 'Kiswahili' }
];

const localesDir = path.join(__dirname, '..', 'public', 'locales');
const sourceFile = path.join(localesDir, 'en', 'translation.json');

if (!fs.existsSync(sourceFile)) {
  console.error('Source translation file not found at:', sourceFile);
  process.exit(1);
}

const sourceData = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));

languages.forEach(lang => {
  const langDir = path.join(localesDir, lang.code);
  const targetFile = path.join(langDir, 'translation.json');

  if (!fs.existsSync(langDir)) {
    fs.mkdirSync(langDir, { recursive: true });
    console.log(`Created directory: ${lang.code}`);
  }

  // We only create if it doesn't exist or we want to update it
  // For now, let's just create it if it doesn't exist
  if (!fs.existsSync(targetFile)) {
    fs.writeFileSync(targetFile, JSON.stringify(sourceData, null, 2));
    console.log(`Initialized translation for: ${lang.name} (${lang.code})`);
  }
});

console.log('All 50+ language locales initialized!');
