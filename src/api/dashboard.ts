import request from '@/utils/http'

/**
 * 获取统计卡片数据
 * @returns 统计卡片信息
 */
export function fetchStatCardList() {
  return request.get<Api.Dashboard.CardDataItem>({
    url: '/dashboard/cardListData'
  })
}

/**
 * 获取月度收入数据
 * @returns 月度收入数据
 */
export function fetchMonthlyIncome() {
  return request.get<Api.Dashboard.MonthlyIncomeItem>({
    url: '/dashboard/monthlyIncome'
  })
}
