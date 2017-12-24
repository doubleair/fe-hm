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
		wx.showLoading({
			title: '加载中...',
			mask: true
		})
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
		wx.showActionSheet({
			itemList: ['确认删除'],
			itemColor: '#FF0000',
			success: (res) => {
				if(res.tapIndex === 0) {
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
				}
			},
			fail: function(res) {
			  	console.log(res.errMsg)
			}
		})
	},
	onLoad: function (res) {
		this.setData({
			searchMap: res
		})
		this.requestCardInfo()
	}
})
