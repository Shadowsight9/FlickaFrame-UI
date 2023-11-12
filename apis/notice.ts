import type { NoticeListResponse, NoticeType } from '~/models'

export function getNoticeList(noticeType: NoticeType) {
  return $fetch<ApiResult<NoticeListResponse>>('/v1/notice/type', {
    query: {
      noticeType,
    },
  })
}
