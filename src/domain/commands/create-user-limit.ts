import { UserLimitRepositoryInterface } from '../../infra/database/user-limit-repository-interface'
import { UserLimitCreatedPayloadType } from '../../types/payloads'
import { validateSchema } from '../../services/validation/schema-validation'
import { UserLimitEventType } from '../../types/events'
import { Log } from '../../infra/shared/logger'
import { InvalidUserCreatedPayloadError } from '../../types/errors'

export class CreateUserLimit {
	private log: Log

	constructor(private repository: UserLimitRepositoryInterface) {
		this.log = new Log(this.constructor.name)
	}

	async execute(payload: UserLimitCreatedPayloadType): Promise<void> {
		if (!validateSchema<UserLimitCreatedPayloadType>(payload, UserLimitEventType.USER_LIMIT_CREATED)) {
			this.log.error('Invalid UserLimitCreated payload')
			throw new InvalidUserCreatedPayloadError('Invalid UserLimitCreated payload')
		}

		await this.repository.save(payload)
	}
}
