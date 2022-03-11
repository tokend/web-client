import mitt, { Emitter, EventType } from 'mitt'
import { NotificationObjectPayload } from '@/types'

enum EVENTS {
  error = 'error',
  warning = 'warning',
  success = 'success',
  info = 'info',
  default = 'default',
}

export class EventBus {
  private emitter: Emitter<Record<EventType, unknown>>

  constructor() {
    this.emitter = mitt<Record<EventType, unknown>>()
  }

  public get eventList(): Readonly<typeof EVENTS> {
    return EVENTS
  }

  on(eventName: EventType, handlerFn: (payload: unknown) => void): void {
    this.emitter.on(eventName, handlerFn)
  }

  emit(eventName: EventType, payload?: unknown): void {
    this.emitter.emit(eventName, payload)
  }

  success(payload: string | NotificationObjectPayload): void {
    this.emit(this.eventList.success, payload)
  }

  error(payload: string | NotificationObjectPayload): void {
    this.emit(this.eventList.error, payload)
  }

  warning(payload: string | NotificationObjectPayload): void {
    this.emit(this.eventList.warning, payload)
  }

  info(payload: string | NotificationObjectPayload): void {
    this.emit(this.eventList.info, payload)
  }
}

export const Bus = new EventBus()
