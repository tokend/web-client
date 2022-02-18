import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faTimes,
  faCheck,
  faExclamationCircle,
  faFolderOpen,
} from '@fortawesome/free-solid-svg-icons'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
library.add(faTimes, faCheck, faExclamationCircle, faFolderOpen)

export enum ICON_NAMES {
  faCheck = '["fa","check"]',
  faTimes = '["fa","times"]',
  faExclamationCircle = '["fa","exclamation-circle"]',
  faFolderOpen = '["fa","folder-open"]',
  vue = 'vue'
}
