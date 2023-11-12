import type { FavoriteRes } from '~/models'

export function favoriteVideo(videoId: string) {
  return $fetch<ApiResult<FavoriteRes>>(`/v1/favorite/video/${videoId}`, {
    method: 'PUT',
  })
}

export function unfavoriteVideo(videoId: string) {
  return $fetch<ApiResult<FavoriteRes>>(`/v1/favorite/video/${videoId}`, {
    method: 'DELETE',
  })
}

export function favoriteComment(id: string) {
  return $fetch<ApiResult<FavoriteRes>>(`/v1/favorite/comment/${id}`, {
    method: 'PUT',
  })
}

export function unfavoriteComment(id: string) {
  return $fetch<ApiResult<FavoriteRes>>(`/v1/favorite/comment/${id}`, {
    method: 'DELETE',
  })
}
