/**
 * @staticflow/sdk
 * Official TypeScript Client Library
 */

export { StaticFlowClient, type StaticFlowClientOptions, type RequestOptions } from "./client.js";
export { AuthManager, type AuthTokens, type UserSession } from "./auth.js";
export { RealtimeChannel } from "./realtime.js";
export {
  StaticFlowError,
  AuthenticationError,
  PermissionError,
  ValidationError,
  RateLimitError,
} from "./errors.js";

// Factory function
import { StaticFlowClient, StaticFlowClientOptions } from "./client.js";

export function createClient(options?: StaticFlowClientOptions): StaticFlowClient {
  return new StaticFlowClient(options);
}

export default createClient;
