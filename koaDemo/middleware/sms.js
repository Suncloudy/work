const SMSClient = require('@alicloud/sms-sdk');

/**
* 初始化阿里云的短信客户端
* @params {string} accessKeyId        阿里云短信服务的key
* @params {string} secretAccessKey    阿里云短信服务的secret
* @returns KOA 中间件，签名：async function (ctx, next) {}
* 
* 初始化后的短信客户端会被添加到 ctx.sms
*/
module.exports = function (accessKeyId, secretAccessKey) {
  return async (ctx, next) => {
    let smsClient = new SMSClient({accessKeyId, secretAccessKey});

    /*
    * @params {string} templateKey      阿里云后台配置的短信模板key
    * @params {string} sign             在阿里云后台配置短信签名
    * @params {string} phoneNumber      接收短信的手机号
    * @params {array}  ...args          短信参数值，需要与模板中配置值一一对应
    * @returns promise
    */
    ctx.sms = function(templateKey, sign, phoneNumber, ...args) {
      let template = config.get('sms').template[templateKey];
      if(!template) {
        console.error('短信模板不存在');
        return false;
      }
      let templateParam = {};
      template.params.map((key, idx) => {
        templateParam[key] = args[idx];
      });

      let param = {
        TemplateCode: template.code,
        SignName: sign,
        PhoneNumbers: phoneNumber,
        TemplateParam: JSON.stringify(templateParam) 
      }

      return smsClient.sendSMS(param);
    }
    await next();
  }
}
