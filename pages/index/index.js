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
		followed: false,
		followedNum: 0,
		liked: false,
		likedNum: 0
	},
	onShareAppMessage: function(res) {
		console.log('ssss', res);
		if (res.from === 'button') {
			// 来自页面内转发按钮
			console.log(res.target)
		}
		return {
			title: this.data.huaming + '花名片',
			path: `/pages/index`,
			success: (res) => {
				this.requestShare()
			},
			fail: function(res) {
				// 转发失败
				console.log('fail');
			}
		}
	},
	gotoCardInfo: function() {
		wx.navigateTo({
            url: `../cardInfo/index`
        })
	},
	gotoTag: function() {
		wx.navigateTo({
            url: `../info/index`
        })
	},
	requestLike: function() {
		if(this.data.liked) {
			this.setData({
				liked: !this.data.liked,
				likedNum: this.data.liked - 1
			})
		} else {
			this.setData({
				liked: !this.data.liked,
				likedNum: this.data.liked + 1
			})
		}
		request({
			key: 'like',
			data: {
				huamingId: this.data.huamingId
			},
			isLogin: true,
			success: (res) => {
				if(res.success) {
					if(this.data.liked) {
						this.setData({
							liked: res.data.liked,
							likedNum: res.data.likedNum
						})
					} else {
						this.setData({
							liked: res.data.liked,
							likedNum: res.data.likedNum
						})
					}
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
	requestFollow: function() {
		if(this.data.followed) {
			this.setData({
				followed: !this.data.followed,
				followedNum: this.data.followed - 1
			})
		} else {
			this.setData({
				followed: !this.data.followed,
				followedNum: this.data.followed + 1
			})
		}
		request({
			key: 'follow',
			data: {
				huamingId: this.data.huamingId
			},
			isLogin: true,
			success: (res) => {
				if(res.success) {
					if(this.data.followed) {
						this.setData({
							followed: res.data.followed,
							followedNum: res.data.followedNum
						})
					} else {
						this.setData({
							followed: res.data.followed,
							followedNum: res.data.followedNum
						})
					}
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
	requestShare: function() {
		request({
			key: 'share',
			data: {
				huamingId: this.data.huamingId
			},
			isLogin: true,
			success: (res) => {},
			fial: (res) => {
				wx.showToast({
					title: `请求服务失败`,
					mask: true
				})
			}
		})
	},
	requestCardInfo: function() {
		request({
			key: 'getHuamingAndJianghuAndTrace',
			isLogin: true,
			success: (res) => {
				if(res.success) {
					let traceList = res.data.traceList && res.data.traceList.length > 2 ? res.data.traceList.slice(0, 2) : res.data.traceList
					this.setData({
						...res.data,
						traceList
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
	onLoad: function (res) {
		this.setData({
			searchMap: res
		})
		this.requestCardInfo()
	}
})
