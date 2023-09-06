import { Error } from '../common/type'

export const formatError = error => {
  return error[0].toUpperCase() + error.slice(1)
}

export function handleChange(event) {
  const { name, value } = event.target
  this(prevState => ({
    ...prevState,
    [name]: value
  }))
}

export const validateEmpty = (formData) => {
  const names = Object.keys(formData)
  const n = names.length
  for (let i = 0; i < n; i++) {
    if (formData[names[i]] === '') {
      return new Error('FormatError', `${names[i]} is empty`)
    }
  }
  return null
}