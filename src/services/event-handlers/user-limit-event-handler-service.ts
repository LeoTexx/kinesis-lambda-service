import { Log } from '../../infra/shared/logger'
import { UserLimitRepositoryInterface } from '../../infra/database/user-limit-repository-interface'
import { UserLimitEventType } from '../../types/events'
import { CreateUserLimit, UpdateUserLimitProgress, ResetUserLimit } from '../../domain/commands'
import { AWSKinesisClient } from '../../clients/aws-kinesis'
import { UserLimitPayloadType } from '../../types/payloads'

export class UserLimitEventHandlerService {
	private userLimitRepository: UserLimitRepositoryInterface
	private log: Log
	private kinesisClient: AWSKinesisClient

	constructor(userLimitRepository: UserLimitRepositoryInterface, kinesisClient?: AWSKinesisClient, eventId?: string) {
		this.userLimitRepository = userLimitRepository
		this.log = new Log(this.constructor.name, eventId)
		this.kinesisClient = kinesisClient
	}

	async handleEvent(eventData: UserLimitPayloadType, type: UserLimitEventType): Promise<void> {
		if (!eventData || !type) {
			this.log.error(`Invalid event data or type`)
			//await this.publishErrorToKinesis(`Invalid event data or type for eventType: ${type}`, eventData)
			return
		}

		try {
			switch (type) {
				case UserLimitEventType.USER_LIMIT_CREATED: {
					const command = new CreateUserLimit(this.userLimitRepository)
					await command.execute(eventData)
					break
				}
				case UserLimitEventType.USER_LIMIT_PROGRESS_CHANGED: {
					const command = new UpdateUserLimitProgress(this.userLimitRepository)
					await command.execute(eventData)
					break
				}
				case UserLimitEventType.USER_LIMIT_RESET: {
					const command = new ResetUserLimit(this.userLimitRepository)
					await command.execute(eventData)
					break
				}
				default:
					this.log.warn(`Unhandled event type: ${type}`)
			}
		} catch (error) {
			this.log.error(`Error handling event: ${error}`)
			//await this.publishErrorToKinesis(`Error handling event: ${error}`, eventData, type)
		}
	}

	private async publishErrorToKinesis(errorMessage: string, eventData: any, eventType?: UserLimitEventType) {
		const errorPayload = {
			error: errorMessage,
			originalEvent: eventData,
			eventType: eventType,
		}
		await this.kinesisClient.publishEvent(errorPayload, 'errorPartitionKey').catch(publishError => {
			this.log.error(`Failed to publish error to Kinesis: ${publishError}`)
		})
	}
}
