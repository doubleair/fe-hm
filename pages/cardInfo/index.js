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
		jianghu: [],
		jianghuFE: [],
		trace: [],
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
	gotoEditGame: function() {
		wx.navigateTo({
            url: `../editGame/index`
        })
	},
	gotoEditTrace: function() {
		wx.navigateTo({
            url: `../editTrace/index`
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

					let jianghuFE = res.data.jianghu && res.data.jianghu.map((data) => {
						return data.jianghuSite
					})

					let traceFE = res.data.trace && res.data.trace.map((data) => {
						// console.log('dadsa', data);
						return data.description
					})
					// console.log('dasds', jianghuFE, traceFE);
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
