//index.js
//获取应用实例
var app = getApp()
var { api } = require('../../config/api.default')
const { getEnhanceUserInfo } = require('../../lib/authorize')
const { request } = require('../../lib/request')

let isRequest = false
let lockRequest = false
Page({
	data: {
		traceList: []
	},
	gotoEditTrace: function(e) {
		let traceId = e.currentTarget.dataset.traceid
		wx.navigateTo({
            url: `../editTrace/index?traceId=${traceId}`
        })
	},
	requestCardInfo: function() {
		wx.showLoading({
			title: '加载中...',
			mask: true
		})
		request({
			key: 'getHuamingAndJianghuAndTrace',
			isLogin: true,
			success: (res) => {
				if(res.success) {
					let traceList = res.data.traceList || []
					this.setData({
						traceList
					})
				}
				wx.hideLoading()
			},
			fial: (res) => {
				wx.showToast({
					title: `请求服务失败`,
					mask: true
				})
				wx.hideLoading()
			}
		})
	},
	onshow: function() {
		this.setData({
			urlParams: res
		})
	},
	onLoad: function (res) {
		this.setData({
			urlParams: res
		})
		this.requestCardInfo()
	}
})
