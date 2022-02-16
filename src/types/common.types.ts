import { ICON_NAMES } from '@/enums'

export type NotificationObjectPayload = {
  titleId?: string,
  messageId: string,
  messageArgs: unknown,
  iconName?: typeof ICON_NAMES | unknown,
}
