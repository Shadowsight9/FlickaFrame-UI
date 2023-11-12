import type { SessionResponse, UserEditRequest, UserLoginRequest, UserResponse } from '~/models/user'
import type { FollowListResponse, FollowPageOption } from '~/models/follow'
import { UserGender } from '~/models'
import { getUrlOssKey } from './file'

export async function login(data: UserLoginRequest) {
  const store = useSessionStore()
  const response = await $fetch<ApiResult<SessionResponse>>('/v1/user/login', {
    method: 'POST',
    body: data,
  })

  if (response.success) {
    store.session = response.data
  }
  return response
}

export function register(data: UserLoginRequest) {
  return $fetch<ApiResult<SessionResponse>>('/v1/user/register', {
    method: 'POST',
    body: data,
  })
}

export async function getUserInfo() {
  const store = useSessionStore()
  const response = await $fetch<ApiResult<UserResponse>>('/v1/user/detail')

  if (response.success) {
    store.user = response.data
  }

  return response
}

export async function editUserInfo(payload: Partial<UserEditRequest>) {
  const user = useSessionStore().user

  const _payload: UserEditRequest = {
    slogan: user.slogan || '',
    age: user.age || -1,
    gender: user.gender || UserGender.Unknown,
    nickName: user.nickName || '',
    backgroundUrl: user.backgroundUrl || '',
    avatarUrl: user.avatarUrl || '',
    ...payload,
  }

  _payload.backgroundUrl = getUrlOssKey(_payload.backgroundUrl)
  _payload.avatarUrl = getUrlOssKey(_payload.avatarUrl)

  return $fetch<ApiResult<null>>('/v1/user/info', {
    method: 'PUT',
    body: _payload,
  })
}

export function getUserInfoById(userId: string) {
  return $fetch<ApiResult<UserResponse>>(`/v1/user/detail/${userId}`)
}

export function getMyFollowingList(pageOption: FollowPageOption, userId = 'me') {
  return $fetch<ApiResult<FollowListResponse>>(`/v1/user/${userId}/following`, {
    query: pageOption,
  })
}

export function getMyFollowerList(pageOption: FollowPageOption, userId = 'me') {
  return $fetch<ApiResult<FollowListResponse>>(`/v1/user/${userId}/followers`, {
    query: pageOption,
  })
}

export function followUser(userId: string) {
  return $fetch<ApiResult<boolean>>(`/v1/user/follow_action/${userId}`, {
    method: 'PUT',
  })
}

export function unfollowUser(userId: string) {
  return $fetch<ApiResult<boolean>>(`/v1/user/follow_action/${userId}`, {
    method: 'DELETE',
  })
}
