export class UserLimitProgressChangedEvent {
	readonly eventType = 'USER_LIMIT_PROGRESS_CHANGED'
	constructor(
		public readonly userLimitId: string,
		public readonly oldProgress: number,
		public readonly newProgress: number
	) {}
}
