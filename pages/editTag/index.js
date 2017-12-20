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
		huaming: '',
		labelList: []
	},
	requestCardInfo: function() {
		request({
			key: 'getHuamingAndJianghuAndTrace',
			isLogin: true,
			success: (res) => {
				if(res.success) {
					let labelList = res.data.labelList || []
					this.setData({
						labelList
					})
				}
				wx.hideLoading()
			},
			fial: (res) => {
				wx.showToast({
					title: `请求服务失败`,
					mask: true
				})
			}
		})
	},
	requestRemoveLabel: function(e) {
		request({
			key: 'removeLabel',
			data: {
				labelId: e.currentTarget.dataset.tagid
			},
			isLogin: true,
			success: (res) => {
				if(res.success) {
					this.requestCardInfo()
				}
			},
			fial: (res) => {
				wx.showToast({
					title: `请求服务失败`,
					mask: true
				})
			}
		})
	},
	onLoad: function (res) {
		wx.showLoading({
			title: '加载中...',
			mask: true
		})
		this.setData({
			searchMap: res
		})
		this.requestCardInfo()
	}
})
