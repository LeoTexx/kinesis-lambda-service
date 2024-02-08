import { KinesisStreamEvent, KinesisStreamHandler } from 'aws-lambda'
import { AWSKinesisClient, AWSKinesisClientConfig } from './clients/aws-kinesis'
import { createUserLimitDynamoDBRepository } from './infra/database/dynamodb/user-limit-dynamodb-repository'
import { UserLimitInMemoryDBRepository } from './infra/database/inmemory/user-limit-inmemorydb-repository'
import { UserLimitEventHandlerService } from './services/event-handlers/user-limit-event-handler-service'
import config from './config'
import { Log } from './infra/shared/logger'
import { UserLimitKinesisEvent } from './types/events'

const logger = new Log('App')

const awsKinesisConfig: AWSKinesisClientConfig = {
	region: config.aws.region,
	credentials: {
		accessKeyId: config.aws.accessKeyId,
		secretAccessKey: config.aws.secretAccessKey,
	},
	endpoint: config.aws.kinesisEndpoint,
}

const kinesisClient = new AWSKinesisClient(awsKinesisConfig, config.streamName, logger)

const userLimitRepository = process.env.USE_DYNAMO_DB === 'true' ? createUserLimitDynamoDBRepository() : new UserLimitInMemoryDBRepository()

const eventHandlerService = new UserLimitEventHandlerService(userLimitRepository, kinesisClient)

export const handler: KinesisStreamHandler = async (event: KinesisStreamEvent) => {
	logger.info(`Processing ${event.Records.length} records from Kinesis.`)

	for (const record of event.Records) {
		try {
			const payload = Buffer.from(record.kinesis.data, 'base64').toString('utf-8')
			const eventData = JSON.parse(payload) as UserLimitKinesisEvent

			logger.info(`Event Processed: ${eventData.eventId}`)
			await eventHandlerService.handleEvent(eventData.data, eventData.type)
		} catch (error) {
			logger.error(`Error processing record: ${error}`)
		}
	}
}
