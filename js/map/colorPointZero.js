function colorPointZero(){
    if (bases instanceof ol.layer.Group){
        bases.getLayers().forEach(function(sublayer){
            if (sublayer.get('name') == "places" || sublayer.get('name') == "myplaces") {
                sublayer.getSource().getFeatures().forEach(function(feat){
                    if(feat.getProperties()['number'] == 0){
                        feat.setStyle(stylePointZero);
                    }
                });
            }

        });
    }
}