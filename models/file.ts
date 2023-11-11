export enum UpTokenType {
  Video = 'video',
  Cover = 'cover',
  Avatar = 'avatar',
}

export interface OssHostResponse {
  endpoint: string
}

export interface UpTokenQuery {
  uploadType: UpTokenType
}

export interface UpTokenResponse {
  upToken: string
  expires: number
}

export interface FileResponse {
  hash: string
  key: string
  videoDuration?: string
  videoHeight?: string
  videoWidth?: string
}

export interface VideoQualityItem {
  name: string
  default?: boolean
  value: string
}
