/**
 * App configuration — flip USE_REMOTE_API when your backend is ready.
 *
 * Local mode: AsyncStorage (works offline, no server).
 * Remote mode: REST API at API_BASE_URL (token auth).
 */

export const AppConfig = {
  /** App display name */
  name: 'Calm Work',
  version: '1.1.0',
  tagline: 'Stay focused. Work calmly.',

  /**
   * When true, auth + data go through services/api (HTTP).
   * When false, everything stays on-device (current default).
   */
  USE_REMOTE_API: false,

  /**
   * Backend base URL — set via EXPO_PUBLIC_API_URL or edit here.
   * Example: https://api.calmwork.app/v1
   */
  API_BASE_URL:
    (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_URL) ||
    'https://api.calmwork.app/v1',

  /** Request timeout (ms) */
  API_TIMEOUT_MS: 15000,

  /** Storage keys */
  storage: {
    users: '@calmwork_users',
    session: '@calmwork_session',
    token: '@calmwork_token',
    dataPrefix: '@calmwork_data_',
    theme: '@calmwork_theme',
    onboardingDone: '@calmwork_onboarding_done',
  },
} as const;

export type ThemePreference = 'light' | 'dark' | 'system';
