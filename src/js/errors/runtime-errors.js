/**
 * General runtime error
 */
export class RuntimeError extends Error { }

/**
 * The user already exists in the system
 */
export class UserExistsError extends RuntimeError { }
