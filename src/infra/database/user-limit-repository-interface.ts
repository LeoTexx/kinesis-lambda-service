import { UserLimit } from '../../domain/models/user-limit'
import { UserLimitCreatedPayloadType, UserLimitProgressChangedPayloadType, UserLimitResetPayloadType } from '../../types/payloads'

export interface UserLimitRepositoryInterface {
	save(payload: UserLimitCreatedPayloadType): Promise<UserLimit>
	update(payload: UserLimitProgressChangedPayloadType): Promise<UserLimit>
	reset(payload: UserLimitResetPayloadType): Promise<UserLimit>
	get(key: string): Promise<UserLimit>
}
