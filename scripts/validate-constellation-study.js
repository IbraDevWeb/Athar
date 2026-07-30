const fs = require('node:fs');

const core = fs.readFileSync('js/components/ConstellationCore.js', 'utf8');
const template = fs.readFileSync('js/components/ConstellationTemplate.js', 'utf8');
const css = fs.readFileSync('css/constellation-study.css', 'utf8');
const bootstrap = fs.readFileSync('js/components/ConstellationBootstrap.js', 'utf8');

if (/vis\.Network|barnesHut|physics\s*:/.test(core)) {
    throw new Error('La Constellation ne doit plus utiliser le graphe physique vis-network.');
}
if (!core.includes('api.alquran.cloud/v1/ayah/')) {
    throw new Error('Le chargement du texte arabe coranique est absent.');
}
if (!template.includes('dir="rtl"') || !template.includes('lang="ar"')) {
    throw new Error('Les blocs arabes RTL sont absents de la nouvelle interface.');
}
if (!template.includes('Repères coraniques en arabe')) {
    throw new Error('La section centrale des versets arabes est absente.');
}
if (!template.includes("mode==='study'") || !template.includes("mode==='themes'") || !template.includes("mode==='paths'")) {
    throw new Error('Les trois modes Étudier, Thèmes et Parcours doivent être présents.');
}
if (!template.includes('Piste de lecture') || !template.includes('Questions à garder ouvertes')) {
    throw new Error('La densité pédagogique de la fiche est insuffisante.');
}
if (!css.includes('.quran-study-layout') || !css.includes('.quran-study-arabic-verse')) {
    throw new Error('La feuille de style du lecteur est incomplète.');
}
if (!bootstrap.includes("athar-pro-v11")) {
    throw new Error('Le bootstrap Constellation doit utiliser la version v11.');
}

console.log('Constellation Study validée : lecteur statique, arabe RTL, thèmes et parcours.');