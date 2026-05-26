const { baseUrl, timeout } = require('./config')

const SUCCESS_CODES = [0, 200, '0', '200']

function isBusinessSuccess(body) {
  if (body == null || typeof body !== 'object') return true
  if (body.code === undefined && body.status === undefined) return true
  const code = body.code !== undefined ? body.code : body.status
  return SUCCESS_CODES.includes(code)
}

function unwrapBody(body) {
  if (Array.isArray(body)) return body
  if (body == null || typeof body !== 'object') return body
  return body.data ?? body.result ?? body.records ?? body.list ?? body.rows ?? body
}

/** 鉴权请求头：X-Auth-Token */
function buildAuthHeaders(token) {
  const t = (token || '').trim()
  if (!t) return {}
  return { 'X-Auth-Token': t }
}

/**
 * 统一请求封装
 */
function request(options) {
  const {
    url,
    method = 'GET',
    data = {},
    header = {},
    showError = true,
    rawResponse = false,
  } = options

  // const token = wx.getStorageSync('token') || ''
  const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ3b3Jrc3BhY2VfaWQiOiJhM2NiMmRlMy1jOGMyLTQ4YWItOTE3MS1hYjI3Y2E1NDhiZWQiLCJzdWIiOiJ1YXZfZGtzbF9iYWNrIiwidXNlcl90eXBlIjoiMSIsIm5iZiI6MTc3OTcwMDA1OCwibG9nIjoiTG9nZ2VyW2NvbS5kamkuc2FtcGxlLmNvbW1vbi5tb2RlbC5DdXN0b21DbGFpbV0iLCJpc3MiOiJLRksiLCJpZCI6IjIwMGY5NjU3LTlhMWItNDgwMy1iODFlLWE3NzYyZjM2Y2M4OCIsInRhZyI6IjEwNSIsImV4cCI6MTc3OTc4NjQ1OCwiaWF0IjoxNzc5NzAwMDU4LCJ1c2VybmFtZSI6ImFkbWluIiwicmVnaW9uX2NvZGUiOiI4NiJ9.TlVSe6-LeWuDgya91vNaB2Qc5uS47vLPfH1nRXxFDRY'
  console.log('token: ', token);
  const requestUrl = url.startsWith('http') ? url : `${baseUrl}${url}`
  const authHeader = buildAuthHeaders(token)

  return new Promise((resolve, reject) => {
    wx.request({
      url: requestUrl,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...authHeader,
        ...header,
      },
      timeout,
      success(res) {
        const { statusCode } = res
        const body = res.data

        if (statusCode < 200 || statusCode >= 300) {
          if (showError) {
            wx.showToast({ title: `请求失败(${statusCode})`, icon: 'none' })
          }
          reject(res)
          return
        }

        if (rawResponse) {
          resolve(body)
          return
        }

        if (!isBusinessSuccess(body)) {
          if (showError) {
            const msg =
              (body && (body.message || body.msg || body.error)) || '请求失败'
            wx.showToast({ title: msg, icon: 'none' })
          }
          reject(body)
          return
        }

        resolve(unwrapBody(body))
      },
      fail(err) {
        if (showError) {
          wx.showToast({ title: '网络连接失败', icon: 'none' })
        }
        reject(err)
      },
    })
  })
}

function get(url, data, options = {}) {
  return request({ ...options, url, data, method: 'GET' })
}

function post(url, data, options = {}) {
  return request({ ...options, url, data, method: 'POST' })
}

module.exports = {
  request,
  get,
  post,
}
