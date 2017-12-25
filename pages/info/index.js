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
		likedNum: 0
	},
	onShareAppMessage: function(res) {
		if (res.from === 'button') {
			// 来自页面内转发按钮
			console.log(res.target)
		}
		return {
			title: this.data.huaming + '花名签',
			path: `/pages/info/index`,
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
	handleBigPic: function(e) {
		const src = e.currentTarget.dataset.src
		wx.previewImage({
			current: 1, // 当前显示图片的http链接
			urls: [src] // 需要预览的图片http链接列表
		})
	},
	handleCP: function(e) {
		const url = e.currentTarget.dataset.url
		wx.setClipboardData({
			data: url,
			success: function(res) {
				wx.getClipboardData({
					success: function(res) {
						console.log(res.data) // data
					}
				})
				wx.showModal({
					title: '提示：已复制应用地址',
					content: '由于小程序限制，无法直接打开页面，请使用电脑/手机浏览器访问！',
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击确定')
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			}
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
		const params = {}
		const searchMap = this.data.searchMap || {}
		console.log('dddss', this.data);
		if(searchMap.huamingId) {
			params.huamingId = searchMap.huamingId
		}
		request({
			key: 'getHuamingAndJianghuAndTrace',
			isLogin: true,
			data: params,
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
	onShow: function (res) {
		this.requestCardInfo()
	},
	onLoad: function(res) {
		this.setData({
			searchMap: res
		})
	}
})
