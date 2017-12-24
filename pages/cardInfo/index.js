//index.js
//获取应用实例
var app = getApp()
var { api } = require('../../config/api.default')
const { getEnhanceUserInfo } = require('../../lib/authorize')
const { request, uploadFile } = require('../../lib/request')

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
		traceFE: [],
		avatarUrl: ''
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
	gotoEditTag: function() {
		wx.navigateTo({
            url: `../editTag/index`
        })
	},
	uploadPic: function() {
		wx.chooseImage({
			count: 1,
			sizeType: ['compressed'],
			success: (res) => {
				const tempFilePaths = res.tempFilePaths
				uploadFile({
					key: 'uploadAvatar',
					filePath: tempFilePaths[0],
					isLogin: true,
					success: (res) => {
						if(res.success) {
							console.log('dddsss', res.data.avatarUrl);
							this.setData({
								avatarUrl: res.data.avatarUrl
							})
						}
					}
				})
			}
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

					let tagFE = res.data.labelList ? res.data.labelList.map((data) => {
						return `# ${data.label} #`
					}) : []

					this.setData({
						...res.data,
						traceFE: traceFE.join('、'),
						jianghuFE: jianghuFE.join('、'),
						tagFE: tagFE.join('、')
					})

				}
				wx.hideLoading()
			},
			fial: (res) => {
				wx.hideLoading()
			}
		})
	},
	onShow: function(res) {
		this.setData({
			searchMap: res
		})
		getEnhanceUserInfo((code, userInfo) => {
			this.setData({
				...userInfo,
				huaming: userInfo.nickName
			})
		})
		this.requestRule()
	}
})
