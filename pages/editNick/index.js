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
				if(res.success) {
					wx.showToast({
						title: '操作成功！',
						mask: true
					})
				}
			}
		})
	},
	requestCardInfo: function() {
		request({
			key: 'getHuamingAndJianghuAndTrace',
			isLogin: true,
			success: (res) => {
				if(res.success) {
					this.setData({
						...res.data
					})
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
		this.setData({
			searchMap: res
		})
		this.requestCardInfo()
	}
})
