import apiConfig from "../config/apiConfig.js"

const newsService = {
    async get(nome) {
        const { key, baseUrl } = apiConfig.gnews

        try {
            const res = await fetch(
                `${baseUrl}/search?q=${encodeURIComponent(nome)}&lang=pt&max=5&token=${key}`
            )

            if (res.status === 429) {
                return [{ titulo: "Limite de requisições atingido. Tente novamente em alguns minutos.", url: "#", fonte: "GNews" }]
            }

            if (!res.ok) {
                return [{ titulo: "Erro ao carregar notícias.", url: "#", fonte: "GNews" }]
            }

            const data = await res.json()

            if (!data.articles || data.articles.length === 0) {
                return ["Nenhuma notícia encontrada."]
            }

            return data.articles.map(article => ({
                titulo: article.title,
                url: article.url,
                fonte: article.source.name
            }))

        } catch (err) {
            console.warn("newsService error:", err)
            return ["Não foi possível carregar as notícias."]
        }
    }
}

export default newsService