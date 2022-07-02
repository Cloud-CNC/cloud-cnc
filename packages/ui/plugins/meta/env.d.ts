/// <reference types="vite/client" />

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