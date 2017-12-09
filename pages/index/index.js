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
	},
	onShareAppMessage: function(res) {
		if (res.from === 'button') {
			// 来自页面内转发按钮
			console.log(res.target)
		}
		return {
			title: '小八八发送了「小九九」',
			path: `/pages/index`,
			success: (res) => {
				
			},
			fail: function(res) {
				// 转发失败
				console.log('fail');
			}
		}
	},
	gotoMyOfficialDetail: function() {
		wx.navigateTo({
            url: `../myOfficialDetail/index?officialId=${this.data.userInfo.officialId}`
        })
	},
	gotoMyOfficialApply: function() {
		wx.navigateTo({
            url: `../myOfficialApply/index`
        })
	},
    gotoSend: function(e) {
        wx.navigateTo({
            url: `../send/index`
        })
	},
	gotoEdit: function(e) {
		wx.navigateTo({
            url: `../edit/index`
        })
	},
	gotoMyOfficialInfoList: function(e) {
		const { officialId } = this.data.userInfo
		wx.navigateTo({
            url: `../myOfficialInfoList/index?officialId=${officialId}`
        })
	},
	gotoMyDynamic: function(e) {
		wx.navigateTo({
            url: `../myDynamic/index`
        })
	},
	requestRule: function(options = {}) {
		wx.showLoading({
			title: '加载中...',
			mask: true
		})
		getEnhanceUserInfo((wxSessionCode, userInfo) => {
			request({
				key: 'login',
				data: {
					...userInfo,
				},
				isLogin: true,
				success: (res) => {
					console.log('ddss', res);
					if(res.code === 200) {
						this.setData({
							userInfo: {
								...userInfo,
								...res.data.userInfo
							}
						})
						if(res.data.userInfo.officialId) {
							request({
								key: 'officialGetOfficialDetail',
								isLogin: true,
								data: {
									officialId: res.data.userInfo.officialId
								},
								success: (res) => {
									if(res.code === 200) {
										setTimeout(() => {
											isRequest = false
											this.setData({
												officialInfo: res.data.officialInfo,
											})
											lockRequest = false
										})
									} else {
										wx.showToast({
											title: '加载失败',
											icon: 'fial',
											duration: 1200
										})
									}
								}
							})
						}
					}
				},
				fial: () => {
				}
			})
			wx.hideLoading()
		}, (res) => {
			wx.hideLoading()
		})
	},
	onLoad: function (res) {
		this.setData({
			urlParams: res
		})
		this.requestRule()
	}
})
