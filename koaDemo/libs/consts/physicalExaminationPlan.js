'use strict'
module.exports={
    //公司体检计划状态
    phyPlan: {
        status: {
            created: {
                name: "计划已创建",//创建了计划就是已创建状态
                value: 0
            },
            doing: {
                name: "计划待支付",//创建订单后就是待支付状态
                value: 1
            },
            done: {
                name: "计划支付完成",//订单支付后，这个就是己完成状态
                value: 2
            },
            fail: {
                name: "计划作废",//计划订单作废状态
                value: -1
            }
        }
    }
}