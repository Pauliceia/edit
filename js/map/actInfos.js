//FUNÇÃO I - get feature info
function actInfos(){

    var getFeat = new ol.interaction.Select();
    var getBoxFeat = new ol.interaction.DragBox();
    var auxSelect = new ol.interaction.Select();

    $('#getFeatInfo').click(function(){
        map.addInteraction(getFeat);

        getFeat.on('select', function(e) {
            var featSelect = e.selected[0];   
                     
            viewInfo(featSelect, 'unique');  

            $('#selectFeat').click(function(){
                extendsToSelect($(this).attr('idFeat'), $(this).attr('tab'));
            });
        });

    });

    $('#getBoxInfo').click(function(){
        map.addInteraction(getBoxFeat);
        
        auxSelect = new ol.interaction.Select();
        map.addInteraction(auxSelect);
        var selectedFeatures = auxSelect.getFeatures();
        
        getBoxFeat.on('boxend', function() {
            var extent = getBoxFeat.getGeometry().getExtent();

            bases.getLayers().forEach(function(sublayer){
                if(sublayer.get('name')=='street' || sublayer.get('name')=='places' || sublayer.get('name')=='myplaces'){
                    if(sublayer.getVisible()) sublayer.getSource().forEachFeatureIntersectingExtent(extent, function(feature) {
                        if(JSON.stringify(feature.getStyle()) !== JSON.stringify(emptyStyle)) {
                            selectedFeatures.push(feature);
                        }
                    });
                }
            });
            
            viewInfo(selectedFeatures, 'multi');

            $('#selectFeat').click(function(){
                extendsToSelect($(this).attr('idFeat'), $(this).attr('tab'));
            });

        });

        getBoxFeat.on('boxstart', function() {
            selectedFeatures.clear();
        });
        
    });

    $('#clearInfo').click(function(){
        map.removeInteraction(getFeat);
        map.removeInteraction(getBoxFeat);
        map.removeInteraction(auxSelect);

        $("#infos .respInfo").html("<p></p>").fadeOut(); 

        setColorDefault('street');
        setColorDefault('places');
        setColorDefault('myplaces');
        
        return false;
    });
    
}
