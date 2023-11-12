import type { VideoCategoryResponse, VideoFeedQuery, VideoFeedResponse, VideoInfoResponse, VideoSearchRequest, VideoSearchResponse, VideoUploadInfo } from '~/models'

export function postVideo(payload: VideoUploadInfo) {
  return $fetch<ApiResult<null>>('/v1/video/create', {
    method: 'POST',
    body: payload,
  })
}

export function putVideo(payload: VideoUploadInfo) {
  return $fetch<ApiResult<null>>('/v1/video/create', {
    method: 'PUT',
    body: payload,
  })
}

export function getCagegory() {
  return $fetch<ApiResult<VideoCategoryResponse>>('/v1/video/category')
}

export function getVideoFeed(query?: VideoFeedQuery) {
  return $fetch<ApiResult<VideoFeedResponse>>('/v1/video/feed', {
    query,
  })
}

export function getFollowingVideo(query?: VideoFeedQuery) {
  return $fetch<ApiResult<VideoFeedResponse>>('/v1/video/following', {
    query,
  })
}

export function getHotVideo(query?: VideoFeedQuery) {
  return $fetch<ApiResult<VideoFeedResponse>>('/v1/video/hot', {
    query,
  })
}

export function searchVideo(payload: VideoSearchRequest) {
  return $fetch<ApiResult<VideoSearchResponse>>('/v1/video/search', {
    method: 'POST',
    body: payload,
  })
}

export function deleteVideo(videoId: string) {
  return $fetch<ApiResult<null>>(`/v1/video/${videoId}`, {
    method: 'DELETE',
  })
}

export function getVideoInfo(videoId: string) {
  return $fetch<ApiResult<VideoInfoResponse>>(`/v1/video/detail/${videoId}`)
}

export function createVideoHistory(videoId: string) {
  const store = useSessionStore()
  if (!store.isLogin) return Promise.resolve({ success: true })
  return $fetch<ApiResult<null>>('/v1/video/play-history', {
    method: 'POST',
    body: { videoId },
  })
}

export function getVideoHistory(query?: VideoFeedQuery) {
  return $fetch<ApiResult<VideoFeedResponse>>('/v1/video/play-history', {
    query,
  })
}

export function getFavoriteVideo(query?: VideoFeedQuery) {
  return $fetch<ApiResult<VideoFeedResponse>>('/v1/video/liked', {
    query,
  })
}

export function deleteVideoHistory(videoId: string) {
  return $fetch<ApiResult<null>>(`/v1/video/play-history/${videoId}`, {
    method: 'DELETE',
  })
}

export function cleanVideoHistory() {
  return $fetch<ApiResult<null>>('/v1/video/play-history', {
    method: 'DELETE',
  })
}

export function shareVideo(videoId: string) {
  return $fetch<ApiResult<null>>(`/v1/video/share/${videoId}`, {
    method: 'POST',
  })
}
