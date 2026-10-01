import { useColors as useThemeColors } from '@/context/ThemeContext';

/** Theme-aware colors. Prefer this over importing Colors directly. */
export function useColors() {
  return useThemeColors();
}

export default useColors;
