import { formatInTimeZone } from 'date-fns-tz'

export const formatInDisplayTimeZone = (date: Date | string | number, format: string): string => {
  const runtimeConfig = useRuntimeConfig()

  return formatInTimeZone(date, runtimeConfig.public.displayTimeZone || 'UTC', format)
}
