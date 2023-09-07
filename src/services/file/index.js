import { Error } from '../../common/type'

const upload = async (file) => {
  try {
    const response = await fetch(process.env.REACT_APP_S3_API_URL + '/' + process.env.REACT_APP_S3_BUCKET_NAME + '/' + file.name, {
      mode: 'cors',
      method: 'PUT',
      body: file,
    })
    return response
  } catch (error) {
    throw new Error('UploadException', error.message)
  }
}

const exports = {
  upload
}

export default exports