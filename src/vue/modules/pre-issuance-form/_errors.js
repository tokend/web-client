import { errors } from '@/js/errors'

/**
 * The user doesn't own specified asset
 */
export class AssetNotOwnedError extends errors.RuntimeError {}

/**
 * The uploaded file is corrupted
 */
export class FileCorruptedError extends errors.RuntimeError {}
