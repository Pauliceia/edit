function colorVisiblePlaces(dadosDuplic, id){
    
    var styleMyDuplic = new ol.style.Style({
        image: new ol.style.Circle({
            radius: 8,
            stroke: new ol.style.Stroke({
                color: 'white',
                width: 3
            }),
            fill: new ol.style.Fill({
                color: 'orange'
            })
        })
    });

    var styleMyPlaces = new ol.style.Style({
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
    });

    var emptyStyle = new ol.style.Style({ display: 'none' });

    if (bases instanceof ol.layer.Group){
        bases.getLayers().forEach(function(sublayer){
            if (sublayer.get('name') == "places") {
                sublayer.getSource().getFeatures().forEach(function(feat){
                    if(feat.get('id_user') == id){
                        feat.setStyle(styleMyPlaces);
                        dadosDuplic.forEach(function(res){
                            var pontos = res.substr(res.indexOf('(')+1);
                            pontos = pontos.substr(0,pontos.indexOf(')'));
                            var listPoints = pontos.split(' ');
    
                            if(feat.getGeometry().getCoordinates()[0]==listPoints[0] && feat.getGeometry().getCoordinates()[1]==listPoints[1]){
                                feat.setStyle(styleMyDuplic);
                            }
                        });
                    }else{
                        feat.setStyle(emptyStyle);
                    }
                    
                });
            }
        });
    }
    
}