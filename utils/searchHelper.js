export async function buscar(query) {
    const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=6`,
        { headers: { "Accept-Language": "pt-BR" } }
    )
    const data = await res.json()

    return data.map(item => ({
        nome: item.display_name,
        tipo: classificar(item.addresstype),
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon)
    }))
}

function classificar(addresstype) {
    if (addresstype === "country") return "País"
    if (addresstype === "state")   return "Estado"
    if (["city", "town", "village", "municipality"].includes(addresstype)) return "Cidade"
    return "Local"
}