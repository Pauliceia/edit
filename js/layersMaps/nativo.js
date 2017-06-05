var JsonStreet = $('#jsonLayersStreet').text();
var Street = new ol.source.Vector({
        features: (new ol.format.GeoJSON()).readFeatures(JsonStreet)
});

var JsonPlaces = $('#jsonLayersPlaces').text();
var places = new ol.source.Vector({
        features: (new ol.format.GeoJSON()).readFeatures(JsonPlaces)
});

//layers do geoserver
var bases = new ol.layer.Group({
    layers: [
        new ol.layer.Vector({
            source: Street,
            visible: true,
            name: 'Street'
        }),
        new ol.layer.Vector({
            source: places,
            visible: true,
            name: 'places'
        })
    ],
    visible: true,
    name: 'bases'
});
