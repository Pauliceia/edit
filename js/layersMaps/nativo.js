function getJsonMap(table, callback){
    $.post('ajax/MapJson.ajax.php', {callback: 'MapJson', callback_action: 'getRes', tbName: table}, function (data) {
        if (data.ResultJson) {
            if(table == "tb_places") callback(data.ResultJson, data.PlacesDuplicated);
            else callback(data.ResultJson);
        }
    }, 'json');
}

var bases, places, street, map;
getJsonMap('tb_street', function(streets){
    street = new ol.source.Vector({
        features: (new ol.format.GeoJSON()).readFeatures(streets)
    });
    getJsonMap('tb_places', function(place, duplicated){
        places = new ol.source.Vector({
            features: (new ol.format.GeoJSON()).readFeatures(place)
        });
        
        bases = new ol.layer.Group({
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.TileWMS({
                        url: 'http://www.dpi.inpe.br/terrama2-geoserver/ows',
                        params: {'LAYERS': 'pauliceia:mosaicSara', 'TILED': true},
                        serverType: 'geoserver'
                    }),
                    visible: true,
                    name: 'sara'
                }),
                new ol.layer.Vector({
                    source: street,
                    visible: true,
                    name: 'street',
                    style: new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            width: 6, 
                            color: [0, 102, 255, 0.8]
                        })
                    })
                }),
                new ol.layer.Vector({   
                    source: places,
                    visible: true,
                    name: 'places',
                    style: new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: 8,
                            stroke: new ol.style.Stroke({
                                color: 'white',
                                width: 3
                            }),
                            fill: new ol.style.Fill({
                                color: 'red'
                            })
                        })
                    })
                })
            ],
            visible: true,
            name: 'bases'
        });

        rendMap();
        editPlaceDuplic(duplicated);
        activeActions();
        actPoint();
        actLine();
    });
});

