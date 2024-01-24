mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: campground.geometry.coordinates , // starting position [lng, lat]
    zoom: 13, // starting zoom
});

// Set marker options.
const marker = new mapboxgl.Marker({
    color: "#B22222",
    draggable: true
}).setLngLat(campground.geometry.coordinates).addTo(map);