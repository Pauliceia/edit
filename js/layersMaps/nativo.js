function getJsonMap(table, callback){
    $.post('ajax/MapJson.ajax.php', {callback: 'MapJson', callback_action: 'getRes', tbName: table}, function (data) {
        if (data.ResultJson) {
            callback(data.ResultJson);
        }
    }, 'json');
}

var bases, places, street, map;
getJsonMap('tb_street', function(streets){
    street = new ol.source.Vector({
        features: (new ol.format.GeoJSON()).readFeatures(streets)
    });
    getJsonMap('tb_places', function(place){
        places = new ol.source.Vector({
            features: (new ol.format.GeoJSON()).readFeatures(place)
        });
        //layers do geoserver
        bases = new ol.layer.Group({
            layers: [
                new ol.layer.Vector({
                    source: street,
                    visible: true,
                    name: 'street'
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

        rendMap();
        activeActions();
        actPoint();
    });
});

