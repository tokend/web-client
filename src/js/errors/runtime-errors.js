/**
 * General runtime error
 */
export class RuntimeError extends Error { }

/**
 * The user already exists in the system
 */
export class UserExistsError extends RuntimeError { }

/**
 * The user doesn't exist in the system
 */
export class UserDoesntExistError extends RuntimeError {}

/**
 * The account doesn't have specified balance
 */
export class BalanceNotFoundError extends RuntimeError {}
