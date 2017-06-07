/*var JsonStreet = $('#jsonLayersStreet').text();
var JsonPlaces = $('#jsonLayersPlaces').text();
*/
//layers do geoserver
var bases = new ol.layer.Group({
    layers: [
        /*new ol.layer.Vector({
            source: new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(JsonStreet)
            }),
            visible: true,
            name: 'street'
        }),
        new ol.layer.Vector({
            source: new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(JsonPlaces)
            }),
            visible: true,
            name: 'places'
        })*/
    ],
    visible: true,
    name: 'bases'
});
