import { z } from 'zod'
import { UserLimitCreatedPayloadSchema, UserLimitProgressChangedPayloadSchema, UserLimitResetPayloadSchema } from '../services/validation/schema-validation'

export type UserLimitCreatedPayloadType = z.infer<typeof UserLimitCreatedPayloadSchema>

export type UserLimitProgressChangedPayloadType = z.infer<typeof UserLimitProgressChangedPayloadSchema>

export type UserLimitResetPayloadType = z.infer<typeof UserLimitResetPayloadSchema>

export type UserLimitPayloadType = UserLimitCreatedPayloadType | UserLimitProgressChangedPayloadType | UserLimitResetPayloadType
