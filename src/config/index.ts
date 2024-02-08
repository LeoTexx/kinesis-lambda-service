import { config as dotenvConfig } from 'dotenv'
import path from 'path'
import { Logger } from '@aws-lambda-powertools/logger'
import { LogLevel } from '@aws-lambda-powertools/logger/lib/types'

const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env'
dotenvConfig({ path: path.resolve(process.cwd(), envFile) })

const criticalLogger = new Logger({
	serviceName: 'ConfigurationLoader',
	logLevel: 'error',
})

interface AppConfig {
	aws: {
		region: string
		accessKeyId: string
		secretAccessKey: string
		kinesisEndpoint?: string
		dynamoDBEndpoint?: string
	}
	dynamoDB: {
		userLimitsTable: string
	}
	streamName: string
	logLevel: LogLevel
}

const config: AppConfig = {
	aws: {
		region: process.env.AWS_REGION || 'eu-west-2',
		accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
		kinesisEndpoint: process.env.KINESIS_ENDPOINT,
	},
	dynamoDB: {
		userLimitsTable: process.env.DYNAMODB_USER_LIMITS_TABLE || 'UserLimits',
	},
	streamName: process.env.STREAM_NAME || 'user-limit-events',
	logLevel: (process.env.LOG_LEVEL || 'info') as LogLevel,
}

const isConfigValid = (config: AppConfig): config is AppConfig => {
	if (!config.aws.accessKeyId || !config.aws.secretAccessKey) {
		criticalLogger.error('Missing required AWS configuration.')
		return false
	}
	return true
}

if (!isConfigValid(config)) {
	throw new Error('Invalid application configuration.')
}

export default config
