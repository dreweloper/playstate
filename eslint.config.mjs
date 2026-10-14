import js from '@eslint/js';
import prettier from 'eslint-config-prettier/flat';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

const reactBoundaryMessages = {
  core: 'Only `import type` from @playstate/core is allowed in react (ADR-0005).',
  server: 'react must never import from @playstate/server (ADR-0005).',
};

export default defineConfig(
  globalIgnores(['**/dist/', '**/coverage/']),

  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },

  js.configs.recommended,

  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    extends: [tseslint.configs.strictTypeChecked, tseslint.configs.stylisticTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // CONVENTIONS §5
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      'no-restricted-exports': [
        'error',
        {
          restrictDefaultExports: {
            direct: true,
            named: true,
            defaultFrom: true,
            namedFrom: true,
            namespaceFrom: true,
          },
        },
      ],
      // With verbatimModuleSyntax, `import { type X }` leaves an empty runtime import that still
      // loads the module (e.g. `core` from `react`, which ADR-0005 forbids).
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-import-type-side-effects': 'error',
      // Both `type` and `interface` are accepted; the data model (ARCHITECTURE §5) uses `type`.
      '@typescript-eslint/consistent-type-definitions': 'off',
    },
  },

  // ADR-0005: secrets and server logic must never reach the browser bundle.
  {
    files: ['packages/react/**/*.{ts,tsx,mts,cts}'],
    rules: {
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@playstate/core',
              allowTypeImports: true,
              message: reactBoundaryMessages.core,
            },
            { name: '@playstate/server', message: reactBoundaryMessages.server },
          ],
          patterns: [
            {
              group: ['@playstate/core/*'],
              allowTypeImports: true,
              message: reactBoundaryMessages.core,
            },
            { group: ['@playstate/server/*'], message: reactBoundaryMessages.server },
          ],
        },
      ],
      // no-restricted-imports does not see dynamic imports, which always load code at runtime.
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ImportExpression[source.value=/^@playstate\\/(core|server)(\\/|$)/]',
          message:
            'react must never load @playstate/core or @playstate/server at runtime (ADR-0005).',
        },
      ],
    },
  },

  // Tools such as ESLint, Prettier and Vitest require a default export from their config file.
  {
    files: ['**/*.config.{js,mjs,ts}'],
    rules: {
      'no-restricted-exports': 'off',
    },
  },

  // These files are not part of any package tsconfig, so they cannot be linted with type information.
  {
    files: ['**/*.{js,mjs}', '**/*.config.ts'],
    extends: [tseslint.configs.disableTypeChecked],
  },

  prettier,
);
