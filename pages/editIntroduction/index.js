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
		userInfo: {},
		officialInfo: {},
		introduction: ''
	},
	bindTextAreaInput: function(e) {
		console.log('dssddsda', e.detail.value);
		this.setData({
			introduction: e.detail.value
		}) 
	},
	// requestRule: function(options = {}) {
	// 	wx.showLoading({
	// 		title: '加载中...',
	// 		mask: true
	// 	})
	// 	request({
	// 		key: 'getHuamingInfo',
	// 		isLogin: true,
	// 		success: (res) => {
	// 			if(res.success) {
	// 				this.setData({
	// 					introduction: res.data.introduction
	// 				})
	// 			}
	// 		}
	// 	})
	// 	wx.hideLoading()
	// },
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
	requestSave: function(e) {
		console.log('dasdas', this.data.introduction);
		request({
			key: 'infoUpdate',
			isLogin: true,
			data: {
				type: 'introduction',
				value: this.data.introduction
			},
			success: (res) => {
				if(res.success) {
					wx.showToast({
						title: '保存成功！',
						mask: true
					})
				}
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
