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
	// bindEditSubmit: function (e) {
	// 	const traceId = this.data.searchMap.traceId
	// 	request({
	// 		key: 'infoUpdate',
	// 		data: {
	// 			type: 'mark',
	// 			value: JSON.stringify({
	// 				traceId: traceId,
	// 				description: '攻守道'
	// 			})
	// 		},
	// 		isLogin: true,
	// 		success: (res) => {
	// 			console.log('ddss', res);
	// 		},
	// 		fial: () => {
	// 		}
	// 	})
	// },
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
					traceList.forEach((data) => {
						if(Number(this.data.searchMap.traceId) === data.id) {
							currentTraceInfo = data
						}
					})

					// 查询行业下标
					this.data.sourceCagegoryList.forEach((data, index) => {
						if(data.id === currentTraceInfo.traceConstantId) {
							const cagegoryIndex = index
							const description = currentTraceInfo.description
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
	requestRemove: function() {
		wx.showActionSheet({
			itemList: ['确认删除'],
			itemColor: '#FF0000',
			success: (res) => {
				if(res.tapIndex === 0) {
					const traceId = this.data.searchMap.traceId
					// 数据删除
					if(traceId) {
						request({
							key: 'removeTrace',
							isLogin: true,
							data: {
								traceId: this.data.searchMap.traceId
							},
							success: (res) => {
								if(res.success) {
									wx.showToast({
										title: '操作成功！',
										mask: true,
										success: () => {
											console.log('fdff', getCurrentPages(), getCurrentPages().length);
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
					}
					// 回退
					else {
						wx.navigateBack({
							delta: 1
						})
					}
				}
			},
			fail: function(res) {
			  	console.log(res.errMsg)
			}
		})
	},
	requestSave: function(e) {
		wx.showLoading({
			title: '加载中...',
			mask: true
		})
		const params = {
			traceConstantId: this.data.sourceCagegoryList[this.data.cagegoryIndex].id,
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
						title: '操作成功！',
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
				wx.hideLoading()
			},
			fail: () => {
				wx.hideLoading()
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
