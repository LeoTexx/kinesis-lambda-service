import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb'
import { UserLimitRepositoryInterface } from '../user-limit-repository-interface'
import { UserLimit } from '../../../domain/models/user-limit'
import { UserLimitCreatedPayloadType, UserLimitProgressChangedPayloadType, UserLimitResetPayloadType } from '../../../types/payloads'
import config from '../../../config'
import { InsufficientAmountLeft, UserLimitDoesNotExist } from '../../../types/errors'

interface DynamoDBConfig {
	region: string
	accessKeyId: string
	secretAccessKey: string
	dynamoDBEndpoint?: string
	userLimitsTable: string
}

class UserLimitDynamoDBRepository implements UserLimitRepositoryInterface {
	private client: DynamoDBDocumentClient
	private userLimitsTable: string

	constructor(dynamoDBConfig: DynamoDBConfig) {
		const dbClient = new DynamoDBClient({
			region: dynamoDBConfig.region,
			credentials: {
				accessKeyId: dynamoDBConfig.accessKeyId,
				secretAccessKey: dynamoDBConfig.secretAccessKey,
			},
			endpoint: dynamoDBConfig.dynamoDBEndpoint,
		})
		this.client = DynamoDBDocumentClient.from(dbClient)
		this.userLimitsTable = dynamoDBConfig.userLimitsTable
	}

	async save(payload: UserLimitCreatedPayloadType): Promise<UserLimit> {
		await this.client.send(
			new PutCommand({
				TableName: this.userLimitsTable,
				Item: payload,
			})
		)
		return this.get(payload.userLimitId)
	}

	async get(id: string): Promise<UserLimit> {
		const result = await this.client.send(
			new GetCommand({
				TableName: this.userLimitsTable,
				Key: { userLimitId: id },
			})
		)

		if (!result.Item) throw new UserLimitDoesNotExist(`UserLimit with ID ${id} does not exist.`)
		return result.Item as UserLimit
	}

	async update(payload: UserLimitProgressChangedPayloadType): Promise<UserLimit> {
		const existingUserLimit: UserLimit = await this.get(payload.userLimitId)

		const newAmount = Number(existingUserLimit.value) - Number(payload.amount ?? 0)
		if (newAmount < 0) throw new InsufficientAmountLeft('Insufficient amount left in limit.')

		existingUserLimit.progress = newAmount.toString()

		await this.client.send(
			new UpdateCommand({
				TableName: this.userLimitsTable,
				Key: { userLimitId: payload.userLimitId },
				UpdateExpression: 'set #progress = :progress',
				ExpressionAttributeNames: { '#progress': 'progress' },
				ExpressionAttributeValues: { ':progress': existingUserLimit.progress },
			})
		)
		return this.get(payload.userLimitId)
	}

	async reset(payload: UserLimitResetPayloadType): Promise<UserLimit> {
		const existingUserLimit: UserLimit = await this.get(payload.userLimitId)

		existingUserLimit.progress = payload.resetAmount
		existingUserLimit.nextResetTime = payload.nextResetTime

		await this.client.send(
			new UpdateCommand({
				TableName: this.userLimitsTable,
				Key: { userLimitId: payload.userLimitId },
				UpdateExpression: 'set #progress = :progress, #nextResetTime = :nextResetTime',
				ExpressionAttributeNames: {
					'#progress': 'progress',
					'#nextResetTime': 'nextResetTime',
				},
				ExpressionAttributeValues: {
					':progress': existingUserLimit.progress,
					':nextResetTime': existingUserLimit.nextResetTime,
				},
			})
		)
		return this.get(payload.userLimitId)
	}
}

export function createUserLimitDynamoDBRepository(): UserLimitRepositoryInterface {
	return new UserLimitDynamoDBRepository({
		region: config.aws.region,
		accessKeyId: config.aws.accessKeyId,
		secretAccessKey: config.aws.secretAccessKey,
		dynamoDBEndpoint: config.aws.dynamoDBEndpoint,
		userLimitsTable: config.dynamoDB.userLimitsTable,
	})
}
