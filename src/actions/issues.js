import 'whatwg-fetch'
import { fetchIssuesUrl } from '../config'
import { parseResponse } from '../utils'

export const fetchIssues = (date, page) => fetch(fetchIssuesUrl + `?date=${date}&page=${page}`, {
    method: 'get'
})
    .then(parseResponse)

export const postIssue = (bookId, memberId) => fetch(fetchIssuesUrl + `?bookId=${bookId}&memberId=${memberId}`, {
    method: 'post'
})
    .then(parseResponse)
