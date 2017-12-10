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
		cagegoryNameList: [],
		cagegoryIndex: 0,
		cardInfo: {}
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
					let cagegoryNameList = sourceCagegoryList && sourceCagegoryList.map((item) => {
						return item.traceName
					})

					this.setData({
						cagegoryNameList,
						sourceCagegoryList,
					})
					this.requestCardInfo()
				}
				
				wx.hideLoading()
			},
			fial: () => {
				console.log('dasdasdas');
				wx.hideLoading()
			}
		})
	},
	requestCardInfo: function() {
		request({
			key: 'getHuamingAndJianghuAndTrace',
			isLogin: true,
			success: (res) => {
				if(res.success) {
					let traceList = res.data.traceList
					let currentTraceInfo = {}
					// 查询目标痕迹信息
					console.log('traceList', traceList);
					traceList.forEach((data) => {
						if(Number(this.data.searchMap.traceId) === data.id) {
							currentTraceInfo = data
						}
					})

					// 查询行业下标
					this.data.sourceCagegoryList.forEach((data, index) => {
						if(data.id === currentTraceInfo.traceConstantId) {
							console.log('dasdsa', index);
							const cagegoryIndex = index
							const description = currentTraceInfo.description
							console.log('description', description);
							this.setData({
								cagegoryIndex,
								description
							})
						}
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
		this.requestCagegory()
	}
})
