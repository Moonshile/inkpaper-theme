/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module 'virtual:inkpaper-config' {
  import type { InkpaperConfig } from '@inkpaper/astro'
  const config: Required<InkpaperConfig>
  export default config
}
