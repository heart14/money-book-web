import request from '@/utils/http'
// import { AppRouteRecord } from '@/types/router'

//---------------用户管理----------------//

// 获取用户列表
export function fetchUserList(params: Api.SystemManage.UserSearchParams) {
  return request.get<Api.SystemManage.UserList>({
    url: '/user/list',
    params
  })
}

// 编辑或新增用户
export function postUser(params: { uid?: number; username: string; nickname: string; roles: [] }) {
  return request.post({
    url: '/user',
    params
  })
}

// 删除用户
export function deleteUser(params: { uid: number }) {
  return request.del({
    url: '/user',
    params
  })
}

//---------------角色管理----------------//

// 获取角色列表
export function fetchRoleList(params: Api.SystemManage.RoleSearchParams) {
  return request.get<Api.SystemManage.RoleList>({
    url: '/role/list',
    params
  })
}

// 编辑或新增角色
export function postRole(params: {
  id?: number
  roleName: string
  roleCode: string
  roleDesc: string
  status: number
}) {
  return request.post({
    url: '/role',
    params
  })
}

// 禁用角色
export function deleteRole(params: { uid: number }) {
  return request.del({
    url: '/role',
    params
  })
}

//---------------分类管理----------------//

//---------------菜单管理----------------//
