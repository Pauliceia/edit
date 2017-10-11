//VARIAVEIS (OBJETOS) -> line - PARA A INTERAÇÃO COM O MAPA
var selectLine = new ol.interaction.Select({
    style: styleFunction
});

var featSelect;
//AO CLICAR NO BOTÃO PARA DUPLICAR FEATURE
function actLine(){
    $('#selectStLine').click(function(){
        clearInteraction('point');
        $(this).addClass('activeOptions');
        
        getStreetLine('insertData');
        return false;
    });
    
    $('#alterStLine').click(function(){
        clearInteraction('point');
        
        getStreetLine('editData');
        return false;
    });

    $('#sltStrReverse').click(function(){
        clearInteraction('point');
        clearInteraction('line');

        getStreetLine('reverseStr');        
        return false;
    });

    $('#strReverse').click(function(){
        clearInteraction('point');

        var newLine = [];
        var lineStringsArray = featSelect.getGeometry().getLineStrings();

        for(var i=lineStringsArray.length-1; i>=0 ;i--){
            newLine[i] = featSelect.getGeometry().getCoordinates()[i].reverse();
        }
        featSelect.getGeometry().setCoordinates(newLine);

        generationWkt(featSelect, "reverse");
        $('#btnStrReverseSave').prop("disabled", false);

        featSelect.setStyle(styleFunction(featSelect));
        
        return false;
    });

    function getStreetLine(type){
        map.addInteraction(selectLine);  

        selectLine.getFeatures().on('add', function(e) {
            if(featSelect!=null){
                featSelect.setStyle(styleFunction(featSelect));
            }

            if(e.element.get("tabName") == 'tb_street'){
                featSelect = e.element;

                //FORM DE REVERSAO DE LINE
                if(type=='reverseStr'){
                    $('#strReverse').attr('disabled', false);
                    $('#'+type+' input[name="name_street"]').val(featSelect.get('name'));
                    $('#'+type+' input[name="first_year"]').val(featSelect.get('first_year'));
                    $('#'+type+' input[name="last_year"]').val(featSelect.get('last_year'));

                    var sizeStreet = 0;
                    if(featSelect.get('perimeter')==0){
                        //MultiLineString
                        for(var i=0; i<featSelect.getGeometry().getLineStrings().length; i++){
                            sizeStreet += LengthLineString(featSelect.getGeometry().getCoordinates()[i]);
                        }
                    }else{
                        sizeStreet = featSelect.get('perimeter');
                    }
                    sizeStreet = sizeStreet>=1000 ? parseFloat((sizeStreet/1000).toFixed(2))+"km" : (parseFloat(sizeStreet).toFixed(2))+"m";

                    $('#'+type+' input[name="length_street"]').val(sizeStreet);
                    $('#'+type+' input[name="id"]').val(featSelect.get('id'));


                //FORM DE CADASTRO E EDIÇÃO
                }else{
                    var idStreet = featSelect.get("id");
                    var nameStreet = featSelect.get("name");
    
                    $('#'+type+' input[name="id_street"]').val(idStreet);
                    $('#'+type+' input[name="street"]').val(nameStreet);

                }
            }
        });

        selectLine.getFeatures().on('remove', function(){
            if(featSelect!=null){
                featSelect.setStyle(styleFunction(featSelect));
            }
        });
    }
}
