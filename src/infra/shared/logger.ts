import { Logger } from '@aws-lambda-powertools/logger'
import config from '../../config'

export class Log {
	private logger: Logger

	constructor(
		serviceName: string,
		private eventId?: string
	) {
		this.logger = new Logger({
			serviceName: serviceName,
			logLevel: config.logLevel,
		})

		if (this.eventId) {
			this.logger.addPersistentLogAttributes({ eventId: this.eventId })
		}
	}

	info(message: string) {
		this.logger.info(message)
	}

	error(message: string) {
		this.logger.error(message)
	}

	warn(message: string) {
		this.logger.warn(message)
	}
}
