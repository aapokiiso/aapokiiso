import { useNuxt } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'

export const hasInstalledNuxtModule = (moduleName: string, nuxt: Nuxt = useNuxt()): boolean =>
  nuxt.options._installedModules.some(({ meta }) => meta.name === moduleName)
