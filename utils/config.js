/** 接口与环境配置 */
const config = {
  baseUrl: 'https://robotsolution.cn:1235/dj-prod-api',
  timeout: 15000,
  useMock: false,
  /** 鉴权头字段名：X-Auth-Token（token 存于 wx.storage 的 key 为 token） */
  /** 业务接口路径（相对 baseUrl，由 request 自动拼接） */
  api: {
    pianoHistory: '/piano/history',
    pianoList: '/piano/list',
  },
}

module.exports = config
