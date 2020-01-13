const crypto = require('crypto');
let passwordMd5 = crypto.createHash('md5').update('666666').digest('hex');
console.log(passwordMd5)
//b3ff2736cd464d3f3bb08290f1c0f60e
let newpassword=crypto.createHash('md5').update(`${passwordMd5}${'35RcwB'}`).digest('hex')
console.log(newpassword)