import { useContext } from 'react'
import { LogContext } from '../stores/context'
import { formatTimeStamp } from '.'

export const useLogs = () => {
  const { value, setValue } = useContext(LogContext)
  const addLogs = (added, form = '') => {
    const date = formatTimeStamp(Date.now())
    form = form ? '[' + form +'] ' : ''
    if (typeof added === 'string') {
      value.unshift(date + ': ' + form + added)
    } else {
      value.unshift(...added.map(log => date + ': ' + form + log))
    }
    setValue([...value])
  }
  return [value, addLogs]
}