import type { CommentLevel, CommentListResponse, CommentRequest, CommnetResponse, SubCommentRequest, SubCommentResponse } from '~/models'

export function createCommnet(payload: CommentRequest) {
  return $fetch<ApiResult<CommnetResponse>>('/api/comment/video', {
    method: 'POST',
    body: payload,
  })
}

export function createSubComment(payload: SubCommentRequest) {
  return $fetch<ApiResult<SubCommentResponse>>('/api/comment/parent', {
    method: 'POST',
    body: payload,
  })
}

export function deleteComment(commnetId: string, level: CommentLevel, videoId: string) {
  return $fetch<ApiResult<null>>(`/api/comment/${commnetId}`, {
    method: 'DELETE',
    query: {
      type: level,
      videoId,
    },
  })
}

export function getCommnets(videoId: string) {
  return $fetch<ApiResult<CommentListResponse>>(`/api/video/${videoId}/comments`, {
    method: 'GET',
  })
}
