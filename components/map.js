let map
let currentMode = "clima"
let fossilMarkers = []
let tileLayer = null
let geoLayerRef = null

const WORLD_BOUNDS = [[-90, -180], [90, 180]]

const TILES = {
    normal: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    dino: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
}

function makeTile(mode) {
    if (mode === "dino") {
        return L.tileLayer(TILES.dino, {
            attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
            subdomains: 'abcd',
            noWrap: true,
            bounds: WORLD_BOUNDS
        })
    }
    return L.tileLayer(TILES.normal, {
        attribution: '&copy; OpenStreetMap contributors',
        noWrap: true,
        bounds: WORLD_BOUNDS
    })
}

export function initMap(onCountryClick, onWeatherClick, onDinoClick) {
    map = L.map('map', {
        maxBounds: WORLD_BOUNDS,
        maxBoundsViscosity: 1.0,
        minZoom: 2
    }).setView([-14.235, -51.9253], 2)

    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    })

    tileLayer = makeTile("normal").addTo(map)

    map.on("click", (e) => {
        if (currentMode !== "clima") return
        onWeatherClick({ lat: e.latlng.lat, lng: e.latlng.lng })
    })

    fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
        .then(res => res.json())
        .then(data => {
            geoLayerRef = L.geoJSON(data, {
                style: {
                    fillColor: "transparent",
                    color: "green",
                    weight: 0.5,
                    fillOpacity: 0
                },
                onEachFeature: (feature, layer) => {
                    layer.on("mouseover", () => layer.setStyle({ fillColor: "gold", fillOpacity: 0.3 }))
                    layer.on("mouseout", () => layer.setStyle({ fillColor: "transparent", fillOpacity: 0 }))
                    layer.on("click", () => {
                        const info = { name: feature.properties.name, code: feature.properties.iso_a2 }
                        if (currentMode === "economia") onCountryClick(info)
                        else if (currentMode === "dino") onDinoClick(info)
                    })
                }
            }).addTo(map)
        })
}

export function setMapMode(mode) {
    currentMode = mode
    if (!map || !tileLayer) return

    map.removeLayer(tileLayer)
    tileLayer = makeTile(mode).addTo(map)

    if (geoLayerRef) {
        geoLayerRef.setStyle({
            interactive: mode !== "dino"
        })
        geoLayerRef.bringToFront()
    }
}

export function flyTo(lat, lng, zoom = 6) {
    map.flyTo([lat, lng], zoom)
}

const PERIOD_COLORS = {
    "Cretaceous": "#6EC6A0",
    "Jurassic": "#A8D8A8",
    "Triassic": "#F4A460",
    "Permian": "#CD853F",
    "Carboniferous": "#8FBC8F",
    "Devonian": "#DEB887",
    "Silurian": "#87CEEB",
    "Ordovician": "#4682B4",
    "Cambrian": "#F0E68C",
}

function getColor(period) {
    if (!period) return "#CCCCCC"
    for (const [key, color] of Object.entries(PERIOD_COLORS)) {
        if (period.includes(key)) return color
    }
    return "#FFDD88"
}

export function plotarFosseis(fosseis, onFossilClick) {
    fossilMarkers.forEach(m => map.removeLayer(m))
    fossilMarkers = []

    fosseis.forEach(f => {
        if (!f.lng || !f.lat) return

        const color = getColor(f.eag)

        const marker = L.circleMarker([f.lat, f.lng], {
            radius: 7,
            fillColor: "gold",
            color: "#333",
            weight: 1,
            fillOpacity: 0.85
        })
            .bindTooltip(f.tna ?? "Fóssil", {
            direction: "top",
            className: "fossil-tooltip"
        })

        marker.on("click", (e) => {
            L.DomEvent.stopPropagation(e)
            if (onFossilClick) onFossilClick(f)
        })

        marker.addTo(map)
        fossilMarkers.push(marker)
    })
}
