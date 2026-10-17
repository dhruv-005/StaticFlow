export class StaticFlowError extends Error {
  public statusCode?: number;
  public details?: unknown;

  constructor(message: string, statusCode?: number, details?: unknown) {
    super(message);
    this.name = "StaticFlowError";
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, StaticFlowError.prototype);
  }
}

export class AuthenticationError extends StaticFlowError {
  constructor(message: string = "Authentication failed or token expired.") {
    super(message, 401);
    this.name = "AuthenticationError";
  }
}

export class PermissionError extends StaticFlowError {
  constructor(message: string = "Insufficient role permissions for this operation.") {
    super(message, 403);
    this.name = "PermissionError";
  }
}

export class ValidationError extends StaticFlowError {
  constructor(message: string, details?: unknown) {
    super(message, 422, details);
    this.name = "ValidationError";
  }
}

export class RateLimitError extends StaticFlowError {
  public retryAfter?: number;

  constructor(message: string = "API rate limit exceeded.", retryAfter?: number) {
    super(message, 429);
    this.name = "RateLimitError";
    this.retryAfter = retryAfter;
  }
}
