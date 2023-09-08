const GITHUB_TOKEN = '' // Using Environment Variables instead

const downFromGithub = url => {
    return 'curl -H "Authorization: token ' + GITHUB_TOKEN + '" -H "Accept: application/vnd.github.v3.raw" -O -L ' + url
}
const commands = id => [
  downFromGithub('https://raw.githubusercontent.com/mantoufan/mAWS/main/ec2.sh'),
  downFromGithub('https://raw.githubusercontent.com/mantoufan/mAWS/main/.env'),
  'chmod +x ec2.sh',
  './ec2.sh ' + id
]

export default commands