const _res = async (response) => {
  const body = await response.json()
  if(response.status !== 200) throw Error('BadRequestException', body)
  return body
}

const put = async (modelData) => {
  const response = await fetch(process.env.REACT_APP_DB_API_URL + '/items', {
    mode: 'cors',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(modelData.getRequest()),
  })
  return _res(response)
}

const get = async () => {
  const response = await fetch(process.env.REACT_APP_DB_API_URL + '/items', {
    mode: 'cors',
    method: 'GET'
  })
  return _res(response)
}

const getById = async (id) => {
  const response = await fetch(process.env.REACT_APP_DB_API_URL + '/items/' + id, {
    mode: 'cors',
    method: 'GET'
  })
  return _res(response)
}

const deleteById = async (id) => {
  const response = await fetch(process.env.REACT_APP_DB_API_URL + '/items/' + id, {
    mode: 'cors',
    method: 'DELETE'
  })
  return _res(response)
}

const exports = {
  put,
  get,
  getById,
  deleteById
}

export default exports