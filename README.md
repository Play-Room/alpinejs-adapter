# @play-room/alpinejs-adapter

Alpine.js adapter plugin for [@play-room/core](https://github.com/Play-Room/core) — Exposes all PlayRoom APIs and configuration as Alpine magic helpers.

## Installation

```bash
npm install alpinejs @play-room/core @play-room/alpinejs-adapter
```

## Usage

### Via Module Bundle

```js
import Alpine from 'alpinejs'
import playRoomPlugin from '@play-room/alpinejs-adapter'

Alpine.plugin(playRoomPlugin)
window.Alpine = Alpine
Alpine.start()
```

### Via Script Tag

Include the adapter script **before** Alpine:

```html
<script src="/js/playroom-adapter.js" defer></script>
<script src="/js/alpine.js" defer></script>
```

Inside your adapter file (`playroom-adapter.js`):

```js
document.addEventListener('alpine:init', () => {
    Alpine.plugin(window.playRoomPlugin)
})
```

## Magic Helpers

### `$playroom(options?)`

Create a new PlayRoom instance with optional configuration.

```html
<div x-data="{ room: $playroom() }">
    <!-- PlayRoom instance available as room -->
</div>
```

With custom options:

```html
<div x-data="{
    room: $playroom({
        locale: 'sr',
        theme: 'dark',
        showLocaleSwitcher: true,
        showThemeSwitcher: true
    })
}">
    <!-- Custom configured PlayRoom -->
</div>
```

### PlayRoom Instance API

Once created, the `$playroom()` instance exposes all PlayRoom methods:

#### Locale Management

```html
<div x-data="{ room: $playroom() }">
    <!-- Get current locale -->
    <span x-text="room.getLocale()"></span>
    
    <!-- Set locale -->
    <button @click="room.setLocale('sr')">Serbian</button>
    <button @click="room.setLocale('en')">English</button>
    
    <!-- Subscribe to locale changes -->
    <div x-init="room.subscribeLocale(locale => console.log('Locale:', locale))"></div>
</div>
```

#### Theme Management

```html
<div x-data="{ room: $playroom() }">
    <!-- Get current theme -->
    <span x-text="room.getTheme()"></span>
    
    <!-- Set theme -->
    <button @click="room.setTheme('light')">Light</button>
    <button @click="room.setTheme('dark')">Dark</button>
    
    <!-- Subscribe to theme changes -->
    <div x-init="room.subscribeTheme(theme => console.log('Theme:', theme))"></div>
</div>
```

#### Register Default Games

```html
<div x-data="{ room: $playroom() }" x-init="
    room.registerDefaultGames({
        config: {
            quizz: {
                limit: 10,
                name: 'My Custom Quizz'
            }
        }
    })
">
    <!-- Games registered with defaults and custom overrides -->
</div>
```

#### Render Game Picker

```html
<div x-data="{ room: $playroom() }">
    <div id="game-browser" x-init="room.renderGamePicker($el)"></div>
</div>
```

#### Launch Game

```html
<div x-data="{ 
    room: $playroom(),
    async launchQuizz() {
        const session = await this.room.launchGame('quizz', {
            mode: 'modal'
        })
        console.log('Game launched:', session.gameId)
    }
}">
    <button @click="launchQuizz()">Play Quizz</button>
</div>
```

### `$playRoomDefaults`

Access the default PlayRoom configuration options.

```html
<div x-data="{ 
    defaults: $playRoomDefaults,
    options: {
        ...this.$playRoomDefaults,
        theme: 'dark'
    }
}">
    <!-- Use as reference or merge with custom options -->
</div>
```

## Complete Example

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PlayRoom with Alpine</title>
</head>
<body>
    <div x-data="{
        room: $playroom(),
        currentLocale: 'en',
        currentTheme: 'light',
        init() {
            // Register default games with custom overrides
            this.room.registerDefaultGames({
                config: {
                    quizz: {
                        limit: 5,
                        leaderboardLimit: 20
                    }
                }
            })
            
            // Subscribe to changes
            this.room.subscribeLocale(locale => {
                this.currentLocale = locale
            })
            
            this.room.subscribeTheme(theme => {
                this.currentTheme = theme
            })
        }
    }">
        <!-- Header with controls -->
        <header>
            <h1>PlayRoom</h1>
            <div>
                <button @click="room.setLocale('en')">English</button>
                <button @click="room.setLocale('sr')">Српски</button>
                <button @click="room.setTheme(currentTheme === 'light' ? 'dark' : 'light')">
                    <span x-text="currentTheme === 'light' ? 'Dark Mode' : 'Light Mode'"></span>
                </button>
            </div>
        </header>

        <!-- Game browser container -->
        <main id="playroom-browser" x-init="room.renderGamePicker($el)"></main>
    </div>

    <script src="/js/alpine.js" defer></script>
    <script type="module">
        import Alpine from 'alpinejs'
        import playRoomPlugin from '@play-room/alpinejs-adapter'
        
        Alpine.plugin(playRoomPlugin)
        window.Alpine = Alpine
        Alpine.start()
    </script>
</body>
</html>
```

## Types

The adapter exports TypeScript types for full IDE support:

```ts
import {
    PlayRoomInstance,
    PlayRoomOptions,
    RegisterDefaultGamesOptions,
    GameRegistration,
    LaunchGameOptions,
    GameSession
} from '@play-room/alpinejs-adapter'
```

## Configuration Options

All PlayRoom configuration options are available when creating an instance:

```ts
interface PlayRoomOptions {
    // UI Adapter
    uiAdapter?: HubUiAdapter
    
    // Launcher mode
    browserStartMode?: 'inline' | 'modal'
    launcher?: PlayRoomFloatingLauncherConfig
    
    // Persistence
    persistence?: PlayRoomUiPersistenceConfig
    
    // Modal configuration
    draggableModal?: boolean
    resizableModal?: ResizableModalConfig
    
    // Localization
    locale?: string
    localeOptions?: PlayRoomLocaleOption[]
    localeMessages?: PlayRoomLocaleMessages
    showLocaleSwitcher?: boolean
    onLocaleChange?: (locale: string) => void
    
    // Theme
    theme?: 'light' | 'dark'
    showThemeSwitcher?: boolean
    onThemeChange?: (theme: 'light' | 'dark') => void
    themeColors?: PlayRoomThemeColors
}
```

## Registering Custom Games

```html
<div x-data="{
    room: $playroom(),
    registerCustomGame() {
        this.room.registerGame({
            game: {
                id: 'my-game',
                name: 'My Custom Game',
                createInstance: async () => ({
                    mount: (container) => {
                        container.innerHTML = '<h1>My Game</h1>'
                    }
                })
            }
        })
    }
}">
    <button @click="registerCustomGame()">Register Game</button>
</div>
```

## License

MIT
