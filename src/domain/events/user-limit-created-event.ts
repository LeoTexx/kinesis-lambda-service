import { UserLimit } from '../models/user-limit'

export class UserLimitCreatedEvent {
	readonly eventType = 'USER_LIMIT_CREATED'
	constructor(public readonly userLimit: UserLimit) {}
}
