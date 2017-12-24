//index.js
//获取应用实例
var app = getApp()
var {
	api
} = require('../../config/api.default')
const { request } = require('../../lib/request')
const urlx = require('../../lib/urlx')

let isRequest = false
let lockRequest = false

Page({
	data: {
		official: {},
		officialInfoList: [],
		page: 1,
		pageSize: 10,
		isFinish: false,
		windowWidth: 0
	},
	onPullDownRefresh: function() {
		if(isRequest) return
		if(!lockRequest) {
			lockRequest = true
			this.requestGetFollowList({
				page: 1,
				pageSize: 10,
				wxScrollType: 'top'
			})
		}
	},
	gotoInfo: function(e) {
		const huamingId = e.currentTarget.dataset.huamingid
		console.log('huamingId', e, huamingId);
		wx.navigateTo({
            url: `../info/index?huamingId=${huamingId}`
        })
	},
	requestGetFollowList: function(options = {}) {
		wx.showLoading({
			title: '加载中...',
			mask: true
		})
		const { page, pageSize, wxScrollType } = options
		if(!this.data.isFinish || wxScrollType === 'top') {
			isRequest = true
			let officialInfoList = this.data.officialInfoList
			request({
				key: 'getFollowList',
				data: {
					page: page || 1,
					pageSize: pageSize || 10
				},
				success: (res) => {
					wx.hideToast()
					if(res.success) {
						const _followList = res.data.followList || []
						let followList = this.data.followList || []
						if(wxScrollType === 'top') {
							followList = _followList
							wx.stopPullDownRefresh()
							wx.showToast({
								title: '刷新成功',
								icon: 'success',
								duration: 1200
							})
						} else {
							followList = followList.concat(_followList)
						}
						setTimeout(() => {
							isRequest = false
							this.setData({
								page: page,
								pageSize: pageSize,
								followList: followList,
								isFinish: _followList.length === 0
							})
							lockRequest = false
						})
					}
				}
			})
		}
		wx.hideLoading()
	},
	requestFollow: function(e) {
		const index = e.target.dataset.index
		const huamingId = e.target.dataset.huamingid
		const followList = this.data.followList
		const followInfo = followList[index]

		followList[index].hasNotFollow = !followInfo.hasNotFollow
		this.setData({
			followList
		})

		request({
			key: 'follow',
			data: {
				huamingId: huamingId
			},
			isLogin: true,
			success: (res) => {
				if(res.success) {
					followList[index].hasNotFollow = !res.data.followed
					this.setData({
						followList
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
	onReachBottom: function(e) {
		if(isRequest) return
		if(!lockRequest) {
			this.requestGetFollowList({
				page: this.data.page + 1,
				pageSize: this.data.pageSize
			})
		}
	},
	onLoad: function (res) {
		this.setData({
			searchMap: res
		})
		this.requestGetFollowList({
			page: 1, 
			pageSize: 10,
		})
		
	}
})
