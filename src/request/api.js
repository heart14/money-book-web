import service from './request'

// 查询记账记录
export function queryRecord(params) {
    return service.get('/daily/query', { params })
}

// 查询年度收支数据
export function annualDataByYear(params) {
    const queryString = new URLSearchParams(params).toString()
    return service.get(`/daily/annualDataByYear?${queryString}`)
}

// 查询年度收支统计图数据
export function annualData(params) {
    const queryString = new URLSearchParams(params).toString()
    return service.get(`/daily/annualData?${queryString}`)
}

// 查询月支出统计图数据
export function monthData(params) {
    const queryString = new URLSearchParams(params).toString()
    return service.get(`/daily/monthData?${queryString}`)
}

// 查询分类支出统计图数据
export function categoryData(params) {
    const queryString = new URLSearchParams(params).toString()
    return service.get(`/daily/categoryData?${queryString}`)
}

// 查询月分类统计表数据
export function monthCateData(params) {
    const queryString = new URLSearchParams(params).toString()
    return service.get(`/daily/monthCategoryData?${queryString}`)
}