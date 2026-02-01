import type { NitroApp } from 'nitropack'

export default (nitroApp: NitroApp) => {
  nitroApp.hooks.hook('feedme:handle:content:item', ({ item }) => {
    const siteUrl = useRuntimeConfig()?.siteUrl
    const itemData = item.get()

    if (siteUrl && itemData.link) {
      itemData.link = siteUrl + itemData.link
      item.set(itemData)
    }
  })
}
