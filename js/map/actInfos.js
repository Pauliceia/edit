//FUNÇÃO I - get feature info
function actInfos(){

    var getFeat = new ol.interaction.Select();

    $('#getFeatInfo').click(function(){
        map.addInteraction(getFeat);

        getFeat.getFeatures().on('add', function(e) {
            var featSelect = e.element;
            displayInfo(featSelect);
        });
    });
    
}
