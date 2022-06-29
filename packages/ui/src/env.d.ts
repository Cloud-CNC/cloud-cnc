/// <reference types="vite/client" />
/// <reference types="vitest" />

interface ImportMetaEnv {
  /**
   * Current Git branch name
   */
  readonly GIT_BRANCH: string;

  /**
   * Current Git commit hash
   */
  readonly GIT_COMMIT: string;

  /**
   * Current Git remote URL
   */
  readonly GIT_REMOTE: string;

  /**
   * Application version
   */
  readonly VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type {DefineComponent} from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module '*.yml' {
  const content: unknown;
  export default content;
}