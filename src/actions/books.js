import 'whatwg-fetch'
import { fetchBooksUrl } from '../config'
import { parseResponse } from '../utils'

export const fetchBooks = ({ name, author, category, page }) => {
    let url = fetchBooksUrl + `?page=${page}&`
    if (name) url += `name=${name}`
    else if (author) url += `author=${author}`
    else if (category) url += `category=${category}`
    return fetch(url, {
        method: 'get'
    })
        .then(parseResponse)
}