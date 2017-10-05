import 'whatwg-fetch'
import { fetchMembersUrl } from '../config'
import { parseResponse } from '../utils'

export const fetchMembers = ({ name, mobile, page }) => {
    let url = fetchMembersUrl + `?`
    if(page) url += `page=${page}&`
    if (name) url += `name=${name}`
    else if (mobile) url += `mobile=${mobile}`
    return fetch(url, {
        method: 'get',
        // mode: 'no-cors'
    })
        .then(parseResponse)
}