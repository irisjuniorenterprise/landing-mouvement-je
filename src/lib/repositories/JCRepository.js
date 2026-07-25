import jcData from '@/lib/data/jc.json';
import EntityFactory from '@/lib/factories/EntityFactory';

/**
 * Accès aux données des Junior Créations (JC), sur le même modèle que
 * JERepository afin de garder une architecture cohérente et extensible.
 */
class JCRepository {
  static getAll() {
    return EntityFactory.createManyJC(jcData);
  }

  static getByRegion(region) {
    return JCRepository.getAll().filter((jc) => jc.matchesRegion(region));
  }

  static getRegions() {
    return [...new Set(JCRepository.getAll().map((jc) => jc.region))].sort();
  }
}

export default JCRepository;