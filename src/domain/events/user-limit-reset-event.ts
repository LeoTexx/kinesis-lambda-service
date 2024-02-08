export class UserLimitResetEvent {
	readonly eventType = 'USER_LIMIT_RESET'
	constructor(
		public readonly userLimitId: string,
		public readonly resetValue: number
	) {}
}
