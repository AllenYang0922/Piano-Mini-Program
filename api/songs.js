const { request } = require('../utils/request')
const { useMock, api } = require('../utils/config')

const MOCK_SONGS = [
  { id: 1, title: 'Always with me' },
  { id: 2, title: 'Havana' },
  { id: 3, title: 'K歌之王' },
  { id: 4, title: 'Yesterday Once More' },
  { id: 5, title: '一场游戏一场梦' },
]

/** 将接口数据转为页面使用的 { id, title } */
function normalizeSongList(payload) {
  let list = payload
  if (payload && !Array.isArray(payload)) {
    list =
      payload.data ??
      payload.records ??
      payload.list ??
      payload.rows ??
      payload.history ??
      payload.items ??
      []
  }
  if (!Array.isArray(list)) return []

  return list
    .map((item, index) => {
      if (typeof item === 'string') {
        return { id: index + 1, title: item }
      }
      const id =
        item.id ??
        item.seq ??
        item.index ??
        item.no ??
        item.songId ??
        item.musicId ??
        index + 1
      const title =
        item.title ??
        item.songName ??
        item.name ??
        item.song ??
        item.musicName ??
        item.pieceName ??
        item.displayName ??
        ''
      return { id, title: String(title) }
    })
    .filter((item) => item.title)
}

/** 获取歌曲清单 */
function fetchSongList() {
  if (useMock) {
    return Promise.resolve(MOCK_SONGS)
  }
  return request({
    url: api.pianoList,
    method: 'GET',
  }).then(normalizeSongList)
}

module.exports = {
  fetchSongList,
}
