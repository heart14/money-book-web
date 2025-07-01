import request from '@/utils/http'
import { BaseResult } from '@/types/axios'

interface PageListParam {
  current: number
  size: number
  date: string
  title: string
  categoryId: number
  type: string
  dateRangeStart: string
  dateRangeEnd: string
  path: string
}

interface TotalAmountParam {
  date: string
}

interface BillListParam {
  date: string
}

interface StatisticDataParam {
  conditionType: string // month | year
}

interface CategoryStatisticDataParam {
  conditionType: string // month | year
  billType: string // 支出 | 收入
}

interface saveOrEditParam {
  id: string
  datetime: string
  title: string
  amount: string
  type: string
  categoryId: number
  remark: string
}

export class moneyBookService {
  // 分页查询详细收支列表数据
  static getPageList(params: PageListParam) {
    return request.get<BaseResult>({
      url: '/moneybook/getPageList',
      params
    })
  }
  // 查询今日支出与收入数据
  static getTotalAmount(params: TotalAmountParam) {
    return request.get<BaseResult>({
      url: '/moneybook/getTotalAmount',
      params
    })
  }
  // 查询今日支出与收入数据
  static getBillList(params: BillListParam) {
    return request.get<BaseResult>({
      url: '/moneybook/getBillList',
      params
    })
  }
  // 查询年/月统计数据
  static getStatisticData(params: StatisticDataParam) {
    return request.get<BaseResult>({
      url: '/moneybook/getStatisticData',
      params
    })
  }
  // 查询年/月分类统计数据
  static getCategoryStatisticData(params: CategoryStatisticDataParam) {
    return request.get<BaseResult>({
      url: '/moneybook/getCategoryStatistic',
      params
    })
  }

  // 查询年/月总收入支出数据
  static getMonthlyData(params: StatisticDataParam) {
    return request.get<BaseResult>({
      url: '/moneybook/getMonthlyData',
      params
    })
  }

  // 保存记账记录
  static save(params: saveOrEditParam) {
    return request.post<BaseResult>({
      url: '/moneybook/save',
      params
    })
  }

  // 更新记账记录
  static edit(params: saveOrEditParam) {
    return request.post<BaseResult>({
      url: '/moneybook/edit',
      params
    })
  }
}
