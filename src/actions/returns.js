import 'whatwg-fetch'
import { fetchReturnsUrl } from '../config'
import { parseResponse } from '../utils'

export const fetchReturns = (date, page) => fetch(fetchReturnsUrl + `?date=${date}&page=${page}`, {
    method: 'get'
})
    .then(parseResponse)

export const postReturn = (issueId) => fetch(fetchReturnsUrl + `?id=${issueId}`, {
    method: 'post'
})
    // .then(delay)
    .then(parseResponse)

// const delay = () => new Promise((resolve, reject) => {
//     setTimeout(() => resolve({}), 2000)
// })