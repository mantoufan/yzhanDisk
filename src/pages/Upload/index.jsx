import { useEffect, useState } from 'react'
import services from '../../services'
import { formatError } from '../../utils'
import { useNavigate } from 'react-router-dom'

const Upload = () => {
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const [email, setEmail] = useState(null)
  const logout = async () => {
    try {
      await services.logout()
      navigate('/')
    } catch (error) {
      setError(error.message)
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const _email = await services.getUserEmail()
        setEmail(_email)
      } catch (error) {
        navigate('/')
      }
    })()
   })

  return <>
      <span className="float-right">{error && <span className="font-light text-red-600">{formatError(error)}</span>}<span onClick={logout} className="font-medium ps-2 pe-2 text-primary-600 cursor-pointer hover:underline dark:text-primary-500">Log Out</span></span><label className="block mt-1 mb-1 ps-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Hi, <span className="text-pink-600">{email}</span> :)</label>
      <div className="mb-1">
        <input type="text" id="default-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Please input the file name" />
      </div>
      <div className="flex items-center justify-center w-full">
      <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
          </div>
          <input id="dropzone-file" type="file" className="hidden" />
      </label>
  </div> 
  </>
}
export default Upload