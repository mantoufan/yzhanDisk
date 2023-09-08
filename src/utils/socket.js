import GoEasy from 'goeasy'

let socketInstance = null

export const getSocketInstance = () => {
  if (socketInstance !== null) return socketInstance
  socketInstance = GoEasy.getInstance({
    host:'hangzhou.goeasy.io', 
    appkey: process.env.REACT_APP_SUB_KEY, // Only for receiving, could not publish msg
    modules: ['pubsub']
  })
  socketInstance.connect({
    onSuccess () { console.log('GoEasy connect successfully.') },
    onFailed (error) { console.log("Failed to connect GoEasy, code:"+error.code+ ",error:"+error.content) }
  })
  return socketInstance
}