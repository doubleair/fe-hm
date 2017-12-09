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
		sourceCagegoryList: [],
		cagegoryList: [],
		cagegoryIndex: 0
	},
	bindMultiPickerChange: function (e) {
		console.log('picker发送选择改变，携带值为', e.detail.value)
		this.setData({
			multiIndex: e.detail.value
		})
	},
	bindPickerChange: function (e) {
		this.setData({
			cagegoryIndex: e.detail.value
		})
	},
	bindEditDelete: function () {

	},
	bindEditSubmit: function (e) {

		request({
			key: 'infoUpdate',
			data: {
				type: 'mark',
				value: JSON.stringify({
					traceId: '100928',
					description: '攻守道'
				})
			},
			isLogin: true,
			success: (res) => {
				console.log('ddss', res);
			},
			fial: () => {
			}
		})
	},
	requestCagegory: function(e) {
		wx.showLoading({
			title: '加载中...',
			mask: true
		})
		request({
			key: 'getTraceCategory',
			isLogin: true,
			success: (res) => {
				if(res.success) {
					const sourceCagegoryList = res.data
					let cagegoryList = sourceCagegoryList && sourceCagegoryList.map((item) => {
						return item.traceName
					})

					this.setData({
						cagegoryList,
						sourceCagegoryList,
					})
				}
				wx.hideLoading()
			},
			fial: () => {
				console.log('dasdasdas');
				wx.hideLoading()
			}
		})
	},
	requestSave: function(e) {
		const params = {
			traceConstantId: this.data.sourceCagegoryList[this.data.cagegoryIndex].id,
			traceName: this.data.sourceCagegoryList[this.data.cagegoryIndex].traceName,
			description: e.detail.value.description
		}
		if(this.data.searchMap.traceId) {
			params.id = this.data.searchMap.traceId
		}
		request({
			key: 'infoUpdate',
			isLogin: true,
			data: {
				type: 'trace',
				value: JSON.stringify(params)
			},
			success: (res) => {
				console.log('ddss', res);
			}
		})
	},
	onLoad: function (res) {
		this.setData({
			searchMap: res
		})
		this.requestCagegory()
		// this.requestRule()

		// request({
		// 	key: 'getInfo',
		// 	data: {
		// 		// huaming/introduction
		// 		type: 'mark',
		// 		value: this.data.textArea
		// 	},
		// 	success: (res) => {
		// 		console.log('ddss', res);
		// 	}
		// })

	}
})
