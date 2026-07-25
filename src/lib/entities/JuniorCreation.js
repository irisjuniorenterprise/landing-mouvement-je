/**
 * Entité métier représentant une Junior Création (JC) : une initiative
 * étudiante en cours de structuration en vue de devenir une JE.
 */
export default class JuniorCreation {
  constructor({ id, nom, region, etablissement, email, description = {}, lat, lng }) {
    this.id = id;
    this.nom = nom;
    this.region = region;
    this.etablissement = etablissement;
    this.email = email;
    this.descriptionByLocale =
      typeof description === 'string'
        ? { fr: description, en: '' }
        : { fr: description.fr || '', en: description.en || '' };
    this.lat = lat;
    this.lng = lng;
    this.type = 'JC';
  }

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