import KPIService from '@/lib/services/KPIService';

describe('KPIService', () => {
  const jeList = [
    { region: 'Sfax' },
    { region: 'Tunis' },
    { region: 'Sfax' },
  ];
  const jcList = [
    { region: 'Nabeul' },
    { region: 'Sfax' },
  ];

  describe('computeKPIs', () => {
    it('counts totals and unique regions across JE and JC', () => {
      const kpis = KPIService.computeKPIs(jeList, jcList);

      expect(kpis.totalJE).toBe(3);
      expect(kpis.totalJC).toBe(2);
      expect(kpis.totalRegions).toBe(3); // Sfax, Tunis, Nabeul
    });

    it('applies the average members per JE to estimate totalMembers', () => {
      const kpis = KPIService.computeKPIs(jeList, jcList, 10);
      expect(kpis.totalMembers).toBe(30);
    });

    it('uses a sensible default average when not provided', () => {
      const kpis = KPIService.computeKPIs(jeList, jcList);
      expect(kpis.totalMembers).toBe(jeList.length * 12);
    });

    it('handles empty lists gracefully', () => {
      const kpis = KPIService.computeKPIs([], []);
      expect(kpis).toEqual({ totalJE: 0, totalJC: 0, totalRegions: 0, totalMembers: 0 });
    });
  });

  describe('groupByRegion', () => {
    it('groups items by their region field', () => {
      const grouped = KPIService.groupByRegion(jeList);
      expect(grouped.Sfax).toHaveLength(2);
      expect(grouped.Tunis).toHaveLength(1);
    });

    it('falls back to a placeholder key when region is missing', () => {
      const grouped = KPIService.groupByRegion([{ region: undefined }]);
      expect(grouped['Non renseignée']).toHaveLength(1);
    });
  });
});
