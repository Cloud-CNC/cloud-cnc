/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Licenses path
   */
  readonly LICENSES_PATH?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}