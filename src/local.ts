import { _Record } from '@aws-sdk/client-kinesis'
import { handler } from './app'
import events from '../events.json'

const UserLimitKinesisEvents = []
events.forEach(event => {
	UserLimitKinesisEvents.push({
		kinesis: {
			data: Buffer.from(JSON.stringify(event)).toString('base64'),
		},
	})
})

void handler({ Records: UserLimitKinesisEvents }, null, null)
