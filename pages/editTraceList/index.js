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
		multiArray: [['影视', '音乐', '体育', '游戏'], ['知乎', '微博', '豆瓣', '简说']],
		multiIndex: [0, 0],
		array: ['影视', '音乐', '体育', '游戏'],
		index: 0,
		markList: []
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
	gotoMark: function(e) {
		console.log('eeee', e);
        wx.navigateTo({
            url: `../editMark/index?markId=${e}`
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
	bindMultiPickerChange: function (e) {
		console.log('picker发送选择改变，携带值为', e.detail.value)
		this.setData({
		  multiIndex: e.detail.value
		})
	},
	bindPickerChange: function(e) {
		console.log('picker发送选择改变，携带值为', e.detail.value)
		this.setData({
		  index: e.detail.value
		})
	},
	bindMultiPickerColumnChange: function (e) {
		console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
		var data = {
		  multiArray: this.data.multiArray,
		  multiIndex: this.data.multiIndex
		};
		data.multiIndex[e.detail.column] = e.detail.value;
		// 列值
		switch (e.detail.column) {
		  case 0:
			switch (data.multiIndex[0]) {
			  case 0:
				data.multiArray[1] = ['天猫/淘宝', '京东', '环节动物', '软体动物', '节肢动物'];
				break;
			  case 1:
				data.multiArray[1] = ['鱼', '两栖动物', '爬行动物'];
				break;
			}
			data.multiIndex[1] = 0;
			break;
		}
		this.setData(data);
	},
	requestRule: function(options = {}) {
		const { wxScrollType } = options
		wx.showLoading({
			title: '加载中...',
			mask: true
		})
		request({
			key: 'getMarkCategory',
			isLogin: true,
			success: (res) => {
				console.log('asda', res);
				if(res.success) {
					const markList = res.data.data
					this.setData({
						markList
					})
				}
				wx.hideLoading()
			},
			fial: () => {
				console.log('dasdasdas');
				wx.hideLoading()
			}
		})
	},
	onshow: function() {
		this.setData({
			urlParams: res
		})
		this.requestRule()
	},
	onLoad: function (res) {
		this.setData({
			urlParams: res
		})
		this.requestRule()
	}
})
