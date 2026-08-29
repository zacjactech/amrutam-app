// Health Repository - Search Sanitization Tests

describe('Health Record Search Sanitization', () => {
  // Test the sanitization logic used in health repository
  function sanitizeSearchInput(input: string): string {
    return input.replace(/[%_]/g, (match) => `\\${match}`);
  }

  it('should escape percent characters', () => {
    expect(sanitizeSearchInput('test%query')).toBe('test\\%query');
  });

  it('should escape underscore characters', () => {
    expect(sanitizeSearchInput('test_query')).toBe('test\\_query');
  });

  it('should escape multiple special characters', () => {
    expect(sanitizeSearchInput('%test_name%')).toBe('\\%test\\_name\\%');
  });

  it('should not modify clean input', () => {
    expect(sanitizeSearchInput('normal search')).toBe('normal search');
  });

  it('should handle empty string', () => {
    expect(sanitizeSearchInput('')).toBe('');
  });

  it('should handle input with only special characters', () => {
    expect(sanitizeSearchInput('%_')).toBe('\\%\\_');
  });
});
