/**
 * 验证token
 */
const JWT = require('jsonwebtoken');
module.exports.verifyToken= (token) =>{ 
    console.log('参数：'+token);
    try {
        let decoded = JWT.verify(token, config.get('secret')); 
        console.log('验证token内容'+JSON.stringify(decoded));
        if(!decoded.id) {return null;}
        let decodeds = JWT.decode(token); 
        let user = {
            id: decodeds.id,
            username: decodeds.username,
            account: decodeds.account,
        }; 
        console.log('验证token成功：user信息：'+JSON.stringify(user));
        return user;
    } catch (error) { 
        console.log(JSON.stringify(error));
        return null;
    } 
}

/**
 * 生成token
 */
module.exports.createToken=(user)=>{ 
    let token = JWT.sign({
        id: user.id,
        username: user.username,
        account: user.account,
    },  config.get('secret'), {
            expiresIn: '172800s' //过期时间设置为60妙。那么decode这个token的时候得到的过期时间为 : 创建token的时间 +　设置的值
        });
    return token;
}