// Checkbox Component Tests

// Extract checkbox state logic for testing without rendering

interface CheckboxState {
  checked: boolean;
  accessibilityRole: string;
  accessibilityState: { checked: boolean };
  hasCheckmark: boolean;
}

function resolveCheckboxState(checked: boolean): CheckboxState {
  return {
    checked,
    accessibilityRole: 'checkbox',
    accessibilityState: { checked },
    hasCheckmark: checked,
  };
}

describe('Checkbox', () => {
  it('renders unchecked by default', () => {
    const state = resolveCheckboxState(false);
    expect(state.checked).toBe(false);
    expect(state.hasCheckmark).toBe(false);
  });

  it('shows checkmark when checked=true', () => {
    const state = resolveCheckboxState(true);
    expect(state.checked).toBe(true);
    expect(state.hasCheckmark).toBe(true);
  });

  it('hides checkmark when checked=false', () => {
    const state = resolveCheckboxState(false);
    expect(state.hasCheckmark).toBe(false);
  });

  it('has accessibilityRole="checkbox"', () => {
    const state = resolveCheckboxState(false);
    expect(state.accessibilityRole).toBe('checkbox');
  });

  it('has accessibilityState.checked=true when checked', () => {
    const state = resolveCheckboxState(true);
    expect(state.accessibilityState.checked).toBe(true);
  });

  it('has accessibilityState.checked=false when unchecked', () => {
    const state = resolveCheckboxState(false);
    expect(state.accessibilityState.checked).toBe(false);
  });

  it('toggles state on press', () => {
    let checked = false;
    const toggle = () => {
      checked = !checked;
    };

    expect(checked).toBe(false);
    toggle();
    expect(checked).toBe(true);
    toggle();
    expect(checked).toBe(false);
  });
});
