//index.js
//获取应用实例
var app = getApp()
var { api } = require('../../config/api.default')
const { getEnhanceUserInfo } = require('../../lib/authorize')
const { request } = require('../../lib/request')

Page({
	data: {
		userInfo: {},
		multiArray: [],
		multiIndex: [0, 0],
		jianghuConstantId: 0,
		searchMap: {}
	},
	bindMultiPickerChange: function (e) {
		const { sourceMultiArray } = this.data
		const jianghuConstantId = sourceMultiArray[e.detail.value[0]].nextLevelList[e.detail.value[1]].id

		this.setData({
			multiIndex: e.detail.value,
			jianghuConstantId
		})
	},
	bindMultiPickerColumnChange: function (e) {
		this.handleChangePicker({
			column: e.detail.column,
			value: e.detail.value
		})
	},
	handleChangePicker: function (options) {
		const { column, value } = options
		const data = {
			multiArray: this.data.multiArray,
			multiIndex: this.data.multiIndex
		};
		// console.log('e.detail.column', e.detail);
		data.multiIndex[column] = value;
		// 列值
		switch (column) {
			case 0:
				data.multiArray[1] = this.data.nextMultiArray[data.multiIndex[0]];
				data.multiIndex[1] = 0;
				break;
		}
		this.setData(data);
	},
	requestCategory: function (options = {}) {
		request({
			key: 'getJianghuCategory',
			success: (res) => {
				if (res.success) {
					let sourceMultiArray = res.data
					let currentMultiArray = []
					let nextMultiArray = []
					currentMultiArray = sourceMultiArray.map((data, i) => {
						nextMultiArray.push(data.nextLevelList.map((nextData, j) => {
							return nextData.jianghuName
						}))
						return data.jianghuName
					})
					let multiArray = [currentMultiArray, nextMultiArray[0]]
					this.setData({
						multiArray,
						currentMultiArray,
						nextMultiArray,
						sourceMultiArray
					})
					this.requestCardInfo()
				}
				wx.hideLoading()
			},
			fial: () => {
				wx.hideLoading()
			}
		})
	},
	requestCardInfo: function () {
		request({
			key: 'getHuamingAndJianghuAndTrace',
			isLogin: true,
			success: (res) => {
				if (res.success) {
					let jianghuList = res.data.jianghuList
					let currentGameInfo = {}
					// 查询目标江湖信息
					jianghuList.forEach((data) => {
						if (Number(this.data.searchMap.gameId) === data.id) {
							currentGameInfo = data
						}
					})
					let topIndex = 0
					let nextIndex = 0
					let isFind = false
					const sourceMultiArray = this.data.sourceMultiArray
					// 查询行业下标一级
					for (let i = 0, l = sourceMultiArray.length; i < l; i++) {
						const topCatetory = sourceMultiArray[i]
						topIndex = i
						// 查询行业下标二级
						for (let n = 0, m = topCatetory.nextLevelList.length; n < m; n++) {
							const nextCatetory = topCatetory.nextLevelList[n]
							nextIndex = n
							if (nextCatetory.id === currentGameInfo.jianghuConstantId) {
								isFind = true
								break
							}
						}
						if (isFind) {
							break
						}
					}

					const multiArray = this.data.multiArray
					multiArray[1] = this.data.nextMultiArray[topIndex]
					this.setData({
						multiArray,
						multiIndex: [topIndex, nextIndex],
						jianghuSite: currentGameInfo.jianghuSite
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
	requestSave: function (e) {
		const nextLevelList = this.data.sourceMultiArray[this.data.multiIndex[0]].nextLevelList[this.data.multiIndex[1]]
		const params = {
			jianghuConstantId: nextLevelList.id,
			// jianghuName: nextLevelList.jianghuName,
			jianghuSite: e.detail.value.jianghuSite
		}

		if (this.data.searchMap.gameId) {
			params.id = this.data.searchMap.gameId
		}
		request({
			key: 'infoUpdate',
			isLogin: true,
			data: {
				type: 'jianghu',
				value: JSON.stringify(params)
			},
			success: (res) => {
				if (res.success) {
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
		this.requestCategory()
	}
})
