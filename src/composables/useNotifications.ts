import Notification from '@/common/Notification.vue'

import { TYPE, useToast } from 'vue-toastification'
import { TranslateOptions, useI18n } from 'vue-i18n'
import { NotificationObjectPayload } from '@/types'
import { Bus } from '@/helpers'
import { isObject } from 'lodash-es'

export const useNotifications = (): void => {
  const toast = useToast()
  const { t } = useI18n({ useScope: 'global' })

  Bus.on(Bus.eventList.success, payload => showToast(TYPE.SUCCESS, payload))
  Bus.on(Bus.eventList.warning, payload => showToast(TYPE.WARNING, payload))
  Bus.on(Bus.eventList.error, payload => showToast(TYPE.ERROR, payload))
  Bus.on(Bus.eventList.info, payload => showToast(TYPE.INFO, payload))
  Bus.on(Bus.eventList.default, payload => showToast(TYPE.DEFAULT, payload))

  const showToast = (
    messageType = TYPE.DEFAULT as TYPE,
    payload?: string | NotificationObjectPayload | unknown,
  ): void => {
    let title = ''
    let message = ''
    let iconName = ''

    if (isObject(payload)) {
      const msgPayload = payload as NotificationObjectPayload

      title = msgPayload.titleId ? t(msgPayload.titleId as string) : ''
      message = t(
        msgPayload.messageId,
        { ...msgPayload.messageArgs as TranslateOptions },
      )
      iconName = msgPayload.iconName ? msgPayload.iconName as string : ''
    } else if (payload) {
      message = t(payload as string)
    } else {
      message = t(`notification.default-message-${messageType}`)
    }

    if (!title) {
      title = t(`notification.default-title-${messageType}`)
    }

    toast({
      component: Notification,
      props: {
        ...(title && { title }),
        message,
        ...(iconName && { iconName }),
      },
    }, {
      icon: false,
      type: messageType,
    })
  }
}

export * from 'vue-toastification'
