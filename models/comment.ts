export interface CommnetResponse {
  comment: Comment
}

export interface CommentListResponse {
  comments: Comment[]
  total: number
}

export enum CommentLevel {
  Parent = 'parent',
  Child = 'child',
}

export interface CommentRequest {
  videoId: string
  content: string
  atUserId?: number[]
}

export interface SubCommentRequest {
  videoId: string
  content: string
  atUserId?: number[]
  parentCommentId: string
  targetCommentId?: string
}

export interface CommentTarget {
  parentCommentId: string
  targetCommentId?: string
  targetUserName: string
}

export interface SubCommentResponse {

}

export interface CommentItem {
  id: string
  content: string
  userInfo: UserInfo
  liked: boolean
  likedCount: number
  createTime: number
  targetComment?: {
    id: string
    userInfo: UserInfo
  }
}

export interface Comment extends CommentItem {
  childComments: CommentItem[]
}

interface UserInfo {
  age: number
  avatarUrl: string
  gender: number
  nickName: string
  slogan: string
  userId: string
}
