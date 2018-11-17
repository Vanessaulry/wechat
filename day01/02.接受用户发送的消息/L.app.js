const express = require('express');
const sha1 = require('sha1');

const {getUserDataAsync, parseXMLDataAsync, formatMessage} = require('./utils/L.tools')

const app = express();

const config = {
  appID:'wxf62e9b52d50d75e2',
  appsecret:'1bd990df5f38edb9bc5bdcfc90d9dc6e',
  token: '0810wechat'
}

app.use(async (req, res, next) => {
  console.log(req.query);
  const {signature, echostr, timestamp,nonce} = req.query;
  const {token} = config;
  const arr = [timestamp, nonce, token].sort();
  const str = sha1(arr.join(''));


  if(req.method === 'GET') {
    if(signature === str) {
      res.end(echostr);
    }else {
      res.end('error');
    }
  }else if (req.method === 'POST') {
    if(signature !== str) {
      res.end('error');
      return;
    }
    const xmlData = await getUserDataAsync(req);
    console.log(xmlData);
    const jsData = await parseXMLDataAsync(xmlData);
    console.log(jsData);
    const message = formatMessage(jsData);
    console.log(message);

    let content = '我听不懂';

    if (message.Content === '1') {
      content = '大吉大利，今晚吃鸡';
    } else if (message.Content === '2'){
      content = '基地刚枪，落地成盒';
    } else if (message.Content.includes('3')) {
      content = '速度找车，猥琐发育';
    }

    let replyMessage = `<xml>
      <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
      <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
      <CreateTime>${Date.now()}</CreateTime>
      <MsgType><![CDATA[text]]></MsgType>
      <Content><![CDATA[${content}]]></Content>
      </xml>`;
    res.send(replyMessage);
  } else{
    res.end('error');
  }
})



app.listen(3000,err => {
  if(!err) console.log('服务器启动成功')
  else console.log(err);
});