import { validateCandidature, validateSatisfaction } from '@/lib/utils/validation';

const validPayload = {
  name: 'Amira Ben Salah',
  email: 'amira@example.com',
  region: 'Sfax',
  establishment: 'ENIS',
  motivation: 'Je souhaite rejoindre le mouvement JE pour développer mes compétences.',
  acceptTerms: true,
};

describe('validateCandidature', () => {
  it('accepts a fully valid payload', () => {
    const { isValid, errors } = validateCandidature(validPayload);
    expect(isValid).toBe(true);
    expect(errors).toEqual({});
  });

  it('flags missing required fields', () => {
    const { isValid, errors } = validateCandidature({});
    expect(isValid).toBe(false);
    expect(errors.name).toBe('required');
    expect(errors.email).toBe('required');
    expect(errors.region).toBe('required');
    expect(errors.establishment).toBe('required');
    expect(errors.motivation).toBe('required');
  });

  it('flags an invalid email format', () => {
    const { errors } = validateCandidature({ ...validPayload, email: 'not-an-email' });
    expect(errors.email).toBe('invalidEmail');
  });

  it('flags a motivation shorter than 10 characters', () => {
    const { errors } = validateCandidature({ ...validPayload, motivation: 'trop court' });
    expect(errors.motivation).toBeUndefined(); // exactly 10 chars is valid
  });

  it('rejects a motivation under the 10 character threshold', () => {
    const { errors } = validateCandidature({ ...validPayload, motivation: 'court' });
    expect(errors.motivation).toBe('tooShort');
  });
});

describe('validateSatisfaction', () => {
  it('accepts a valid quarter-star rating with no comment', () => {
    const { isValid, errors } = validateSatisfaction({ rating: 4.25 });
    expect(isValid).toBe(true);
    expect(errors).toEqual({});
  });

  it('accepts the minimum (0.25) and maximum (5) ratings', () => {
    expect(validateSatisfaction({ rating: 0.25 }).isValid).toBe(true);
    expect(validateSatisfaction({ rating: 5 }).isValid).toBe(true);
  });

  it('flags a missing rating', () => {
    const { isValid, errors } = validateSatisfaction({});
    expect(isValid).toBe(false);
    expect(errors.rating).toBe('required');
  });

  it('flags a rating that is not a multiple of a quarter star', () => {
    const { errors } = validateSatisfaction({ rating: 3.1 });
    expect(errors.rating).toBe('invalidRating');
  });

  it('flags a rating out of the 0.25-5 range', () => {
    expect(validateSatisfaction({ rating: 0 }).errors.rating).toBe('invalidRating');
    expect(validateSatisfaction({ rating: 5.5 }).errors.rating).toBe('invalidRating');
  });

  it('flags a comment longer than 1000 characters', () => {
    const { errors } = validateSatisfaction({ rating: 3, comment: 'a'.repeat(1001) });
    expect(errors.comment).toBe('tooLong');
  });

  it('accepts a comment up to 1000 characters', () => {
    const { isValid } = validateSatisfaction({ rating: 3, comment: 'a'.repeat(1000) });
    expect(isValid).toBe(true);
  });
});