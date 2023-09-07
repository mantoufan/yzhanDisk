import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { formatError, handleChange, validateEmpty } from '../../utils'
import userServices from '../../services/user'
import store from '../../utils/store'

const Login = () => {
  let email = '', password = ''
  const { state } = useLocation()
  if (state !== void 0 && state !== null) {
    email = state.email
    password = state.password
  }

  const [formData, setFormData] = useState({
    email,
    password
  })
  const [code, setCode] = useState('')
  const handleChangeCode = e => setCode(e.target.value)
  
  const [error, setError] = useState(null)
  const [needCode, setNeedCode] = useState(false)

  const navigate = useNavigate()
  const navigetToRegister = () => {
    navigate('/register')
  }

  const login = async (e) => {
    e?.preventDefault()
    try {
      if (code !== '') {
        await userServices.confirm(formData.email, code)
      }
      validateEmpty(formData)
      const { email, password } = formData
      const { AccessToken } = await userServices.login(email, password)
      store.set('AccessToken', AccessToken, 86400 * 30)
      // Todo: if accessToken expire, use refreshToken to request a new one.
      navigate('/upload')
    } catch (error) {
      if (error.code === 'UserNotConfirmedException') {
        setNeedCode(true)
      }
      setError(error.message)
    }
  }

  useEffect(() => {
    (async () => {
      if (email !== '' && password !== '') {
        await login()
      } else {
        try {
          await userServices.getUserEmail()
          navigate('/upload')
        } catch (error) {}
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

  return <section className="bg-gray-50 dark:bg-gray-900">
  <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
          Flowbite    
      </div>
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Sign in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" action="#" onSubmit={login}>
                  <div>
                      <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange.bind(setFormData)} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required="" />
                  </div>
                  <div>
                      <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                      <input type="password" name="password" value={formData.password} onChange={handleChange.bind(setFormData)} placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                  </div>
                  {
                  needCode &&
                  <div>
                      <label htmlFor="code" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Code</label>
                      <input type="text" name="code" value={code} onChange={handleChangeCode} placeholder={`Please find the code in ${email}`} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                  </div>
                  }
                  {error && <p className="font-light text-red-600">{formatError(error)}</p>}
                  <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                      Don’t have an account yet? <span onClick={navigetToRegister} className="font-medium text-primary-600 cursor-pointer hover:underline dark:text-primary-500">Sign up</span>
                  </p>
              </form>
          </div>
      </div>
  </div>
</section>

}
export default Login