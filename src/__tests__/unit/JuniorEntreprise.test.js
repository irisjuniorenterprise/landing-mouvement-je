import JuniorEntreprise from '@/lib/entities/JuniorEntreprise';

describe('JuniorEntreprise', () => {
  const raw = {
    id: 1,
    nom: 'IRIS Junior Entreprise',
    region: 'Sfax',
    etablissement: 'ENIS',
    prestations: {
      fr: ['Études de marché', 'Développement web', 'Stratégie'],
      en: ['Market research', 'Web development', 'Strategy'],
    },
    email: 'iris@je.tn',
    dateCreation: '2014',
    lat: 34.74,
    lng: 10.76,
  };

  it('assigns all provided fields and marks the type as JE', () => {
    const je = new JuniorEntreprise(raw);

    expect(je.id).toBe(1);
    expect(je.nom).toBe('IRIS Junior Entreprise');
    expect(je.region).toBe('Sfax');
    expect(je.type).toBe('JE');
  });

  it('computes prestationsCount from the French prestations list', () => {
    const je = new JuniorEntreprise(raw);
    expect(je.prestationsCount).toBe(3);
  });

  it('returns prestations in the requested locale', () => {
    const je = new JuniorEntreprise(raw);
    expect(je.getPrestations('fr')).toEqual(['Études de marché', 'Développement web', 'Stratégie']);
    expect(je.getPrestations('en')).toEqual(['Market research', 'Web development', 'Strategy']);
  });

  it('falls back to French when the requested locale has no translation', () => {
    const je = new JuniorEntreprise({ ...raw, prestations: { fr: raw.prestations.fr, en: [] } });
    expect(je.getPrestations('en')).toEqual(raw.prestations.fr);
  });

  it('limits getShortPrestations to at most two entries, in the given locale', () => {
    const je = new JuniorEntreprise(raw);
    expect(je.getShortPrestations('fr')).toEqual(['Études de marché', 'Développement web']);
    expect(je.getShortPrestations('en')).toEqual(['Market research', 'Web development']);
  });

  it('accepts the legacy flat-array prestations format (French only)', () => {
    const je = new JuniorEntreprise({ ...raw, prestations: ['Études de marché', 'Développement web'] });
    expect(je.getPrestations('fr')).toEqual(['Études de marché', 'Développement web']);
    expect(je.getPrestations('en')).toEqual(['Études de marché', 'Développement web']);
  });

  it('exposes position as a [lat, lng] pair for Leaflet', () => {
    const je = new JuniorEntreprise(raw);
    expect(je.position).toEqual([34.74, 10.76]);
  });

  describe('matchesRegion', () => {
    it('returns true when no region filter is provided', () => {
      const je = new JuniorEntreprise(raw);
      expect(je.matchesRegion(null)).toBe(true);
      expect(je.matchesRegion(undefined)).toBe(true);
    });

    it('returns true only when the region matches exactly', () => {
      const je = new JuniorEntreprise(raw);
      expect(je.matchesRegion('Sfax')).toBe(true);
      expect(je.matchesRegion('Tunis')).toBe(false);
    });
  });

  it('defaults prestations to an empty array when omitted', () => {
    const je = new JuniorEntreprise({ id: 2, nom: 'X', region: 'Tunis', email: 'x@je.tn' });
    expect(je.getPrestations('fr')).toEqual([]);
    expect(je.prestationsCount).toBe(0);
  });
});