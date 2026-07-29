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
    logo = '',
  }) {
    this.id = id;
    this.nom = nom;
    this.region = region;
    this.etablissement = etablissement;
    // Les prestations sont bilingues ({ fr: [...], en: [...] }) dans
    // je.json. On accepte aussi l'ancien format (tableau simple, toujours
    // en français) par sécurité, pour ne pas casser si une donnée n'a pas
    // encore été migrée.
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
    this.logo = logo;
    this.type = 'JE';
  }

  /** Liste des prestations dans la langue demandée (repli sur le français). */
  getPrestations(locale = 'fr') {
    const list = this.prestationsByLocale[locale];
    return list && list.length ? list : this.prestationsByLocale.fr;
  }

  /** Nombre de prestations proposées par la JE (identique quelle que soit la langue). */
  get prestationsCount() {
    return this.prestationsByLocale.fr.length;
  }

  /** Résumé court utilisé sur les fiches synthétiques (2 prestations max), dans la langue demandée. */
  getShortPrestations(locale = 'fr') {
    return this.getPrestations(locale).slice(0, 2);
  }

  /** Coordonnées géographiques au format [lat, lng] attendu par Leaflet. */
  get position() {
    return [this.lat, this.lng];
  }

  /** Vrai si au moins un réseau social a été renseigné (pour l'affichage conditionnel). */
  get hasSocialLinks() {
    return Object.values(this.reseauxSociaux).some((url) => Boolean(url));
  }

  /** Vrai si un logo a été renseigné (permet un repli propre sur des initiales). */
  get hasLogo() {
    return Boolean(this.logo);
  }

  matchesRegion(region) {
    return !region || this.region === region;
  }
}