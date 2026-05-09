// Initialize map
let map;
let layers = {};
let timeline;
let isPlaying = false;
let playInterval;

// Western North Carolina coordinates
const westernNC = {
    center: [35.7596, -82.5541],
    bounds: [[34.5, -84.5], [37.0, -80.5]]
};

// Hurricane Helene data
const heleneData = {
    path: [
        {lat: 25.0, lng: -82.0, time: '2024-09-24T00:00:00Z', windSpeed: 75, pressure: 980},
        {lat: 26.5, lng: -82.5, time: '2024-09-24T12:00:00Z', windSpeed: 80, pressure: 975},
        {lat: 28.0, lng: -83.0, time: '2024-09-25T00:00:00Z', windSpeed: 85, pressure: 970},
        {lat: 30.0, lng: -83.5, time: '2024-09-25T12:00:00Z', windSpeed: 85, pressure: 972},
        {lat: 32.5, lng: -84.0, time: '2024-09-26T00:00:00Z', windSpeed: 80, pressure: 975},
        {lat: 35.0, lng: -84.5, time: '2024-09-26T12:00:00Z', windSpeed: 75, pressure: 980},
        {lat: 35.5, lng: -85.0, time: '2024-09-27T00:00:00Z', windSpeed: 65, pressure: 990},
        {lat: 36.0, lng: -85.5, time: '2024-09-27T12:00:00Z', windSpeed: 50, pressure: 1000}
    ],
    
    rainfall: [
        {lat: 35.5, lng: -82.8, amount: 14.2, county: 'Buncombe'},
        {lat: 35.8, lng: -82.3, amount: 12.8, county: 'Madison'},
        {lat: 35.2, lng: -83.4, amount: 11.5, county: 'Henderson'},
        {lat: 36.1, lng: -82.1, amount: 10.3, county: 'Yancey'},
        {lat: 35.9, lng: -81.9, amount: 9.7, county: 'Mitchell'},
        {lat: 35.6, lng: -82.5, amount: 8.9, county: 'Haywood'},
        {lat: 35.3, lng: -83.1, amount: 8.2, county: 'Transylvania'},
        {lat: 36.3, lng: -81.8, amount: 7.8, county: 'Avery'},
        {lat: 35.7, lng: -82.0, amount: 7.1, county: 'McDowell'},
        {lat: 35.4, lng: -83.8, amount: 6.5, county: 'Jackson'},
        {lat: 36.5, lng: -81.6, amount: 5.9, county: 'Watauga'},
        {lat: 35.1, lng: -82.9, amount: 5.2, county: 'Swain'}
    ],
    
    powerOutages: [
        {lat: 35.6, lng: -82.6, outages: 12500, county: 'Buncombe', severity: 'high'},
        {lat: 35.8, lng: -82.2, outages: 8300, county: 'Madison', severity: 'high'},
        {lat: 35.2, lng: -83.5, outages: 6700, county: 'Henderson', severity: 'medium'},
        {lat: 36.1, lng: -82.0, outages: 5200, county: 'Yancey', severity: 'medium'},
        {lat: 35.9, lng: -81.8, outages: 4100, county: 'Mitchell', severity: 'medium'},
        {lat: 35.6, lng: -82.4, outages: 3800, county: 'Haywood', severity: 'low'},
        {lat: 35.3, lng: -83.2, outages: 2900, county: 'Transylvania', severity: 'low'},
        {lat: 36.3, lng: -81.7, outages: 2400, county: 'Avery', severity: 'low'},
        {lat: 35.7, lng: -82.1, outages: 1800, county: 'McDowell', severity: 'low'},
        {lat: 35.4, lng: -83.9, outages: 1500, county: 'Jackson', severity: 'low'}
    ],
    
    floodZones: [
        {lat: 35.55, lng: -82.85, radius: 8000, severity: 'high', description: 'French Broad River flooding'},
        {lat: 35.82, lng: -82.25, radius: 6000, severity: 'high', description: 'Madison County rivers'},
        {lat: 35.18, lng: -83.45, radius: 5000, severity: 'medium', description: 'Mills River overflow'},
        {lat: 36.12, lng: -82.08, radius: 4500, severity: 'medium', description: 'Toe River flooding'},
        {lat: 35.88, lng: -81.92, radius: 4000, severity: 'medium', description: 'Cane River overflow'},
        {lat: 35.64, lng: -82.52, radius: 3500, severity: 'low', description: 'Pigeon River high water'},
        {lat: 35.32, lng: -83.18, radius: 3000, severity: 'low', description: 'Little River flooding'}
    ],
    
    damageReports: [
        {lat: 35.59, lng: -82.55, type: 'structural', severity: 'high', description: 'Multiple building collapses in downtown Asheville'},
        {lat: 35.83, lng: -82.23, type: 'road', severity: 'high', description: 'US-25/70 washed out near Marshall'},
        {lat: 35.22, lng: -83.42, type: 'bridge', severity: 'medium', description: 'Bridge damage on NC-191'},
        {lat: 36.15, lng: -82.05, type: 'landslide', severity: 'high', description: 'Mountain landslide blocking I-26'},
        {lat: 35.91, lng: -81.89, type: 'road', severity: 'medium', description: 'NC-226 partially washed out'},
        {lat: 35.67, lng: -82.48, type: 'utility', severity: 'medium', description: 'Power lines down throughout Canton'},
        {lat: 35.35, lng: -83.15, type: 'flooding', severity: 'medium', description: 'Brevard downtown area flooded'},
        {lat: 36.34, lng: -81.68, type: 'road', severity: 'low', description: 'Minor road damage on NC-194'},
        {lat: 35.73, lng: -82.08, type: 'utility', severity: 'low', description: 'Isolated power outages in Marion'},
        {lat: 35.42, lng: -83.92, type: 'landslide', severity: 'medium', description: 'Slope failure on NC-107'}
    ],
    
    shelters: [
        {lat: 35.59, lng: -82.55, name: 'Asheville Civic Center', capacity: 500, current: 342, status: 'open'},
        {lat: 35.83, lng: -82.23, name: 'Madison County High School', capacity: 300, current: 198, status: 'open'},
        {lat: 35.22, lng: -83.42, name: 'Hendersonville Middle School', capacity: 250, current: 156, status: 'open'},
        {lat: 36.15, lng: -82.05, name: 'Yancey County Emergency Center', capacity: 200, current: 89, status: 'open'},
        {lat: 35.91, lng: -81.89, name: 'Mitchell County Shelter', capacity: 150, current: 67, status: 'open'},
        {lat: 35.67, lng: -82.48, name: 'Haywood Community College', capacity: 400, current: 234, status: 'open'},
        {lat: 35.35, lng: -83.15, name: 'Brevard Recreation Center', capacity: 180, current: 98, status: 'open'},
        {lat: 36.34, lng: -81.68, name: 'Avery County High School', capacity: 220, current: 145, status: 'open'}
    ]
};

