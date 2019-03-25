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
    enterPasscode(passcode)
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

initialLogin()

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
    .type('body', '\u000d')
    .wait('#dont-remember-browser')
    .then(()=>{
      console.log(
        'now at the pass code login'
      )
    })
    .catch(err=>console.log(err))
}

function enterPasscode(code){
  nightmare
    .goto('https://bank.bbt.com/auth/kba.tb')
    .click('#dont-remember-browser')
    .type(code, '#user-password')
    .type('body', '\u000d')
    .wait('#acct-balance')
    .evaluate(()=>{
      return document.querySelector('#acct-balance').innerHTML
    })
    .then(balance=>{
      console.log(balance)
    })
    .catch(err=>{
      console.error('failed.', err)
    })
}

/*function acctBalance(){
  return new Promise((resolve, reject)=>{
    let balance = document.querySelector('#acct-balance')
    if(balance) resolve(balance)
    else reject('failed')
  });
}*/

function waitForCode(){
  return new Promise((resolve, reject)=>{
    console.log('waiting for input at localhost:3000')
    setInterval(()=>{
      if(passcode === undefined){
        console.log('waiting for passcode...')
      }else{
        console.log('passcode resolved')
        resolve(passcode)
      }
    }, 1000) // check every 1 sec. for code input

  });
}
