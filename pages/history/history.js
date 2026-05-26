const { fetchPerformHistory } = require('../../api/history')

Page({
  data: {
    isLoading: false,
    performHistory: [],
  },

  onShow() {
    this.loadPerformHistory()
  },

  onPullDownRefresh() {
    this.loadPerformHistory().finally(() => {
      wx.stopPullDownRefresh()
    })
  },

  loadPerformHistory() {
    if (this._requesting) return Promise.resolve()
    this._requesting = true
    this.setData({ isLoading: true })

    return fetchPerformHistory()
      .then((list) => {
        this.setData({ performHistory: list || [] })
      })
      .catch((err) => {
        console.error('fetchPerformHistory failed', err)
      })
      .finally(() => {
        this._requesting = false
        this.setData({ isLoading: false })
      })
  },
})
