import JuniorEntreprise from '@/lib/entities/JuniorEntreprise';
import JuniorCreation from '@/lib/entities/JuniorCreation';

/**
 * Fabrique responsable de la conversion des données JSON brutes
 * (fichiers statiques je.json / jc.json) en instances des entités métier.
 * Centraliser cette logique évite de dupliquer le mapping dans les
 * repositories et facilite l'évolution du schéma de données.
 */
class EntityFactory {
  static createJE(raw) {
    return new JuniorEntreprise(raw);
  }

  static createManyJE(rawList = []) {
    return rawList.map(EntityFactory.createJE);
  }

  static createJC(raw) {
    return new JuniorCreation(raw);
  }

  static createManyJC(rawList = []) {
    return rawList.map(EntityFactory.createJC);
  }
}

export default EntityFactory;
