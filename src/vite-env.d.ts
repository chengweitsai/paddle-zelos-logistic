/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEFAULT_SPREADSHEET_ID: string;
  readonly VITE_DEFAULT_SHEET_GID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