// Initialize map when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    createLayers();
    setupEventListeners();
    hideLoading();
});

function initializeMap() {
    // Create map with western NC focus
    map = L.map('map', {
        center: westernNC.center,
        zoom: 8,
        maxBounds: westernNC.bounds,
        maxBoundsViscosity: 1.0,
        minZoom: 7,
        maxZoom: 12
    });

    // Add tile layers
    const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 12
    });

    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri',
        maxZoom: 12
    });

    const darkLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© CartoDB',
        maxZoom: 12
    });

    // Add default layer
    streetLayer.addTo(map);

    // Layer control
    const baseMaps = {
        "Street": streetLayer,
        "Satellite": satelliteLayer,
        "Dark": darkLayer
    };

    L.control.layers(baseMaps).addTo(map);
}

function createLayers() {
    // Storm path layer
    const stormPathCoords = heleneData.path.map(point => [point.lat, point.lng]);
    layers.stormPath = L.polyline(stormPathCoords, {
        color: '#dc2626',
        weight: 3,
        opacity: 0.8,
        dashArray: '10, 5',
        className: 'storm-path'
    });

    // Add storm position markers
    heleneData.path.forEach((point, index) => {
        const marker = L.circleMarker([point.lat, point.lng], {
            radius: 8,
            fillColor: getWindColor(point.windSpeed),
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        });

        marker.bindPopup(`
            <div class="text-sm">
                <strong>Storm Position</strong><br>
                Time: ${new Date(point.time).toLocaleString()}<br>
                Wind Speed: ${point.windSpeed} mph<br>
                Pressure: ${point.pressure} mb<br>
                Category: ${getCategory(point.windSpeed)}
            </div>
        `);

        if (!layers.stormMarkers) layers.stormMarkers = L.layerGroup();
        layers.stormMarkers.addLayer(marker);
    });

    // Rainfall layer
    layers.rainfall = L.layerGroup();
    heleneData.rainfall.forEach(point => {
        const color = getRainfallColor(point.amount);
        const circle = L.circle([point.lat, point.lng], {
            radius: point.amount * 800,
            fillColor: color,
            color: color,
            weight: 2,
            opacity: 0.6,
            fillOpacity: 0.4
        });

        circle.bindPopup(`
            <div class="text-sm">
                <strong>${point.county} County</strong><br>
                Rainfall: ${point.amount} inches<br>
                Category: ${getRainfallCategory(point.amount)}
            </div>
        `);

        layers.rainfall.addLayer(circle);
    });

    // Power outage layer
    layers.powerOutages = L.layerGroup();
    heleneData.powerOutages.forEach(point => {
        const color = getSeverityColor(point.severity);
        const marker = L.circleMarker([point.lat, point.lng], {
            radius: Math.sqrt(point.outages) / 8,
            fillColor: color,
            color: '#fff',
            weight: 2,
            opacity: 0.8,
            fillOpacity: 0.6
        });

        marker.bindPopup(`
            <div class="text-sm">
                <strong>${point.county} County</strong><br>
                Power Outages: ${point.outages.toLocaleString()}<br>
                Severity: ${point.severity}
            </div>
        `);

        layers.powerOutages.addLayer(marker);
    });

    // Flood zones layer
    layers.floodZones = L.layerGroup();
    heleneData.floodZones.forEach(zone => {
        const color = getSeverityColor(zone.severity);
        const circle = L.circle([zone.lat, zone.lng], {
            radius: zone.radius,
            fillColor: color,
            color: color,
            weight: 2,
            opacity: 0.5,
            fillOpacity: 0.2
        });

        circle.bindPopup(`
            <div class="text-sm">
                <strong>Flood Zone</strong><br>
                ${zone.description}<br>
                Severity: ${zone.severity}
            </div>
        `);

        layers.floodZones.addLayer(circle);
    });

    // Damage reports layer
    layers.damageReports = L.layerGroup();
    heleneData.damageReports.forEach(report => {
        const icon = getDamageIcon(report.type, report.severity);
        const marker = L.marker([report.lat, report.lng], { icon });

        marker.bindPopup(`
            <div class="text-sm">
                <strong>${report.type.charAt(0).toUpperCase() + report.type.slice(1)} Damage</strong><br>
                ${report.description}<br>
                Severity: ${report.severity}
            </div>
        `);

        layers.damageReports.addLayer(marker);
    });

    // Shelters layer
    layers.shelters = L.layerGroup();
    heleneData.shelters.forEach(shelter => {
        const statusColor = shelter.status === 'open' ? '#10b981' : '#ef4444';
        const icon = L.divIcon({
            html: `<div style="background: ${statusColor}; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px;">H</div>`,
            iconSize: [30, 30],
            className: 'custom-marker'
        });

        const marker = L.marker([shelter.lat, shelter.lng], { icon });

        marker.bindPopup(`
            <div class="text-sm">
                <strong>${shelter.name}</strong><br>
                Capacity: ${shelter.current}/${shelter.capacity}<br>
                Status: <span style="color: ${statusColor}">${shelter.status}</span><br>
                Availability: ${Math.round((1 - shelter.current/shelter.capacity) * 100)}%
            </div>
        `);

        layers.shelters.addLayer(marker);
    });

    // Add active layers to map
    layers.stormPath.addTo(map);
    layers.stormMarkers.addTo(map);
    layers.rainfall.addTo(map);
    layers.powerOutages.addTo(map);
}

