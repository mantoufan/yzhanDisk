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
    if (formData[names[i]].length === 0) {
      throw new Error('FormatError', `${names[i]} is empty`)
    } else if (formData[names[i]] === '') {
      throw new Error('FormatError', `${names[i]} is empty`)
    }
  }
}

export const getInputFilePath = (inputFileName) => {
  return process.env.REACT_APP_S3_BUCKET_NAME + '/' + inputFileName
}

export const formatTimeStamp = timestamp => {
  const date = new Date(timestamp)
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}


export const loading = ref => {
  const icon = document.createElement('span')
  icon.classList.add('inline-block', 'align-text-bottom')
  icon.innerHTML = '<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>'
  ref.current.insertBefore(icon, ref.current.firstChild)
  ref.current.disabled = true
  return () => {
    ref.current.removeChild(icon)
    ref.current.disabled = false
  }
}