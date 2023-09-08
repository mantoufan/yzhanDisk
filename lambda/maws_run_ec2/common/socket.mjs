import https from 'https'

const options = {
  hostname: 'rest-hz.goeasy.io',
  path: '/v2/pubsub/publish',
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
}

const request = () => {
  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let rawData = ''
      res.setEncoding('utf8')
      res.on('data', chunk => {
        rawData += chunk;
      })
      res.on('end', () => {
        resolve(rawData)
      })
    })
    req.on('error', err => {
        console.log(123)
      reject(new Error(err))
    })
    req.write(JSON.stringify(data))
    req.end()
  })
}

const data = {
  appkey: 'BC-15fca31d289847ec897902f8639feda5',
  channel: 'mhjlw@126.com',
  content: 'Hello, GoEasy!',
}

export const sendMessage = async (channel, content, action = '') => {
  data.channel = channel
  data.content = JSON.stringify({
    content,
    action
  })
  const response = await request()
  return response
}