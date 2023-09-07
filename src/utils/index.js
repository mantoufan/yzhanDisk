import { Error } from '../common/type'

export const formatError = error => {
  return error[0].toUpperCase() + error.slice(1)
}

export const formatFilePath = filePath => {
  return process.env.REACT_APP_S3_API_URL + '/' + filePath
}

export function handleChange(event) {
  const { name, value } = event.target
  this(prevState => ({
    ...prevState,
    [name]: value
  }))
}

export const validateEmpty = formData => {
  const names = Object.keys(formData)
  const n = names.length
  for (let i = 0; i < n; i++) {
    if (formData[names[i]] === '') {
      throw new Error('FormatError', `${names[i]} is empty`)
    }
  }
}

export const getInputFilePath = (inputFileName) => {
  return process.env.REACT_APP_S3_BUCKET_NAME + '/' + inputFileName
}