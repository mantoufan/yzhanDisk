import { useLogs } from '../../utils/hooks'

const Log = () => {
  const [logs] = useLogs()
  return <textarea readOnly rows="4" value={logs.join('\n')} className="block text-slate-500 p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
}

export default Log