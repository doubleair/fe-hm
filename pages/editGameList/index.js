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
		gameList: []
	},
	gotoEditGameNew: function(e) {
		wx.navigateTo({
            url: `../editGame/index`
        })
	},
	gotoEditGame: function(e) {
		let gameId = e.currentTarget.dataset.gameid
		wx.navigateTo({
            url: `../editGame/index?gameId=${gameId}`
        })
	},
	requestCardInfo: function() {
		request({
			key: 'getHuamingAndJianghuAndTrace',
			isLogin: true,
			success: (res) => {
				if(res.success) {
					let gameList = res.data.jianghuList || []
					this.setData({
						gameList
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
	onShow: function(res) {
		this.setData({
			searchMap: res
		})
		this.requestCardInfo()
	},
	onLoad: function (res) {
		// this.setData({
		// 	searchMap: res
		// })
		// this.requestCardInfo()
	}
})
