import { useEffect, useRef, useState, useMemo } from 'react'
import userServices from '../../services/user'
import fileServices from '../../services/file'
import modelServices from '../../services/model'
import { formatError, formatFilePath, getInputFilePath, loading, validateEmpty } from '../../utils'
import { useNavigate } from 'react-router-dom'
import { ModelData } from '../../common/type'
import { Table, Log } from '../../components'
import { useLogs } from '../../utils/hooks'
import { getSocketInstance } from '../../utils/socket'

const Upload = () => {
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const [email, setEmail] = useState(null)
  const logout = async () => {
    try {
      await userServices.logout()
    } catch (error) {
      setError(error.message)
    } finally {
      navigate('/')
    }
  }

  const [models, setModels] = useState([])
  useEffect(() => {
    (async () => {
      try {
        const _email = await userServices.getUserEmail()
        setEmail(_email)
      } catch (error) {
        navigate('/')
      } 
      await update()
      // setInterval(update, 3000)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [, addLogs] = useLogs()

  useEffect(() => {
    if (email === null) return
    const socket = getSocketInstance()
    socket.pubsub.subscribe({
      channel: email,
      onMessage: async(message) => {
        const { content, action } = JSON.parse(message.content)
        addLogs(content, 'Socket')
        if (action === 'updateTable') {
          await update()
        }
      },
      onSuccess: () => addLogs('Subscribe successfully', 'Socket'),
      onFailed: error => addLogs('Subscribe failed, error code:' + error.code + ' error content:' + error.content, 'Socket')
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email])

  const update = async () => {
    try {
      setModels(await modelServices.get())
    } catch (error) {
      setError(error.message)
    }
  }

  const deleteById = async(id) => {
    try {
      await modelServices.deleteById(id)
      setModels(models.filter(model => model.id !== id))
    } catch (error) {
      setError(error.message)
    }
  }

  const [intputText, setInputText] = useState('')
  const handleIntputTextChange = e => setInputText(e.target.value)

  const fileRef = useRef(null), submitRef = useRef(null)
  const submit = async (e) => {
    e.preventDefault()
    const stopLoading = loading(submitRef)
    try {
      validateEmpty({
        intputText, 
        files: fileRef.current.files
      })
      for (const file of fileRef.current.files) {
        await fileServices.upload(file)
        addLogs(file.name + ' uploaded', 'Client')
        await modelServices.put(new ModelData({
          input_text: intputText,
          input_file_path: getInputFilePath(file.name),
          email,
        }))  
        addLogs(intputText + ' and ' + file.name + ' written to the database, waiting for EC2...(1 - 3 minutes as usual)', 'Client')
      }
      await update()
      setError(null)
    } catch (error) {
      setError(error.message)
    } finally {
      stopLoading()
    }
  }

  const formatModels = useMemo(() => {
    for (let i = models.length; i--;) {
      const model = models[i]
      if (model.email !== email) models.splice(i, 1)
      ;['input_file_path', 'output_file_path']
      .forEach(key => model[key] = <a href={formatFilePath(model[key])} target="_blank" rel="noreferrer" className="text-cyan-600 hover:underline">{model[key]}</a>)
    }
    models.sort((a, b) => b.create_timestamp - a.create_timestamp)
    return models
  }, [models, email])

  return <form onSubmit={submit} className="flex-col items-center justify-center px-6 mx-auto lg:pt-5">
      <div className="mb-1 w-full">
        <span className="float-right"><span onClick={logout} className="font-medium ps-2 pe-2 text-primary-600 cursor-pointer hover:underline dark:text-primary-500">Log Out</span></span><label className="block mt-1 mb-1 ps-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Hi, <span className="text-pink-600">{email}</span> :)</label>
      </div>
      <div className="mb-1 w-full">
        <input type="text" value={intputText} onChange={handleIntputTextChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Please input the file name" />
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
          <input id="dropzone-file" type="file" ref={fileRef} className="hidden" />
      </label>
  </div> 
  {error && <div className="font-light text-red-600">{formatError(error)}</div>}
  <button type="submit" ref={submitRef} className="w-full mb-1 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Submit</button>
  <Log />
  <Table models={formatModels} deleteById={deleteById}></Table>
  </form>
}
export default Upload