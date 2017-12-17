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
		huaming: '',
		description: '',
		jianghuList: [],
		jianghuFE: [],
		traceList: [],
		traceFE: []
	},
	gotoEditNick: function() {
		wx.navigateTo({
            url: `../editNick/index`
        })
	},
	gotoEditIntroduction: function() {
		wx.navigateTo({
            url: `../editIntroduction/index`
        })
	},
	gotoEditGameList: function() {
		wx.navigateTo({
            url: `../editGameList/index`
        })
	},
	gotoEditTraceList: function() {
		wx.navigateTo({
            url: `../editTraceList/index`
        })
	},
	requestRule: function(options = {}) {
		const { wxScrollType } = options
		wx.showLoading({
			title: '加载中...',
			mask: true
		})

		request({
			key: 'getHuamingAndJianghuAndTrace',
			isLogin: true,
			success: (res) => {
				if(res.success) {

					let jianghuFE = res.data.jianghuList ? res.data.jianghuList.map((data) => {
						return data.jianghuName
					}) : []

					let traceFE = res.data.traceList ? res.data.traceList.map((data) => {
						return data.description
					}) : []
					this.setData({
						...res.data,
						traceFE: traceFE.join('、'),
						jianghuFE: jianghuFE.join('、')
					})

				}
				wx.hideLoading()
			},
			fial: (res) => {
				wx.hideLoading()
			}
		})
	},
	onLoad: function (res) {
		this.setData({
			urlParams: res
		})
		this.requestRule()
	}
})
