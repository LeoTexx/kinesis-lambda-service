import { UserLimitPayloadType } from './payloads'
import { UserLimitCreatedPayloadType, UserLimitProgressChangedPayloadType, UserLimitResetPayloadType } from './payloads'

export class UserLimitKinesisEvent {
	aggregateId: string
	context: object
	createdAt: number
	eventId: string
	data: UserLimitPayloadType
	sequenceNumber: number
	source: string
	type: UserLimitEventType
}

export class UserLimitCreatedEvent extends UserLimitKinesisEvent {
	data: UserLimitCreatedPayloadType
}

export class UserLimitProgressChangedEvent extends UserLimitKinesisEvent {
	data: UserLimitProgressChangedPayloadType
}

export class UserLimitResetEvent extends UserLimitKinesisEvent {
	data: UserLimitResetPayloadType
}

export enum UserLimitEventType {
	USER_LIMIT_CREATED = 'USER_LIMIT_CREATED',
	USER_LIMIT_PROGRESS_CHANGED = 'USER_LIMIT_PROGRESS_CHANGED',
	USER_LIMIT_RESET = 'USER_LIMIT_RESET',
}

export function assertEvent(event: any): event is UserLimitKinesisEvent {
	return event.eventId && event.data && event.sequenceNumber && event.source
}
