module.exports = {
  initPassword: '666666',
  from: {
    web: 'web', 
    wxapp: 'wxapp',
    admin: 'admin'
  },
  type: {
    personal: 'personal', 
    enterprise: 'enterprise'
  },
  transactionType: {
    recharge: 'recharge',       // 充值 
    withdraw: 'withdraw',       // 提现
    consumption: 'consumption', // 消费
    refund: 'refund',           // 退款
    manager: 'manager',         // 管理员操作 
    other: 'other'              // 其它
  }
}