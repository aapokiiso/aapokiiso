import type { ParsedContent } from '@nuxt/content/dist/runtime/types'

export function groupByMonth (content: ParsedContent[]): Record<string, ParsedContent[]> {
  return content
    .reduce((acc: Record<string, ParsedContent[]>, item: ParsedContent) => {
      const day = formatInDisplayTimeZone(item.date, 'yyyy-MM')

      acc[day] = acc[day] ? [...acc[day], item] : [item]

      return acc
    }, {})
}
