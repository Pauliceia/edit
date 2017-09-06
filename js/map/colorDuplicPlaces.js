function colorDuplicPlaces(dadosDuplic){

    if (bases instanceof ol.layer.Group){
        bases.getLayers().forEach(function(sublayer){
            if (sublayer.get('name') == "places") {
                
                sublayer.getSource().getFeatures().forEach(function(feat){
                    dadosDuplic.forEach(function(res){
                        var pontos = res.substr(res.indexOf('(')+1);
                        pontos = pontos.substr(0,pontos.indexOf(')'));
                        var listPoints = pontos.split(' ');

                        if(feat.getGeometry().getCoordinates()[0]==listPoints[0] && feat.getGeometry().getCoordinates()[1]==listPoints[1]){
                            feat.setStyle(styleDuplic);
                        }
                    });
                });

            }else if(sublayer.get('name') == "myplaces"){

                sublayer.getSource().getFeatures().forEach(function(feat){
                    dadosDuplic.forEach(function(res){
                        var pontos = res.substr(res.indexOf('(')+1);
                        pontos = pontos.substr(0,pontos.indexOf(')'));
                        var listPoints = pontos.split(' ');

                        if(feat.getGeometry().getCoordinates()[0]==listPoints[0] && feat.getGeometry().getCoordinates()[1]==listPoints[1]){
                            feat.setStyle(styleMyDuplic);
                        }
                    });
                });

            }
        });
    }
    
}