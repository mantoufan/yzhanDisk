import { useNavigate } from 'react-router-dom'
import service from '../../services'
import { useState } from 'react'
import { formatError, handleChange, validateEmpty } from '../../utils'
import { Error } from '../../common/type'

const validate = formData => {
  const validateErrorInstance = validateEmpty(formData)
  if (validateErrorInstance !== null) {
    return validateErrorInstance
  }
  if (formData.password !== formData['confirm password']) {
    return new Error('FormatError', 'Passwords do not match')
  }
  return null
}

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    'confirm password': ''
  })
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const register = async (e) => {
    e.preventDefault()
    const validateErrorInstance = validate(formData)
    if (validateErrorInstance !== null) {
      setError(validateErrorInstance.message)
      return 
    }
    const {email, password} = formData
    const registerErrorInstance = await service.register(email, password)
    if (registerErrorInstance === null) {
      navigateToLogin({
        replace: true,
        state: { email, password }
      })
    }
    setError(registerErrorInstance.message)
  }

  const navigateToLogin = options => {
    navigate('/', options)
  }

  return <section className="bg-gray-50 dark:bg-gray-900">
  <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
     <div className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
         <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
         Flowbite    
     </div>
     <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
         <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
             <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                 Create and account
             </h1>
             <form className="space-y-4 md:space-y-6" action="#" onSubmit={register}>
                 <div>
                     <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                     <input type="email" name="email" value={formData.email} onChange={handleChange.bind(setFormData)} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required="" />
                 </div>
                 <div>
                     <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                     <input type="password" name="password" value={formData.password} onChange={handleChange.bind(setFormData)}  placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                 </div>
                 <div>
                     <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                     <input type="confirm-password" name="confirm password" value={formData['confirm password']} onChange={handleChange.bind(setFormData)} placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                 </div>
                 {error && <p className="font-light text-red-600">{formatError(error)}</p>}
                 <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create an account</button>
                 <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                     Already have an account? <span onClick={navigateToLogin} className="font-medium text-primary-600 cursor-pointer hover:underline dark:text-primary-500">Login here</span>
                 </p>
             </form>
         </div>
     </div>
 </div>
</section> 
}

export default Register