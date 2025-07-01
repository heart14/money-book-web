import request from '@/utils/http'
import { BaseResult } from '@/types/axios'

export class categoryService {
  // 分页查询详细收支列表数据
  static getLeafList() {
    return request.get<BaseResult>({
      url: '/category/getLeafList'
    })
  }
}
