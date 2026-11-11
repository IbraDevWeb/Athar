// Moteur de datation documentaire pour la frise Athar.
// Ne déduit JAMAIS une année à partir de l'âge, de la ville, des mots du récit
// ou des dates d'autres événements de la biographie.
const ATHAR_CHRONOLOGY = (() => {
  const references = Object.freeze({
    '71-0': {
      sourceTitle: 'Sahîh al-Bukhârî 516 — Abou Qatâda',
      sourceUrl: 'https://sunnah.com/bukhari:516',
      note: 'Le hadith rapporte que le Prophète ﷺ portait Oumâma pendant la prière. Il ne fournit aucune année. « Enfance » décrit son âge, pas la date de l’épisode.'
    }
  });
  const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const periodByYear = n => n <= 0 ? 'origins' : n <= 10 ? 'prophetic' : n <= 40 ? 'rashidun' : n <= 132 ? 'umayyad' : n <= 656 ? 'abbasid' : 'postclassical';
  const make = (year, periodId, precision, detail) => ({
    year, sortYear: Number.isFinite(year) ? year : (periodId === 'origins' ? -1 : 9999),
    periodId, precision, detail,
    dateBadge: precision === 'reported' ? 'Année dans la notice' :
      precision === 'variant' ? 'Datation divergente' :
      precision === 'anchored' ? 'Année d’un événement-repère' :
      precision === 'period' ? 'Période identifiée' : 'Date non renseignée'
  });
  const resolve = (event, chapterId, eventIndex) => {
    const raw = normalize(event?.year);
    const reference = references[`${chapterId}-${eventIndex}`] || (raw === 'badr' ? {
      sourceTitle: 'Bataille de Badr — 2 H',
      sourceUrl: 'https://www.islam.museum/en/event/battle-of-badr/',
      note: 'La bataille a lieu en 2 H. La participation de chaque personne exige une référence biographique distincte.'
    } : null);
    let dating;
    // Ne pas convertir « Après 11 H » en « 11 H », ni « 17 ans » en 17 H.
    if (/^(apres|avant|vers|environ|depuis)\b/.test(raw) && /\d+\s*h\b/.test(raw)) {
      dating = make(null, 'undated', 'undated', 'La notice donne seulement une borne, pas une année unique.');
    } else {
      const alternatives = raw.match(/^(\d{1,3})\s*(?:ou|\/|[-–])\s*(\d{1,3})\s*h\b/)
        || raw.match(/^(\d{1,3})\s*h\b.*?\b(\d{1,3})\s*h\b/);
      if (alternatives) {
        const years = [Number(alternatives[1]), Number(alternatives[2])];
        const periods = years.map(periodByYear);
        dating = periods[0] === periods[1]
          ? make(Math.min(...years), periods[0], 'variant', 'Deux datations rapportées : ordre indicatif, aucune année imposée.')
          : make(null, 'undated', 'undated', 'Datations divergentes traversant plusieurs périodes : classement chronologique non imposé.');
      } else {
        const explicit = raw.match(/^(\d{1,3})\s*h\b/);
        if (explicit) {
          const year = Number(explicit[1]);
          dating = year > 0 && year <= 999
            ? make(year, periodByYear(year), 'reported', 'Année indiquée dans la biographie ; ce seul libellé ne constitue pas une vérification de la date.')
            : make(null, 'undated', 'undated', 'Année non exploitable.');
        }
      }
    }
    if (!dating) {
      // Seulement des repères EXPLICITEMENT identifiés. Un lieu ou l'âge n'est pas une date.
      if (/^(avant l.?hegire|pre-islam|pre islam|aqaba(?: i| ii)?|abyssinie)$/.test(raw)) {
        dating = make(null, 'origins', 'period', 'Événement décrit comme antérieur à l’Hégire ; année précise non renseignée.');
      } else if (/^califat d.?omar$/.test(raw)) {
        dating = make(null, 'rashidun', 'period', 'Sous le califat de ‘Oumar ; année précise non renseignée.');
      } else if (raw === 'badr') {
        dating = make(2, 'prophetic', 'anchored', 'La bataille de Badr se situe en 2 H ; la présence de ce personnage dépend du récit de sa notice.');
      } else {
        dating = make(null, 'undated', 'undated', 'Ce libellé ne donne pas d’année historique vérifiable ; aucun placement n’est déduit automatiquement.');
      }
    }
    return { ...dating, reference };
  };
  return Object.freeze({ resolve, references, periodByYear });
})();
