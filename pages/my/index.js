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
	// gotoMyOfficialDetail: function() {
	// 	wx.navigateTo({
    //         url: `../myOfficialDetail/index?officialId=${this.data.userInfo.officialId}`
    //     })
	// },
	// gotoMyOfficialApply: function() {
	// 	wx.navigateTo({
    //         url: `../myOfficialApply/index`
    //     })
	// },
    // gotoSend: function(e) {
    //     wx.navigateTo({
    //         url: `../send/index`
    //     })
	// },
	// gotoMyOfficialInfoList: function(e) {
	// 	const { officialId } = this.data.userInfo
	// 	wx.navigateTo({
    //         url: `../myOfficialInfoList/index?officialId=${officialId}`
    //     })
	// },
	// gotoMyDynamic: function(e) {
	// 	wx.navigateTo({
    //         url: `../myDynamic/index`
    //     })
	// },
	// onPullDownRefresh: function() {
	// 	if(isRequest) return
	// 	if(!lockRequest) {
	// 		lockRequest = true
	// 		this.requestRule({
	// 			wxScrollType: 'top'
	// 		})
	// 	}
	// },
	handleBigPic: function(e) {
		const src = e.currentTarget.dataset.src
		wx.previewImage({
			current: 1, // 当前显示图片的http链接
			urls: [src] // 需要预览的图片http链接列表
		})
	},
	requestRule: function(options = {}) {
		const { wxScrollType } = options
		wx.showLoading({
			title: '加载中...',
			mask: true
		})
		getEnhanceUserInfo((wxSessionCode, userInfo) => {
			this.setData({
				userInfo
			})
			this.setData({
				userInfo: {
					...userInfo,
				}
			})
			wx.hideLoading()
		}, (res) => {
			wx.hideLoading()
		})
	},
	onLoad: function (res) {
		this.setData({
			searchMap: res
		})
		this.requestRule()
	}
})
