const opn = require('opn')
const Nightmare = require('nightmare')
const nightmare = Nightmare({show:true})
const express = require('express')
const server = express()
const port = 3000

if(process.argv[2] == undefined){
  console.log('no user and pass provided')
  process.exit(0)
}

const user = process.argv[2]
const pass = process.argv[3]
let passcode;

server.listen(port, async ()=>{
  console.log(`listening on port ${port}`)
  try{
    passcode = await waitForCode()
    console.log(passcode)
  }catch(err){
    console.log(err)
  }
})
server.get('/', (req,res)=>{
  res.send('')
})
server.get('/:code', (req,res)=>{
  passcode = req.params.code
})

// initialLogin()

function initialLogin(){
  nightmare
    .goto('https://www.bbt.com/online-access/online-banking/dashboard.html')
    .click('#js-collapsible__trigger--20')
    .type('#login-username-input-1', user)
    .type('#login-password-input-1', pass)
    .click('.login__global-form-button')
    .wait('#security-passcode')
    .click('#security-passcode')
    .click('#passcode-contact2')
    .type('body', '\u000d') //"press enter" equiv
    .evaluate(waitForCode)
    .type(passcode, '#user-password')
    .type('body', '\u000d')
    .catch(err=>{
      console.error('failed.', err)
    })
}

function openBrowser(){
  return new Promise(function(resolve, reject) {
    opn('http://localhost:3000/')
    resolve()
  });
}

function waitForCode(){
  return new Promise((resolve, reject)=>{
    console.log('waiting for input at localhost:3000')
    setInterval(()=>{
      if(passcode === undefined){
        console.log('waiting for passcode...')
      }else{
        resolve(passcode)
      }
    }, 1000) // check every 1 sec. for code input

  });
}
