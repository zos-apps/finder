# 📁 Finder

> File manager with sidebar navigation and quick look

Part of the [zOS Apps](https://github.com/zos-apps) ecosystem.

## Installation

```bash
npm install github:zos-apps/finder
```

## Usage

```tsx
import App from '@zos-apps/finder';

function MyApp() {
  return <App />;
}
```

## Package Spec

App metadata is defined in `package.json` under the `zos` field:

```json
{
  "zos": {
    "id": "ai.hanzo.finder",
    "name": "Finder",
    "icon": "📁",
    "category": "system",
    "permissions": ["filesystem"],
    "installable": true
  }
}
```

## Version

v4.2.0

## License

MIT © Hanzo AI
