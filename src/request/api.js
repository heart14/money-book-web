import service from './request'

export function queryRecord(params) {
    return service.get('/daily/query', { params })
}

export function monthData(params) {
    const queryString = new URLSearchParams(params).toString()
    return service.get(`/daily/monthData?${queryString}`)
}

export function categoryData(params) {
    const queryString = new URLSearchParams(params).toString()
    return service.get(`/daily/categoryData?${queryString}`)
}

export function monthCateData(params) {
    const queryString = new URLSearchParams(params).toString()
    return service.get(`/daily/monthCategoryData?${queryString}`)
}