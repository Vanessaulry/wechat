/*
    获取access_token。
 */
const rp = require('request-promise-native');
const {writeFile, readFile} = require('fs');
const {appID, appsecret} = require('../config');

class Wechat{
  /*
     *获取access_token
     *@return {Promise<result>}
   */
  async getAccessToken(){
    //定义请求地址
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`;
    //发送请求
    const result = await rp({method: 'GET',url,json: true});
    //设置access_token的过期时间，提前5分钟刷新
    result.expires_in = Date.now() + 7200000 -300000;
    //返回result
    return result;
  }
  /*
    读取access_token
    @param filePath 文件路径
    @return {Promise<any>}
   */
  readAccessToken (filePath) {
    return new Promise((resolve, reject) => {
      readFile(filePath,(err, data) => {
        if(!err) {
          resolve(JSON.parse(data.toString()));
        } else {
          reject('readAccessToken方法出了问题：' + err);
        }
      })
    })
  }

  /*
    判断access_token是否过期
    @param accessToken
    @return {boolean}
   */
  isValidAccessToken ({expires_in}) {
    if(Date.now() >= expires_in) {
      //说明过期了
      return false;
    }else {
      //说明没有过期
      return true;
    }
  }
}
(async () => {
  w.readAccessToken('./accessToken.txt')
    .then(async res => {
      if (w.isValidAccessToken(res)) {
        console.log(res);
        console.log('没有过期，直接使用');
      } else {
        const accessToken = await w.getAccessToken();
        await w.saveAccessToken('./accessToken.txt', accessToken);
      }
    })
    .catch(async err => {
      const accessToken = await w.getAccessToken();
      await w.saveAccessToken('./accessToken.txt', accessToken);
    })
}) ()