/**
 * Entité métier représentant une Junior Création (JC) : une initiative
 * étudiante en cours de structuration en vue de devenir une JE.
 */
export default class JuniorCreation {
  constructor({ id, nom, region, etablissement, email, description = {}, lat, lng, logo = '' }) {
    this.id = id;
    this.nom = nom;
    this.region = region;
    this.etablissement = etablissement;
    this.email = email;
    // Description bilingue ({ fr, en) dans jc.json ; on accepte aussi
    // l'ancien format (chaîne simple, toujours en français) par sécurité.
    this.descriptionByLocale =
      typeof description === 'string'
        ? { fr: description, en: '' }
        : { fr: description.fr || '', en: description.en || '' };
    this.lat = lat;
    this.lng = lng;
    this.logo = logo;
    this.type = 'JC';
  }

  /** Vrai si un logo a été renseigné (permet un repli propre sur des initiales). */
  get hasLogo() {
    return Boolean(this.logo);
  }

  /** Description dans la langue demandée (repli sur le français). */
  getDescription(locale = 'fr') {
    return this.descriptionByLocale[locale] || this.descriptionByLocale.fr;
  }

  get position() {
    return [this.lat, this.lng];
  }

  matchesRegion(region) {
    return !region || this.region === region;
  }
}