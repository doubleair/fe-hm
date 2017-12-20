// exports.host = 'http://127.0.0.1:7001'

const apiMap = {
    login: 'huaming/user/login',
    infoUpdate: 'huaming/huamingInfo/update',
    getTraceCategory: 'huaming/huamingInfo/getTraceCategory',
    getJianghuCategory: 'huaming/huamingInfo/getJianghuCategory',
    getHuamingAndJianghuAndTrace: 'huaming/huamingInfo/getHuamingAndJianghuAndTrace',
    getHuamingInfo: 'huaming/huamingInfo/getHuamingInfo',
    like: 'huaming/activity/like',
    follow: 'huaming/activity/follow',
    getFollowList: 'huaming/activity/getFollowList',
    share: 'huaming/activity/share',
    addLabel: 'huaming/huamingInfo/addLabel',
    removeLabel: 'huaming/huamingInfo/removeLabel',
    labelLike: 'huaming/huamingInfo/labelLike',
    // userValid: '/rest/official/user/valid',
    // infoCreate: '/rest/official/info/create',
    // infoGet: '/rest/official/info/get',
    // infoDelete: '/rest/official/info/delete',
    // infoGetOfficialAndOfficialInfoList: '/rest/official/info/getOfficialAndOfficialInfoList',
    // infoGetUserFocusOfficialInfoList: '/rest/official/info/getUserFocusOfficialInfoList',
    // infoGetOfficialInfoList: '/rest/official/info/getOfficialInfoList',
    // infoSetOfficialInfo: '/rest/official/info/setOfficialInfo',
    // getTimeList: '/rest/official/info/getTimeList',
    // dynamicInfoSupport: '/rest/official/dynamic/infoSupport',
    // dynamicInfoShare: '/rest/official/dynamic/infoShare',
    // dynamicFocus: '/rest/official/dynamic/focus',
    // dynamicGetList: '/rest/official/dynamic/getList',
    // circleGetListAndOfficialCount: '/rest/official/circle/getListAndOfficialCount',
    // officialCreate: '/rest/official/create',
    // officialGetList: '/rest/official/getList',
    // officialGetOfficialDetail: '/rest/official/getOfficialDetail',
    // officialSetOfficialInfo: '/rest/official/setOfficialInfo',
    // getWxSession: '/rest/official/user/getWxSession',
    // officialUploadOfficialPic: '/rest/official/uploadOfficialPic'
    // createOrUpdateUser: '/rest/official/createOrUpdateUser',
    // getCircleListAndOfficialCount: '/rest/official/getCircleListAndOfficialCount',
    // getOfficialList: '/rest/official/getOfficialList',
}

exports.api = (options) => {
    const { key } = options
    let host = 'https://14henry.top/'
    // let host = 'https://api.ico.ieee.top'
    // let host = 'http://127.0.0.1:7001'
    return host + apiMap[key]
}
