import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { ConfigurationStore } from '$houdini'

export const _houdini_load = [new ConfigurationStore()]

dayjs.extend(duration)
dayjs.extend(localizedFormat)
