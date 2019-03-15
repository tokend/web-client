export class Metadata {
  constructor (rawMetadata, createdAt) {
    this.fileHash = rawMetadata.file.hash
    this.fileKey = rawMetadata.file.key
    this.fileName = rawMetadata.file.name
    this.fileMimeType = rawMetadata.file.mime_type
    this.description = rawMetadata.description
    this.uploaderAccountId = rawMetadata.uploader_account_id
    this.updaterAccountId = rawMetadata.updater_account_id

    this.createdAt = createdAt
  }
}
