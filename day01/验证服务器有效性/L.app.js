const express = require('express');
const sha1 = require('sha1')
const app = express();

const config = {
  appID:'wxf62e9b52d50d75e2',
  appsecret:'1bd990df5f38edb9bc5bdcfc90d9dc6e',
  token: '0810wechat'
}

app.use((req, res, next) => {
  console.log(req.query);
  const {signature, echostr, timestamp,nonce} = req.query;
  const {token} = config;
  const arr = [timestamp, nonce, token].sort();
  const str = sha1(arr.join(''));
  if(signature === str){
    res.end(echostr);
  } else {
    res.end('error');
  }
})



app.listen(3000,err => {
  if(!err) console.log('服务器启动成功')
  else console.log(err);
});