import { Kinesis, PutRecordCommand, PutRecordCommandInput } from '@aws-sdk/client-kinesis'
import { Log } from '../infra/shared/logger'

interface AWSKinesisClientConfig {
	endpoint?: string
	region: string
	credentials: {
		accessKeyId: string
		secretAccessKey: string
	}
}

class AWSKinesisClient {
	private kinesis: Kinesis
	private streamName: string

	/**
	 * Constructs an instance of AWSKinesisClient.
	 *
	 * @param config The AWS Kinesis client configuration.
	 * @param streamName The name of the Kinesis stream.
	 * @param logger An instance of Log for logging.
	 */
	constructor(
		config: AWSKinesisClientConfig,
		streamName: string,
		private logger: Log
	) {
		this.kinesis = new Kinesis({
			endpoint: config.endpoint,
			region: config.region,
			credentials: config.credentials,
		})
		this.streamName = streamName
	}

	/**
	 * Publishes an event to the specified Kinesis stream.
	 *
	 * @param eventData The event data to be published.
	 * @param partitionKey A partition key for the event (default is "partition-key").
	 */
	async publishEvent(eventData: any, partitionKey: string = 'partition-key'): Promise<void> {
		const params: PutRecordCommandInput = {
			StreamName: this.streamName,
			Data: Buffer.from(JSON.stringify(eventData)),
			PartitionKey: partitionKey,
		}

		try {
			await this.kinesis.send(new PutRecordCommand(params))
			this.logger.info('Event published successfully to Kinesis stream.')
		} catch (error) {
			this.logger.error(`Failed to publish event to Kinesis: ${error}`)
		}
	}
}

export { AWSKinesisClient, AWSKinesisClientConfig }
