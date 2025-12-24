const API_URL = 'http://localhost:8000/api'

class AnimeAPI {
  async search(title, limit = 12) {
    const res = await fetch(`${API_URL}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, limit }),
    })
    if (!res.ok) throw new Error('Ошибка поиска')
    const data = await res.json()
    return data.results
  }

  async getTrending(limit = 12) {
    const res = await fetch(`${API_URL}/trending?limit=${limit}`)
    if (!res.ok) throw new Error('Ошибка загрузки')
    const data = await res.json()
    return data.results
  }

  async getAnimeDetails(id) {
    const res = await fetch(`${API_URL}/anime/${id}`)
    if (!res.ok) throw new Error('Аниме не найдено')
    return await res.json()
  }

  async getVideoM3u8(id, episode, translationId, quality = 720) {
    const res = await fetch(`${API_URL}/video/${id}/${episode}/${translationId}?quality=${quality}`)
    if (!res.ok) throw new Error('Видео недоступно')
    const data = await res.json()
    return data.m3u8_url
  }
}

export const animeApi = new AnimeAPI()
