import Alpine from 'alpinejs';
import {
  PlayRoom,
  registerDefaultGames,
  type PlayRoomOptions,
  type RegisterDefaultGamesOptions,
  type GameRegistration,
  type LaunchGameOptions,
  type GameSession
} from '@play-room/core';

export interface PlayRoomInstance {
  room: PlayRoom;
  getLocale(): string;
  setLocale(locale: string): void;
  subscribeLocale(listener: (locale: string) => void): () => void;
  getTheme(): 'light' | 'dark';
  setTheme(theme: 'light' | 'dark'): void;
  subscribeTheme(listener: (theme: 'light' | 'dark') => void): () => void;
  registerGame(registration: GameRegistration): PlayRoom;
  registerGames(registrations: GameRegistration[]): PlayRoom;
  renderGamePicker(container: HTMLElement): void;
  launchGame(gameId: string, options?: LaunchGameOptions): Promise<GameSession>;
  registerDefaultGames(options?: RegisterDefaultGamesOptions): void;
}

declare global {
  interface Window {
    PlayRoom: typeof PlayRoom;
  }
}

export default function playRoomPlugin(Alpine: any) {
  /**
   * $playroom(options?) - Create and get a new PlayRoom instance
   * Usage: x-data="{ room: $playroom() }"
   * Usage: @click="$playroom().setLocale('sr')"
   */
  Alpine.magic('playroom', () => (options?: PlayRoomOptions): PlayRoomInstance => {
    const room = new PlayRoom(options);

    return {
      room,
      getLocale: () => room.getLocale(),
      setLocale: (locale: string) => room.setLocale(locale),
      subscribeLocale: (listener: (locale: string) => void) => room.subscribeLocale(listener),
      getTheme: () => room.getTheme(),
      setTheme: (theme: 'light' | 'dark') => room.setTheme(theme),
      subscribeTheme: (listener: (theme: 'light' | 'dark') => void) => room.subscribeTheme(listener),
      registerGame: (registration: GameRegistration) => room.registerGame(registration),
      registerGames: (registrations: GameRegistration[]) => room.registerGames(registrations),
      renderGamePicker: (container: HTMLElement) => room.renderGamePicker(container),
      launchGame: (gameId: string, options?: LaunchGameOptions) => room.launchGame(gameId, options),
      registerDefaultGames: (options?: RegisterDefaultGamesOptions) => registerDefaultGames(room, options)
    };
  });

  /**
   * $playRoomOptions() - Get default PlayRoom options
   * Useful for merging with custom options
   */
  Alpine.magic('playRoomDefaults', () => {
    return {
      browserStartMode: 'modal' as const,
      launcher: {
        mode: 'floating' as const,
        position: 'bottom-right' as const,
        panelWidth: 'min(520px, calc(100vw - 2rem))',
        panelHeight: 'min(78vh, 760px)',
        startOpen: false
      },
      persistence: {
        enabled: true,
        storageKey: 'playroom:floating-demo'
      },
      resizableModal: {
        enabled: true,
        size: {
          width: {
            min: '420px',
            base: 'min(940px, 96vw)',
            max: '98vw'
          },
          height: {
            min: '320px',
            base: '80vh',
            max: '96vh'
          }
        }
      },
      localeOptions: [
        { value: 'en', label: 'English' },
        { value: 'sr', label: 'Српски' }
      ],
      locale: 'en' as const,
      theme: 'light' as const,
      showLocaleSwitcher: true,
      showThemeSwitcher: true,
      themeColors: {
        primary: '#0f766e',
        secondary: '#475569'
      }
    };
  });

  /**
   * Export PlayRoom globally for direct access if needed
   */
  window.PlayRoom = PlayRoom;
}

export { PlayRoom, registerDefaultGames };
export type {
  PlayRoomOptions,
  RegisterDefaultGamesOptions,
  GameRegistration,
  LaunchGameOptions,
  GameSession
};
