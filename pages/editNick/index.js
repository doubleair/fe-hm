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
		huaming: ''
	},
	requestSave: function(e) {

		request({
			key: 'infoUpdate',
			isLogin: true,
			data: {
				// huaming/introduction
				type: 'huaming',
				value: e.detail.value.huaming
			},
			success: (res) => {
				console.log('ddss', res);
			}
		})
	},
	requestRule: function(options = {}) {
		wx.showLoading({
			title: '加载中...',
			mask: true
		})
		request({
			key: 'getHuamingInfo',
			isLogin: true,
			success: (res) => {
				if(res.success) {
					this.setData({
						huaming: res.data.huaming
					})
				}
			}
		})
		wx.hideLoading()
	},
	onLoad: function (res) {
		this.setData({
			urlParams: res
		})
		this.requestRule()
	}
})
