import service from './request'

export function queryRecord(params) {
    return service.get('/daily/query', { params })
}

export function monthData(year) {
    return service.get(`/daily/monthData/${year}`)
}

export function monthCateData(year) {
    return service.get(`/daily/monthCategoryData/${year}`)
}