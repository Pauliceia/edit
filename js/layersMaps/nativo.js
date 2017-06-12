//var JsonStreet = $('#jsonLayersStreet').text();
var JsonPlaces = $('#jsonLayersPlaces').text();
/*var street = new ol.source.Vector({
    features: (new ol.format.GeoJSON()).readFeatures(JsonStreet)
});*/
var places = new ol.source.Vector({
    features: (new ol.format.GeoJSON()).readFeatures(JsonPlaces)
});

//layers do geoserver
var bases = new ol.layer.Group({
    layers: [
        /*new ol.layer.Vector({
            source: street,
            visible: true,
            name: 'street'
        }),*/
        new ol.layer.Vector({
            source: places,
            visible: true,
            name: 'places'
        })
    ],
    visible: true,
    name: 'bases'
});
