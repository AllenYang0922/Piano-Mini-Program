Page({
  data: {
    // songs: [],
    // loading: false,
    songs: [
      { id: 1, title: 'Always with me' },
      { id: 2, title: 'Havana' },
      { id: 3, title: 'K歌之王' },
      { id: 4, title: 'Yesterday Once More' },
      { id: 5, title: '一场游戏一场梦' },
    ],
    playingId: null,
    queue: [],
  },

  onPlay(e) {
    const id = e.currentTarget.dataset.id
    const { playingId, queue } = this.data

    if (!playingId) {
      this.startPlay(id)
      return
    }

    if (queue.includes(id)) {
      wx.showToast({ title: '已在队列中', icon: 'none' })
      return
    }

    this.setData({ queue: queue.concat(id) })
    wx.showToast({ title: '已加入队列', icon: 'none' })
  },

  onStop() {
    this.stopAndPlayNext()
  },

  startPlay(id) {
    this.setData({ playingId: id })
    // TODO: 接上音频后在此 play，并在 onEnded 里调用 this.onCurrentEnded()
  },

  stopAndPlayNext() {
    // TODO: 接上音频后在此 stop()
    this.setData({ playingId: null })
    this.playNextInQueue()
  },

  onCurrentEnded() {
    this.setData({ playingId: null })
    this.playNextInQueue()
  },

  playNextInQueue() {
    const { queue } = this.data
    if (!queue.length) return
    const [next, ...rest] = queue
    this.setData({ queue: rest })
    this.startPlay(next)
  },

  // onShow() {
  //   // tabBar 页面热重载后 onLoad 可能不触发，在 onShow 拉取数据
  //   this.loadSongs()
  // },

  // onPullDownRefresh() {
  //   this.loadSongs().finally(() => {
  //     wx.stopPullDownRefresh()
  //   })
  // },

  // loadSongs() {
  //   if (this._requesting) return Promise.resolve()
  //   this._requesting = true
  //   this.setData({ loading: true })

  //   return fetchSongList()
  //     .then((list) => {
  //       this.setData({ songs: list || [] })
  //     })
  //     .catch((err) => {
  //       console.error('fetchSongList failed', err)
  //     })
  //     .finally(() => {
  //       this._requesting = false
  //       this.setData({ loading: false })
  //     })
  // },
})
