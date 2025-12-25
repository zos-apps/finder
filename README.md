# 📁 Finder

[![Version](https://img.shields.io/badge/version-4.2.0-blue.svg)](https://github.com/zos-apps/finder/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Docs](https://img.shields.io/badge/docs-online-purple.svg)](https://zos-apps.github.io/finder)

> File manager with sidebar navigation and quick look

**[Documentation](https://zos-apps.github.io/finder)** • **[App Store](https://zos-apps.github.io/app-store)** • **[All Apps](https://github.com/zos-apps)**

## Installation

```bash
npm install github:zos-apps/finder
```

Or install via the [zOS App Store](https://zos-apps.github.io/app-store).

## Usage

```tsx
import Finder from '@zos-apps/finder';

function App() {
  return <Finder />;
}
```

## Features

- Native zOS window integration
- Dark mode support
- Keyboard shortcuts (`Cmd+F`)
- Context menu actions
- Menu bar integration

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+F` | Open Finder |

## Context Menu

Right-click the app icon for:
- **Open** - Launch the app
- **Open in New Window** - Open a new instance
- **Get Info** - View app details
- **Show in Finder** - Locate app files

## Menu Bar

When active, adds menus: Finder, File, Edit, View, Window, Help

## Permissions

- `filesystem`

## Links

- [Documentation](https://zos-apps.github.io/finder)
- [GitHub Repository](https://github.com/zos-apps/finder)
- [Report Issues](https://github.com/zos-apps/finder/issues)
- [All zOS Apps](https://github.com/zos-apps)

## License

MIT © [Hanzo AI](https://hanzo.ai)
