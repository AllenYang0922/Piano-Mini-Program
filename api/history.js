const { request } = require('../utils/request')
const { useMock, api } = require('../utils/config')

const MOCK_HISTORY = [
  {
    id: 1,
    pieceName: 'Always with me',
    startedAt: '2026-05-26T10:30:00',
    success: true,
  },
  {
    id: 2,
    pieceName: 'Havana',
    startedAt: '2026-05-26T09:15:00',
    success: false,
  },
  {
    id: 3,
    pieceName: 'K歌之王',
    startedAt: '2026-05-25T20:00:00',
    success: true,
  },
]

function formatStartedAt(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleString('zh-CN')
}

function normalizePerformHistory(payload) {
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
      const id =
        item.id ??
        item.seq ??
        item.index ??
        item.no ??
        item.recordId ??
        index + 1
      const pieceName =
        item.pieceName ??
        item.title ??
        item.songName ??
        item.name ??
        item.song ??
        item.musicName ??
        ''
      const startedAt =
        item.startedAt ??
        item.startTime ??
        item.createdAt ??
        item.time ??
        item.playTime ??
        ''
      const success =
        item.success ??
        item.isSuccess ??
        item.result ??
        (item.status === 'success' || item.status === 1)

      return {
        id,
        pieceName: String(pieceName),
        startedAt,
        startedAtText: formatStartedAt(startedAt),
        success: Boolean(success),
        successText: success ? '成功' : '失败',
      }
    })
    .filter((item) => item.pieceName)
}

/** 获取演奏历史记录 */
function fetchPerformHistory() {
  if (useMock) {
    return Promise.resolve(normalizePerformHistory(MOCK_HISTORY))
  }
  return request({
    url: api.pianoHistory,
    method: 'GET',
    data: { limit: 100 },
  }).then(normalizePerformHistory)
}

module.exports = {
  fetchPerformHistory,
}
