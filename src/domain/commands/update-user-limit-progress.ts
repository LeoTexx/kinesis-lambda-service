import { UserLimitRepositoryInterface } from '../../infra/database/user-limit-repository-interface'
import { Log } from '../../infra/shared/logger'
import { validateSchema } from '../../services/validation/schema-validation'
import { InvalidUserProgressChangedPayloadError } from '../../types/errors'
import { UserLimitEventType } from '../../types/events'
import { UserLimitProgressChangedPayloadType } from '../../types/payloads'

export class UpdateUserLimitProgress {
	private log: Log

	constructor(private repository: UserLimitRepositoryInterface) {
		this.log = new Log(this.constructor.name)
	}
	async execute(payload: UserLimitProgressChangedPayloadType): Promise<void> {
		if (!validateSchema<UserLimitProgressChangedPayloadType>(payload, UserLimitEventType.USER_LIMIT_PROGRESS_CHANGED)) {
			this.log.error('Invalid UserLimitProgressChanged event')
			throw new InvalidUserProgressChangedPayloadError('Invalid UserLimitProgressChanged event')
		}

		await this.repository.update(payload)
	}
}