function setupEventListeners() {
    // Layer toggles
    document.querySelectorAll('.layer-toggle').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const layerName = this.dataset.layer;
            const layer = getLayerByName(layerName);
            
            if (layer) {
                if (map.hasLayer(layer)) {
                    map.removeLayer(layer);
                    this.classList.remove('active');
                    this.querySelector('.bg-blue-600').classList.remove('bg-blue-600');
                    this.querySelector('.bg-blue-600').classList.add('bg-gray-300');
                } else {
                    layer.addTo(map);
                    this.classList.add('active');
                    this.querySelector('.bg-gray-300').classList.remove('bg-gray-300');
                    this.querySelector('.bg-gray-300').classList.add('bg-blue-600');
                }
            }
        });
    });

    // Timeline controls
    const timelineSlider = document.getElementById('timeline');
    const playBtn = document.getElementById('play-btn');
    const resetBtn = document.getElementById('reset-btn');

    playBtn.addEventListener('click', function() {
        if (isPlaying) {
            pauseTimeline();
        } else {
            playTimeline();
        }
    });

    resetBtn.addEventListener('click', resetTimeline);

    timelineSlider.addEventListener('input', function() {
        updateTimeline(this.value);
    });
}

function getLayerByName(name) {
    const layerMap = {
        'storm-path': layers.stormPath,
        'wind-fields': layers.stormMarkers,
        'rainfall': layers.rainfall,
        'power-outages': layers.powerOutages,
        'flood-zones': layers.floodZones,
        'damage-reports': layers.damageReports,
        'shelters': layers.shelters
    };
    return layerMap[name];
}

