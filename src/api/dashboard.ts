import request from '@/utils/http'

//---------------工作台页面----------------//

/**
 * 获取统计卡片数据
 * @returns 统计卡片信息
 */
export function fetchStatCardList(params?: { year?: string }) {
  return request.get<Api.Dashboard.CardDataItem>({
    url: '/dashboard/cardListData',
    params
  })
}

/**
 * 获取月度收入数据
 * @returns 月度收入数据
 */
export function fetchMonthlyIncome(params?: { year?: string }) {
  return request.get<Api.Dashboard.MonthlyIncomeItem>({
    url: '/dashboard/monthlyIncome',
    params
  })
}

/**
 * 获取月度支出数据
 * @returns 月度支出数据
 */
export function fetchMonthlyExpense(params?: { year?: string }) {
  return request.get<Api.Dashboard.MonthlyExpenseItem>({
    url: '/dashboard/monthlyExpense',
    params
  })
}

/**
 * 获取分类收入统计数据
 * @returns 分类收入统计数据
 */
export function fetchCategoryIncome(params?: { year?: string }) {
  return request.get<Api.Dashboard.CategoryIncomeItem>({
    url: '/dashboard/categoryIncome',
    params
  })
}

/**
 * 获取分类支出统计数据
 * @returns 分类支出统计数据
 */
export function fetchCategoryExpense(params?: { year?: string }) {
  return request.get<Api.Dashboard.CategoryExpenseItem>({
    url: '/dashboard/categoryExpense',
    params
  })
}

/**
 * 获取大额消费记录数据
 * @returns 大额消费记录数据
 */
export function fetchLargeConsume(params?: { year?: string }) {
  return request.get<Api.Dashboard.LargeConsumeItem>({
    url: '/dashboard/largeConsume',
    params
  })
}

//---------------交易详情页面----------------//

/**
 * 分页查询交易明细
 */
export function fetchTransDetailList(params: Api.TransDetail.TransDetailPageParam) {
  return request.get<Api.TransDetail.TransDetailPageParam>({
    url: '/dashboard/transDetailList',
    params
  })
}

/**
 * 提交交易明细
 */
export function postTransDetail(params: Api.TransDetail.TransDetailItem) {
  return request.post({
    url: '/dashboard/transDetail',
    params
  })
}

/**
 * 查询交易分类列表
 */
export function fetchCategoryList(params?: Api.Category.CategoryParam) {
  return request.get<Api.Category.CategoryItem[]>({
    url: '/category/list',
    params
  })
}

//---------------统计数据页面----------------//

/**
 * 查询按月按分类数据汇总
 */
export function fetchTabulateList(params?: { year?: string }) {
  return request.get<Api.Tabulate.TabulateItem>({
    url: '/dashboard/tabulateList',
    params
  })
}

//---------------日历页面----------------//

/**
 * 查询日历event数据
 */
export function fetchEventList(params: { yearMonth: string }) {
  return request.get<Api.CalendarEvent.CalendarEventItem>({
    url: '/dashboard/eventList',
    params
  })
}

/**
 * 编辑或新增日历event数据
 */
export function postEventTag(params: {
  id?: number
  date: string
  endDate?: string
  content: string
}) {
  return request.post({
    url: '/dashboard/event',
    params
  })
}

/**
 * 删除日历event数据
 */
export function deleteEventTag(params: { id: number }) {
  return request.del({
    url: '/dashboard/event',
    params
  })
}

/**
 * 查询日历diary数据
 */
export function fetchDiaryList(params: { yearMonth: string }) {
  return request.get<Api.CalendarEvent.CalendarDiaryItem>({
    url: '/dashboard/diaryList',
    params
  })
}

/**
 * 编辑或新增日历diary数据
 */
export function postDiary(params: {
  id?: number
  date: string
  workShift: string
  diaryContent: string
}) {
  return request.post({
    url: '/dashboard/diary',
    params
  })
}
