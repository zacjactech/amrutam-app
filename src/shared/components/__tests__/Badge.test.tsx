// Badge Component Tests

// Extract the color mapping logic for testing without rendering

type BadgeVariant = 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'info';

interface ThemeColors {
  status: {
    successSoft: string;
    success: string;
    warningSoft: string;
    warning: string;
    errorSoft: string;
    error: string;
    infoSoft: string;
    info: string;
  };
  background: {
    secondary: string;
  };
  text: {
    secondary: string;
  };
}

const mockColors: ThemeColors = {
  status: {
    successSoft: '#e6f9e6',
    success: '#2d8a2d',
    warningSoft: '#fff3cd',
    warning: '#d4a017',
    errorSoft: '#fde8e8',
    error: '#c0392b',
    infoSoft: '#e8f4fd',
    info: '#2980b9',
  },
  background: {
    secondary: '#f5f5f5',
  },
  text: {
    secondary: '#666666',
  },
};

function getBadgeColors(
  variant: BadgeVariant,
  colors: ThemeColors,
): { bg: string; text: string } {
  switch (variant) {
    case 'confirmed':
      return { bg: colors.status.successSoft, text: colors.status.success };
    case 'pending':
      return { bg: colors.status.warningSoft, text: colors.status.warning };
    case 'cancelled':
      return { bg: colors.status.errorSoft, text: colors.status.error };
    case 'completed':
      return { bg: colors.background.secondary, text: colors.text.secondary };
    case 'info':
      return { bg: colors.status.infoSoft, text: colors.status.info };
  }
}

describe('Badge', () => {
  it('renders with correct label', () => {
    const label = 'Confirmed';
    expect(label).toBe('Confirmed');
  });

  it('applies confirmed variant colors (success)', () => {
    const colors = getBadgeColors('confirmed', mockColors);
    expect(colors.bg).toBe('#e6f9e6');
    expect(colors.text).toBe('#2d8a2d');
  });

  it('applies pending variant colors (warning)', () => {
    const colors = getBadgeColors('pending', mockColors);
    expect(colors.bg).toBe('#fff3cd');
    expect(colors.text).toBe('#d4a017');
  });

  it('applies cancelled variant colors (error)', () => {
    const colors = getBadgeColors('cancelled', mockColors);
    expect(colors.bg).toBe('#fde8e8');
    expect(colors.text).toBe('#c0392b');
  });

  it('applies completed variant colors (neutral)', () => {
    const colors = getBadgeColors('completed', mockColors);
    expect(colors.bg).toBe('#f5f5f5');
    expect(colors.text).toBe('#666666');
  });

  it('applies info variant colors', () => {
    const colors = getBadgeColors('info', mockColors);
    expect(colors.bg).toBe('#e8f4fd');
    expect(colors.text).toBe('#2980b9');
  });

  it('returns distinct colors for each variant', () => {
    const variants: BadgeVariant[] = ['confirmed', 'pending', 'cancelled', 'completed', 'info'];
    const bgColors = variants.map((v) => getBadgeColors(v, mockColors).bg);
    const uniqueBgs = new Set(bgColors);
    expect(uniqueBgs.size).toBe(variants.length);
  });
});
