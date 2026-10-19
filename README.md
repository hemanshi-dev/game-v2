# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
# PlayRush game platform

## Production deployment

Build and upload the contents of `dist/` to the directory served at
`/react_project/game/v2/`:

```bash
npm ci
npm run build
```

This application uses React Router. Nginx must return this application's
`index.html` for routes such as `/react_project/game/v2/game/:id`; otherwise a
browser refresh will be handled by the server and may return a 404 or another
application. Install the location rules from `deploy/nginx-game-v2.conf` in the
relevant Nginx `server` block, verify them, and reload Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

After deployment, both the app root and a game URL should return the same Vite
entry document. JavaScript then renders the requested game route.
