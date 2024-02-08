import { UserLimit } from '../../../domain/models/user-limit'
import { InsufficientAmountLeft, UserLimitDoesNotExist } from '../../../types/errors'
import { UserLimitCreatedPayloadType, UserLimitProgressChangedPayloadType, UserLimitResetPayloadType } from '../../../types/payloads'
import { Log } from '../../shared/logger'
import { UserLimitRepositoryInterface } from '../user-limit-repository-interface'

export class UserLimitInMemoryDBRepository implements UserLimitRepositoryInterface {
	private userLimits?: Map<string, UserLimit>
	private log: Log

	constructor(eventId?: string) {
		this.userLimits = new Map<string, UserLimit>()
		this.log = new Log(this.constructor.name, eventId)
	}

	async get(id: string): Promise<UserLimit> {
		this.log.info(`Getting user limit: ${id}`)
		return this.userLimits.get(id)
	}

	async save(payload: UserLimitCreatedPayloadType) {
		this.log.info(`Saving user limit: ${payload.userLimitId}`)
		this.userLimits.set(payload.userLimitId, payload as UserLimit)
		return this.get(payload.userLimitId)
	}

	async update(payload: UserLimitProgressChangedPayloadType) {
		const existingUserLimit = await this.get(payload.userLimitId)

		if (!existingUserLimit) {
			throw new UserLimitDoesNotExist(`Limit: ${payload.userLimitId}, does not exist in the database`)
		}

		this.log.info(`Updating user limit progress: ${payload.userLimitId}`)
		const newAmount = Number(existingUserLimit.value) - Number(payload.amount ?? 0)

		if (newAmount < 0) {
			throw new InsufficientAmountLeft(`Insufficient amount left in limit: ${payload.userLimitId}`)
		}

		existingUserLimit.progress = newAmount.toString()
		this.userLimits.set(payload.userLimitId, existingUserLimit)
		return this.get(payload.userLimitId)
	}

	async reset(payload: UserLimitResetPayloadType) {
		const existingUserLimit = await this.get(payload.userLimitId)

		if (!existingUserLimit) {
			throw new UserLimitDoesNotExist(`Limit: ${payload.userLimitId}, does not exist in the database`)
		}

		this.log.info(`Resetting user limit: ${payload.userLimitId}`)
		existingUserLimit.progress = payload.resetAmount
		existingUserLimit.nextResetTime = payload.nextResetTime

		this.userLimits.set(payload.userLimitId, existingUserLimit)
		return this.get(payload.userLimitId)
	}
}
