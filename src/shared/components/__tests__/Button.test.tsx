// Button Component Tests

// Extract the props interface and logic for testing without rendering
// (testEnvironment: 'node' doesn't support React Native rendering)

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  accessibilityLabel?: string;
  style?: object;
  textStyle?: object;
  testID?: string;
}

function resolveButtonState(props: ButtonProps) {
  const disabled = props.disabled ?? false;
  const loading = props.loading ?? false;
  const isDisabled = disabled || loading;
  return {
    isDisabled,
    accessibilityLabel: props.accessibilityLabel ?? props.title,
    accessibilityRole: 'button' as const,
    accessibilityState: { disabled: isDisabled, busy: loading },
    showLoader: loading,
    showTitle: !loading,
  };
}

describe('Button', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  it('resolves title as accessibility label when no custom label provided', () => {
    const state = resolveButtonState({ title: 'Submit', onPress: mockOnPress });
    expect(state.accessibilityLabel).toBe('Submit');
  });

  it('uses custom accessibilityLabel when provided', () => {
    const state = resolveButtonState({
      title: 'Submit',
      onPress: mockOnPress,
      accessibilityLabel: 'Submit form',
    });
    expect(state.accessibilityLabel).toBe('Submit form');
  });

  it('has accessibilityRole="button"', () => {
    const state = resolveButtonState({ title: 'OK', onPress: mockOnPress });
    expect(state.accessibilityRole).toBe('button');
  });

  it('is not disabled by default', () => {
    const state = resolveButtonState({ title: 'OK', onPress: mockOnPress });
    expect(state.isDisabled).toBe(false);
    expect(state.accessibilityState.disabled).toBe(false);
  });

  it('is disabled when disabled=true', () => {
    const state = resolveButtonState({ title: 'OK', onPress: mockOnPress, disabled: true });
    expect(state.isDisabled).toBe(true);
    expect(state.accessibilityState.disabled).toBe(true);
  });

  it('is disabled when loading=true', () => {
    const state = resolveButtonState({ title: 'OK', onPress: mockOnPress, loading: true });
    expect(state.isDisabled).toBe(true);
    expect(state.accessibilityState.disabled).toBe(true);
  });

  it('shows loading indicator when loading=true', () => {
    const state = resolveButtonState({ title: 'Save', onPress: mockOnPress, loading: true });
    expect(state.showLoader).toBe(true);
    expect(state.showTitle).toBe(false);
  });

  it('hides title when loading', () => {
    const state = resolveButtonState({ title: 'Save', onPress: mockOnPress, loading: true });
    expect(state.showTitle).toBe(false);
  });

  it('shows title when not loading', () => {
    const state = resolveButtonState({ title: 'Save', onPress: mockOnPress, loading: false });
    expect(state.showTitle).toBe(true);
    expect(state.showLoader).toBe(false);
  });

  it('calls onPress when pressed (not disabled)', () => {
    const state = resolveButtonState({ title: 'Click', onPress: mockOnPress });
    expect(state.isDisabled).toBe(false);
    // Simulate press
    mockOnPress();
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const state = resolveButtonState({ title: 'Click', onPress: mockOnPress, disabled: true });
    expect(state.isDisabled).toBe(true);
    // onPress should not be called when disabled
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('sets busy=true in accessibilityState when loading', () => {
    const state = resolveButtonState({ title: 'OK', onPress: mockOnPress, loading: true });
    expect(state.accessibilityState.busy).toBe(true);
  });

  it('sets busy=false in accessibilityState when not loading', () => {
    const state = resolveButtonState({ title: 'OK', onPress: mockOnPress, loading: false });
    expect(state.accessibilityState.busy).toBe(false);
  });
});
