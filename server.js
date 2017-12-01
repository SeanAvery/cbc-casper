import ws from 'ws'
import Shell from 'python-shell'

const wss = new ws.Server({ port: 3344})

wss.on('connection', (socket, req) => {
  console.log('### new connection')
  socket.on('message', async (data) => {
    console.log('### received data from client', data)
    const args = await parseArgs(JSON.parse(data), socket)
    await runScript(args, socket)
  })
})

const parseArgs = async (data, socket) => {
  try {
    let options = {
      mode: 'text',
      pythonPath: 'venv/bin/python',
      pythonOptions: ['-u'],
      args: []
    }
    Promise.all(
      Object.keys(data).map(async arg => {
        switch(arg) {
          case 'network':
            options.args.push(`${data[arg]}`)
            break
          case 'validators':
            options.args.push('--validators')
            options.args.push(`${data[arg]}`)
            break
          case 'rounds':
            options.args.push('--rounds')
            options.args.push(`${data[arg]}`)
            break
          case 'inverval':
            options.args.push('--report-interval')
            options.args.push(`${data[arg]}`)
            break
          default :
            break
        }
      })
    )
    return options
  } catch (err) {
    console.log('### error parsing arguments', err)
  }
}

const runScript = async (args, socket) => {
  const shell = new Shell('./casper.py', args)
  shell.on('message', (msg) => {
    socket.send(msg)
  })
}
