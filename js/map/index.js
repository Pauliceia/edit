function getJsonMap(table, myFeat, callback){
    var dados = { callback: 'MapJson', callback_action: 'getRes', tbName: table, my: myFeat }
    
    $.post('ajax/MapJson.ajax.php', dados, function (data) {
        if (data.ResultJson) {
            if(table == "tb_places") callback(data.ResultJson);
            else callback(data.ResultJson);
        }
    }, 'json');
}

var bases, places, myplaces, street, map;
getJsonMap('tb_street', false,  function(streets){
    street = new ol.source.Vector({
        features: (new ol.format.GeoJSON()).readFeatures(streets)
    });
    getJsonMap('tb_places', false, function(place){
        places = new ol.source.Vector({
            features: (new ol.format.GeoJSON()).readFeatures(place)
        });
        getJsonMap('tb_places', true, function(myplace){
            myplaces = new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(myplace)
            });
        
            bases = new ol.layer.Group({
                layers: [
                    new ol.layer.Tile({
                        source: new ol.source.TileWMS({
                            url: 'http://www.pauliceia.dpi.inpe.br/geoserver/ows',
                            params: {'LAYERS': 'pauliceia:saraBrasil30', 'TILED': true},
                            serverType: 'geoserver'
                        }),
                        visible: true,
                        name: 'sara'
                    }),
                    new ol.layer.Tile({
                        source: new ol.source.TileWMS({
                            url: 'http://www.pauliceia.dpi.inpe.br/geoserver/ows',
                            params: {'LAYERS': 'pauliceia:tb_street_ref', 'TILED': true},
                            serverType: 'geoserver'
                        }),
                        visible: true,
                        name: 'street_ref'
                    }),
                    new ol.layer.Vector({
                        source: street,
                        visible: true,
                        name: 'street',
                        style: styleStreet
                    }),
                    new ol.layer.Vector({
                        source: new ol.source.TileWMS({
                            url: 'http://www.pauliceia.dpi.inpe.br/geoserver/ows',
                            params: {'LAYERS': 'pauliceia:tb_street_ref', 'TILED': true},
                            serverType: 'geoserver'
                        }),
                        visible: true,
                        name: 'street_ref',
                        style: styleStreetRef
                    }),
                    new ol.layer.Vector({   
                        source: places,
                        visible: false,
                        name: 'places',
                        style: stylePlaces
                    }),
                    new ol.layer.Vector({   
                        source: myplaces,
                        visible: true,
                        name: 'myplaces',
                        style: styleMyPlaces
                    }),
                ],
                visible: true,
                name: 'bases'
            });

            var openstreetmap = new ol.layer.Tile({
                source: new ol.source.OSM(),
                visible: false,
                name: 'openstreetmap'
            });

            rendMap(bases, openstreetmap);
            colorDuplicPlaces();
            actDefault();
            actPoint();
            actLine();
            actInfos();
        });
    });
});

