import request from '@/utils/http'
import { BaseResult } from '@/types/axios'

interface LoginParams {
  username: string
  password: string
}

interface UserListParams {
  current?: number
  size?: number
}

export class UserService {
  // 登录
  static login(params: LoginParams) {
    return request.post<BaseResult>({
      url: '/auth/login',
      params
    })
  }

  // 注册
  static register(params: LoginParams) {
    return request.post<BaseResult>({
      url: '/auth/register',
      params
    })
  }

  // 获取用户信息
  static getUserInfo() {
    return request.get<BaseResult>({
      url: '/user/info'
    })
  }

  // 获取用户列表
  static getUserList(params?: UserListParams) {
    return request.get<BaseResult>({
      url: '/api/user/list',
      params
    })
  }
}
