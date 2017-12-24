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
		followed: false,
		followedNum: 0,
		liked: false,
		likedNum: 0,
		avatarUrl: ''
	},
	onShareAppMessage: function(res) {
		if (res.from === 'button') {
			// 来自页面内转发按钮
			console.log(res.target)
		}
		return {
			title: this.data.huaming + '花名片',
			path: `/pages/info/index?huamingId=${this.data.huamingId}`,
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
	gotoAddTag: function() {
		wx.navigateTo({
            url: `../addTag/index?huamingId=${this.data.huamingId}`
        })
	},
	gotoEditTraceList: function() {
		wx.navigateTo({
            url: `../editTraceList/index`
        })
	},
	gotoEditGameList: function() {
		wx.navigateTo({
            url: `../editGameList/index`
        })
	},
	gotoAddTag: function() {
		wx.navigateTo({
            url: `../addTag/index`
        })
	},
	requestLike: function() {
		if(this.data.liked) {
			this.setData({
				liked: !this.data.liked,
				likedNum: this.data.likedNum - 1
			})
		} else {
			this.setData({
				liked: !this.data.liked,
				likedNum: this.data.likedNum + 1
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
					this.setData({
						liked: res.data.liked,
						likedNum: res.data.likedNum
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
	requestLabelLike: function(e) {
		const labelList = this.data.labelList
		const labelListTemp = this.data.labelList
		const index = e.currentTarget.dataset.index
		if(this.data.labelList[index].liked) {
			labelList[index].liked = !labelList[index].liked
			labelList[index].likedNum = labelList[index].likedNum - 1
			this.setData({
				labelList
			})
		} else {
			labelList[index].liked = !labelList[index].liked
			labelList[index].likedNum = labelList[index].likedNum + 1
			this.setData({
				labelList
			})
		}
		request({
			key: 'labelLike',
			data: {
				huamingId: this.data.huamingId,
				labelId: e.currentTarget.dataset.tagid
			},
			isLogin: true,
			success: (res) => {
				if(res.success) {
					labelListTemp[index].liked = res.data.liked
					labelListTemp[index].likedNum = res.data.likedNum
					this.setData({
						labelList: labelListTemp
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
		wx.showLoading({
			title: '加载中...',
			mask: true
		})
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
				wx.hideLoading()
			},
			fial: (res) => {
				wx.showToast({
					title: `请求服务失败`,
					mask: true
				})
				wx.hideLoading()
			}
		})
	},
	// onshow: function(res) {
	// 	var appInstance = getApp()
	// 	this.setData({ courseItems: appInstance.gCourse })
	// },
	onShow: function (res) {
		this.setData({
			searchMap: res
		})
		this.requestCardInfo()
	}
})
