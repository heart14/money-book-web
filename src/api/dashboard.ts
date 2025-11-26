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

/**
 * 获取月度支出数据
 * @returns 月度支出数据
 */
export function fetchMonthlyExpense() {
  return request.get<Api.Dashboard.MonthlyExpenseItem>({
    url: '/dashboard/monthlyExpense'
  })
}

/**
 * 获取分类收入统计数据
 * @returns 分类收入统计数据
 */
export function fetchCategoryIncome() {
  return request.get<Api.Dashboard.CategoryIncomeItem>({
    url: '/dashboard/categoryIncome'
  })
}

/**
 * 获取分类支出统计数据
 * @returns 分类支出统计数据
 */
export function fetchCategoryExpense() {
  return request.get<Api.Dashboard.CategoryExpenseItem>({
    url: '/dashboard/categoryExpense'
  })
}
