import mitt, { Emitter, EventType } from 'mitt'

export class EventBus {
  private emitter: Emitter<Record<EventType, unknown>>
  public events = {
    error: 'error',
    warning: 'warning',
    success: 'success',
    info: 'info',
  }

  constructor() {
    this.emitter = mitt<Record<EventType, unknown>>()
  }

  public get eventList (): Readonly<Record<EventType, string>> {
    return this.events
  }

  on (eventName: EventType, handlerFn: ( payload: unknown ) => void): void {
    this.emitter.on(eventName, handlerFn)
  }

  emit (eventName: EventType, payload?: unknown): void {
    this.emitter.emit(eventName, payload)
  }

  success (payload: unknown): void {
    this.emit(this.eventList.success, payload)
  }

  error (payload: unknown): void {
    this.emit(this.eventList.error, payload)
  }

  warning (payload: unknown): void {
    this.emit(this.eventList.warning, payload)
  }

  info (payload: unknown): void {
    this.emit(this.eventList.info, payload)
  }
}

export const Bus = new EventBus()
