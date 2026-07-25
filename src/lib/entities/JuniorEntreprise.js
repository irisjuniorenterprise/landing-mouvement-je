/**
 * Entité métier représentant une Junior Entreprise (JE).
 * Encapsule les données et expose des accesseurs utiles aux composants
 * et services, évitant de manipuler des objets JSON bruts dans l'UI.
 */
export default class JuniorEntreprise {
  constructor({
    id,
    nom,
    region,
    etablissement = '',
    prestations = {},
    email,
    dateCreation,
    lat,
    lng,
    reseaux_sociaux = {},
  }) {
    this.id = id;
    this.nom = nom;
    this.region = region;
    this.etablissement = etablissement;
    this.prestationsByLocale = Array.isArray(prestations)
      ? { fr: prestations, en: [] }
      : { fr: prestations.fr || [], en: prestations.en || [] };
    this.email = email;
    this.dateCreation = dateCreation;
    this.lat = lat;
    this.lng = lng;
    this.reseauxSociaux = {
      facebook: reseaux_sociaux.facebook || '',
      instagram: reseaux_sociaux.instagram || '',
      linkedin: reseaux_sociaux.linkedin || '',
    };
    this.type = 'JE';
  }

  getPrestations(locale = 'fr') {
    const list = this.prestationsByLocale[locale];
    return list && list.length ? list : this.prestationsByLocale.fr;
  }

  get prestationsCount() {
    return this.prestationsByLocale.fr.length;
  }

  getShortPrestations(locale = 'fr') {
    return this.getPrestations(locale).slice(0, 2);
  }

  get position() {
    return [this.lat, this.lng];
  }

  get hasSocialLinks() {
    return Object.values(this.reseauxSociaux).some((url) => Boolean(url));
  }

  matchesRegion(region) {
    return !region || this.region === region;
  }
}