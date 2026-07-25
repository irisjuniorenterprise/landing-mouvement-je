/**
 * Service métier responsable du calcul des indicateurs clés de performance
 * (KPIs) affichés sur la landing page, à partir des listes de JE et de JC.
 * Isoler ce calcul dans un service dédié le rend testable indépendamment
 * de l'UI (voir __tests__/unit/KPIService.test.js, US-21).
 */
class KPIService {
  /**
   * @param {Array} jeList - Liste d'entités JuniorEntreprise (ou objets bruts avec `region`).
   * @param {Array} jcList - Liste d'entités JuniorCreation (ou objets bruts avec `region`).
   * @param {number} avgMembersPerJE - Hypothèse du nombre moyen de membres actifs par JE.
   */
  static computeKPIs(jeList = [], jcList = [], avgMembersPerJE = 12) {
    const regions = new Set([
      ...jeList.map((je) => je.region),
      ...jcList.map((jc) => jc.region),
    ]);

    return {
      totalJE: jeList.length,
      totalJC: jcList.length,
      totalRegions: regions.size,
      totalMembers: jeList.length * avgMembersPerJE,
    };
  }

  /** Regroupe les JE par région, utile pour des vues agrégées futures. */
  static groupByRegion(list = []) {
    return list.reduce((acc, item) => {
      const key = item.region || 'Non renseignée';
      acc[key] = acc[key] || [];
      acc[key].push(item);
      return acc;
    }, {});
  }
}

export default KPIService;