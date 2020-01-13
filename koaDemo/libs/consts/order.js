module.exports = {
	// 订单状态
	status: {
		unconfirmed: {
			value: 10,
			text: '待确认'
		},
		processing: {
			value: 20,
			text: '处理中'
		},
		completed: {
			value: 30,
			text: '已完成'
		},
		cancelled: {
			value: 40,
			text: '已取消'
		}
	},
	paymentMethod: {
		wxpay: 'wxpay', 
		alipay: 'alipay',
		transfer: 'transfer'
	},
	paymentStatus: {
		unpaid: {
			value: 10,
			text: '待支付'
		},
		paid: {
			value: 20,
			text: '已支付'
		},
		unconfirmed: {
			value: 21,
			text: '付款待确认'
		},
		failed: {
			value: 30,
			text: '支付失败'
		},
		refunded: {
			value: 40,
			text: '已退款'
		}
	},
	shippingStatus: {
		notShipped: {
			value: 10,
			text: '未发货'
		},
		partShipped: {
			value: 20,
			text: '部分发货'
		},
		shipped: {
			value: 30,
			text: '已发货'
		},
		received: {
			value: 40,
			text: '已收货'
		},
		noNeed: {
			value: 50,
			text: '无需发货'
		}
	},
	from: {
		cart: 'cart',
		recharge: 'recharge'
	}
}

