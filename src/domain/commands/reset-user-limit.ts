import { UserLimitRepositoryInterface } from '../../infra/database/user-limit-repository-interface'
import { Log } from '../../infra/shared/logger'
import { validateSchema } from '../../services/validation/schema-validation'
import { InvalidUserResetPayloadError } from '../../types/errors'
import { UserLimitEventType } from '../../types/events'
import { UserLimitResetPayloadType } from '../../types/payloads'

export class ResetUserLimit {
	private log: Log

	constructor(private repository: UserLimitRepositoryInterface) {
		this.log = new Log(this.constructor.name)
	}

	async execute(payload: UserLimitResetPayloadType): Promise<void> {
		if (!validateSchema<UserLimitResetPayloadType>(payload, UserLimitEventType.USER_LIMIT_RESET)) {
			this.log.error('Invalid UserLimitReset payload')
			throw new InvalidUserResetPayloadError('Invalid UserLimitReset payload')
		}
		await this.repository.update(payload)
	}
}
