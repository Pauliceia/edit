//layers de api's (online)
var openstreetmap = new ol.layer.Tile({
    source: new ol.source.OSM(),
    visible: true,
    name: 'openstreetmap'
});
var bingRoad = new ol.layer.Tile({
    preload: Infinity,
            source: new ol.source.BingMaps({
                    key: 'AqwD3uSJMGzPQGNGWetSkrdq3kTgIDODq_v-_72D7sQ0gWjkzTIVqzwQR3xqeaGo',
                    imagerySet: 'Road'
            }),
    visible: false,
    name: 'bingRoad'
});

