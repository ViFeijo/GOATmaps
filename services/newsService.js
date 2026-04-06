import apiConfig from "../config/apiConfig.js"

const newsService = {
    async get(nome) {
        const { key, baseUrl } = apiConfig.gnews

        const res = await fetch(
            `${baseUrl}/search?q=${encodeURIComponent(nome)}&lang=pt&max=5&token=${key}`
        )
        const data = await res.json()

        if (!data.articles || data.articles.length === 0) {
            return ["Nenhuma notícia encontrada."]
        }

        return data.articles.map(article => ({
            titulo: article.title,
            url: article.url,
            fonte: article.source.name
        }))
    }
}

export default newsService