function getWindColor(speed) {
    if (speed >= 110) return '#7c2d12';  // Major hurricane
    if (speed >= 96) return '#dc2626';   // Hurricane 2
    if (speed >= 74) return '#f59e0b';   // Hurricane 1
    if (speed >= 58) return '#eab308';   // Tropical storm
    return '#3b82f6';  // Tropical depression
}

function getCategory(speed) {
    if (speed >= 157) return 'Category 5';
    if (speed >= 130) return 'Category 4';
    if (speed >= 111) return 'Category 3';
    if (speed >= 96) return 'Category 2';
    if (speed >= 74) return 'Category 1';
    if (speed >= 39) return 'Tropical Storm';
    return 'Tropical Depression';
}

function getRainfallColor(amount) {
    if (amount >= 10) return '#1e40af';  // Heavy
    if (amount >= 6) return '#059669';   // Moderate
    return '#f59e0b';  // Light
}

function getRainfallCategory(amount) {
    if (amount >= 10) return 'Heavy';
    if (amount >= 6) return 'Moderate';
    return 'Light';
}

function getSeverityColor(severity) {
    switch(severity) {
        case 'high': return '#dc2626';
        case 'medium': return '#f59e0b';
        case 'low': return '#10b981';
        default: return '#6b7280';
    }
}

function getDamageIcon(type, severity) {
    const colors = {
        high: '#dc2626',
        medium: '#f59e0b',
        low: '#10b981'
    };

    const icons = {
        structural: '🏢',
        road: '🛣️',
        bridge: '🌉',
        landslide: '⛰️',
        utility: '⚡',
        flooding: '🌊'
    };

    const color = colors[severity] || '#6b7280';
    const icon = icons[type] || '⚠️';

    return L.divIcon({
        html: `<div style="background: ${color}; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 14px;">${icon}</div>`,
        iconSize: [30, 30],
        className: 'custom-marker'
    });
}

function playTimeline() {
    isPlaying = true;
    const playBtn = document.getElementById('play-btn');
    playBtn.innerHTML = '<i class="fas fa-pause mr-1"></i> Pause';

    playInterval = setInterval(() => {
        const slider = document.getElementById('timeline');
        let value = parseInt(slider.value);
        
        if (value >= 100) {
            resetTimeline();
        } else {
            value += 2;
            slider.value = value;
            updateTimeline(value);
        }
    }, 100);
}

function pauseTimeline() {
    isPlaying = false;
    const playBtn = document.getElementById('play-btn');
    playBtn.innerHTML = '<i class="fas fa-play mr-1"></i> Play';
    
    if (playInterval) {
        clearInterval(playInterval);
    }
}

function resetTimeline() {
    pauseTimeline();
    const slider = document.getElementById('timeline');
    slider.value = 0;
    updateTimeline(0);
}

function updateTimeline(value) {
    // Update storm position based on timeline
    const progress = value / 100;
    const pathIndex = Math.floor(progress * (heleneData.path.length - 1));
    
    // You can add more sophisticated timeline logic here
    // For now, this is a basic implementation
}

function hideLoading() {
    setTimeout(() => {
        const loading = document.getElementById('loading');
        loading.style.opacity = '0';
        setTimeout(() => {
            loading.style.display = 'none';
        }, 500);
    }, 1500);
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === ' ') {
        e.preventDefault();
        if (isPlaying) {
            pauseTimeline();
        } else {
            playTimeline();
        }
    }
    
    if (e.key === 'r' || e.key === 'R') {
        resetTimeline();
    }
    
    // Layer shortcuts (1-7)
    if (e.key >= '1' && e.key <= '7') {
        const layerIndex = parseInt(e.key) - 1;
        const toggles = document.querySelectorAll('.layer-toggle');
        if (toggles[layerIndex]) {
            toggles[layerIndex].click();
        }
    }
});

// Add touch support for mobile
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', function(e) {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // Swipe gestures for timeline control
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        const slider = document.getElementById('timeline');
        let value = parseInt(slider.value);
        
        if (deltaX > 0) {
            // Swipe right - advance timeline
            value = Math.min(100, value + 10);
        } else {
            // Swipe left - rewind timeline
            value = Math.max(0, value - 10);
        }
        
        slider.value = value;
        updateTimeline(value);
    }
});

// Export map data for external use
window.heleneMapData = {
    getData: () => heleneData,
    getMap: () => map,
    getLayers: () => layers
};
