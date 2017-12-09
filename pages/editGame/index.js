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
		var data = {
		  multiArray: this.data.multiArray,
		  multiIndex: this.data.multiIndex
		};
		console.log('e.detail.column', e.detail);
		data.multiIndex[e.detail.column] = e.detail.value;
		// 列值
		switch (e.detail.column) {
		  case 0:
			data.multiArray[1] = this.data.nextMultiArray[data.multiIndex[0]];
			data.multiIndex[1] = 0;
			break;
		}
		this.setData(data);
	},
	requestRule: function(options = {}) {
		request({
			key: 'getJianghuCategory',
			success: (res) => {
				if(res.success) {
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
				}
				wx.hideLoading()
			},
			fial: () => {
				wx.hideLoading()
			}
		})

	},
	requestSave: function(e) {
		const nextLevelList = this.data.sourceMultiArray[this.data.multiIndex[0]].nextLevelList[this.data.multiIndex[1]]
		const params = {
			jianghuConstantId: nextLevelList.id,
			jianghuName: nextLevelList.jianghuName,
			jianghuSite: e.detail.value.jianghuSite
		}

		if(this.data.searchMap.gameId) {
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
				console.log('ddss', res);
			}
		})
	},
	onLoad: function (res) {
		this.setData({
			searchMap: res
		})
		this.requestRule()
	}
})
