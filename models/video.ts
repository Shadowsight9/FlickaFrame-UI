export interface VideoFeedResponse {
  next: string
  list: VideoItem[]
  isEnd: boolean
}

export interface VideoFeedQuery {
  authorID?: string
  categoryId?: string
  cursor?: string
  limit?: number
  tag?: string
}

export interface VideoSearchRequest {
  keyword: string
  offset: number
  limit: number
}

export interface VideoSearchResponse {
  list: VideoItem[]
  query: string
  processingTimeMs: number
  offset: number
  limit: number
  estimatedTotalHits: number
}

export interface VideoItem {
  id: string
  title: string
  description: string
  createdAt: number // 毫秒时间戳
  category: VideoCategory
  tags: VideoTag[]

  thumbUrl: string
  playUrl: string
  author: VideoUserInfo

  favoriteCount: number
  commentNum: number
  shareNum: number
  isFavorite: boolean

  videoDuration: number
  videoHeight: number
  videoWidth: number
}

export interface VideoUserInfo {
  avatarUrl: string
  nickName: string
  isFollow: boolean
  slogan: string
  gender: number
  userId: string
}

export interface VideoUploadInfo {
  id?: string
  playUrl: string
  thumbUrl: string
  title: string
  description?: string
  category: string
  tags: string[]
  publishTime?: number
  visibility: number // 1 | 2

  videoDuration?: number
  videoHeight?: number
  videoWidth?: number
}

export const ALL_CATEGORY = '0'

export interface VideoCategory {
  id: string
  name: string
}

export interface VideoCategoryResponse {
  categoryList: VideoCategory[]
}

export interface VideoInfoResponse {
  video: VideoItem
}

export interface VideoTag {
  id: string
  name: string
}

export interface PlayHistory {
  videoId: string

  total: number // seconds
  consumed: number // seconds
  lastProgress?: number // seconds
  lastWatchedAt: number // turn to active
  lastPlayedAt?: number // pause to playing
}
