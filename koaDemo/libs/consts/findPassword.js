module.exports={
    //找回密码状态
    findPwd: {
        status: {
            created: {
                name: "创建密码找回任务",
                value: 0
            },
            validate: {
                name: "验证完成",
                value: 1
            },
            done: {
                name: "密码重置完成",
                value: 2
            },
            fail: {
                name: "找回失败",
                value: -1
            }
        }
    }
}