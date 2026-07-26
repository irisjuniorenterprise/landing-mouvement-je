import jeData from '@/lib/data/je.json';
import EntityFactory from '@/lib/factories/EntityFactory';

/**
 * Accès aux données des Juniors Entreprises. Isoler la source de données
 * (aujourd'hui un fichier JSON statique) derrière un repository permet de
 * la remplacer demain (API, base de données) sans impacter les composants.
 */
class JERepository {
  static getAll() {
    return EntityFactory.createManyJE(jeData);
  }

  static getByRegion(region) {
    return JERepository.getAll().filter((je) => je.matchesRegion(region));
  }

  static getRegions() {
    return [...new Set(JERepository.getAll().map((je) => je.region))].sort();
  }
}

export default JERepository;
