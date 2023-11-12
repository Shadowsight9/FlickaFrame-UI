import type { CommentLevel, CommentListResponse, CommentRequest, CommnetResponse, SubCommentRequest, SubCommentResponse } from '~/models'

export function createCommnet(payload: CommentRequest) {
  return $fetch<ApiResult<CommnetResponse>>('/v1/comment/video', {
    method: 'POST',
    body: payload,
  })
}

export function createSubComment(payload: SubCommentRequest) {
  return $fetch<ApiResult<SubCommentResponse>>('/v1/comment/parent', {
    method: 'POST',
    body: payload,
  })
}

export function deleteComment(commnetId: string, level: CommentLevel, videoId: string) {
  return $fetch<ApiResult<null>>(`/v1/comment/${commnetId}`, {
    method: 'DELETE',
    query: {
      type: level,
      videoId,
    },
  })
}

export function getCommnets(videoId: string) {
  return $fetch<ApiResult<CommentListResponse>>(`/v1/video/${videoId}/comments`, {
    method: 'GET',
  })
}
