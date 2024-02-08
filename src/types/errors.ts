export class NoDatabaseInitializedError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'NoDatabaseInitializedError'
	}
}

export class InvalidUserCreatedPayloadError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'InvalidUserCreatedPayloadError'
	}
}

export class InvalidUserProgressChangedPayloadError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'InvalidUserProgressChangedPayloadError'
	}
}

export class InvalidUserResetPayloadError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'InvalidUserResetPayloadError'
	}
}

export class UserLimitAlreadyExists extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'UserLimitAlreadyExists'
	}
}

export class UserLimitDoesNotExist extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'UserLimitDoesNotExist'
	}
}

export class UnknownTypeError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'UnknownTypeError'
	}
}

export class InvalidEventTypeError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'InvalidEventTypeError'
	}
}

export class InsufficientAmountLeft extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'InsufficientAmountLeft'
	}
}
