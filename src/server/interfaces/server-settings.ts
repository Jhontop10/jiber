import { Reducer } from '../../core/index'
import LogInRequestHandler from './log-in-request-handler'
import Storage from './storage'

export interface ServerSettings {
  socketPort: number,
  stunPort: number,
  reducer: Reducer,
  onLogIn: LogInRequestHandler,
  storage: Storage,
  rateLimitPeriodMs: number
  rateLimit: number,
  maxMessageCharLength: number
}
