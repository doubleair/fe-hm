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
			key: 'addLabel',
			isLogin: true,
			data: {
				huamingId: this.data.searchMap.huamingId,
				label: e.detail.value.tagValue,
			},
			success: (res) => {
				if(res.success) {
					wx.showToast({
						title: '添加成功！',
						mask: true,
						success: () => {
							setTimeout(() => {
								wx.navigateBack({
									delta: 1
								})
							}, 1000)
						}
					})
				}
			}
		})
	},
	onLoad: function (res) {
		console.log('2222', getCurrentPages());
		this.setData({
			searchMap: res
		})
	}
})
