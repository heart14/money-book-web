import request from '@/utils/http'
import { BaseResult } from '@/types/axios'

interface TotalAmountParam {
  date: string
}

interface BillList {
  date: string
}

export class moneyBookService {
  // 查询今日支出与收入数据
  static getTotalAmount(params: TotalAmountParam) {
    return request.get<BaseResult>({
      url: '/moneybook/getTotalAmount',
      params
    })
  }
  // 查询今日支出与收入数据
  static getBillList(params: BillList) {
    return request.get<BaseResult>({
      url: '/moneybook/getBillList',
      params
    })
  }
}
