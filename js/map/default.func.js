//RETIRA AS INTERAÇÕES DOS MAPAS
function clearInteraction(type){
    $("#pointsOptions").find("p").removeClass('activeOptions');
    if(type == 'line'){
        map.removeInteraction(selectLine);
    }else{
        map.removeInteraction(drawPoints);
        map.removeInteraction(erasePoint);
        map.removeInteraction(editPoint);
        map.removeInteraction(duplicPoint);
    }
}

//seta a cor default do layers desejado -> places ou street
function setColorDefault(type){

    if (bases instanceof ol.layer.Group){
        bases.getLayers().forEach(function(sublayer){
            if (sublayer.get('name') == type) {
                sublayer.getSource().getFeatures().forEach(function(feat){
                    var styleActual = feat.getStyle();

                    if(type=="places") {                        
                        if(JSON.stringify(styleActual) === JSON.stringify(styleSelects)){
                            feat.setStyle(stylePlaces);
                        }
                        colorDuplicPlaces();                        
                    
                    }else if(type=="street") {
                        feat.setStyle(styleStreet);
                    
                    }else if(type=="myplaces") {
                        if(JSON.stringify(styleActual) === JSON.stringify(styleSelects)){
                            feat.setStyle(styleMyPlaces);
                        }
                        colorDuplicPlaces();
                    }
                });
            }
        });
    }
}

//GERA UM DADO NO FORMATO WKT
function generationWkt(e, type){
    var featureWkt;

    var featureClone = e.clone();
    featureWkt = wkt.writeFeature(featureClone);

    if(type == "insert"){
        $("#insertData input[name='geom']").val(featureWkt);

        var coordinatesPoint = featureWkt.substr(6).split(" ");
        $("#insertData input[name='lat']").val(coordinatesPoint[0]);
        $("#insertData input[name='long']").val(coordinatesPoint[1].substr(0, coordinatesPoint[1].indexOf(')')));

    }else if(type == "edit"){
        $("#editData input[name='geom']").val(featureWkt);
    }

}

//ADICIONA A FEATURE NO LAYER DO MAPA
function addFeature(feature){
    feature.setId('waitingCheck');
    feature.setStyle(generateStylePlaces('wait'));

    if (bases instanceof ol.layer.Group){
        bases.getLayers().forEach(function(sublayer){
            if (sublayer.get('name') == 'myplaces') {
                sublayer.getSource().addFeatures(feature);
            }
        });
    }
}

//PREENCHE A FEATURE COM OS ATRIBUTOS DIGITADOS PELO USUÁRIO
function preencheFeature(id, type){
    if (bases instanceof ol.layer.Group){
        bases.getLayers().forEach(function(sublayer){
            if (sublayer.get('name') == 'myplaces') {
                f = sublayer.getSource().getFeatureById('waitingCheck');

                f.set('id', id, true);
                f.set('tabName', 'tb_places', true);
                f.setId(id);

                $("#"+type+" input.inF").each(function(){
                    var colunmsName = $(this).attr('name');
                    var inputAtual = $('#'+type+' input[name="'+colunmsName+'"').val();
                    f.set(colunmsName, inputAtual, true);
                });
                
                f.setStyle(generateStylePlaces());

                var discDate = $("#"+type+" input[name='disc_date']").is(":checked") == true ? 't' : 'f';
                f.set('disc_date', discDate, true);

                var descFeature = $("#"+type+" textarea").val();
                f.set('description', descFeature, true);

            }
        });
    }
}

//DUPLICA OS PONTOS DE ACORDO COM OS NOVOS DADOS (MY PLACES)
function editFeatDuplic(id, newId, idAuthor, type){
    if (bases instanceof ol.layer.Group){
        var newFeat;

        bases.getLayers().forEach(function(sublayer){
            if (sublayer.get('name') == 'places' || sublayer.get('name') == 'myplaces') {
                var f = sublayer.getSource().getFeatureById(id);
                if(f != null){
                    newFeat = f.clone();
                    newFeat.setId(newId);
                    newFeat.set('id', newId, true);
                }
            }            
        });
        
        $("#"+type+" input.inF").each(function(){
            var colunmsName = $(this).attr('name');
            if(colunmsName != "author"){
                var inputAtual = $('#'+type+' input[name="'+colunmsName+'"').val();
                newFeat.set(colunmsName, inputAtual, true);
            }
        });
        
        //setando data atual
        var d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        date = [year, month, day].join('-');

        newFeat.set('date', date, true);

        //setando autor atual
        newFeat.set('id_user', idAuthor, true);

        var discDate = $("#"+type+" input[name='disc_date']").is(":checked") == true ? 't' : 'f';
        newFeat.set('disc_date', discDate, true);
        
        var descFeature = $("#"+type+" textarea").val();
        newFeat.set('description', descFeature, true);

        bases.getLayers().forEach(function(sublayer){
            if (sublayer.get('name') == 'myplaces') {
                newFeat.setStyle(generateStylePlaces());
                colorDuplicPlaces();
                sublayer.getSource().addFeature(newFeat);
            }            
        });
    }
}

//MOSTRA OS ATRIBUTOS DA FEATURE NO FORMULARIO DE EDIÇÃO
function getAttribs(feature, type){
    $("#"+type+" input").each(function(){
        var colunmsName = $(this).attr('name');
        if(colunmsName != 'callback' && colunmsName != 'callback_action' && colunmsName != 'geom' && colunmsName != 'description' && colunmsName != 'disc_date'){
            $('#'+type+' input[name="'+colunmsName+'"').val(feature.get(colunmsName));
        }
    });

    $("#"+type+" textarea").val(feature.get('description'));

    if(feature.get('disc_date') == 't'){
        $("#"+type+" input[name='disc_date']").prop("checked", true);
    }else{
        $("#"+type+" input[name='disc_date']").prop("checked", false);
    }

    var jsonAutor = $('#jsonAutor').text();
    jsonAutor = JSON.parse(jsonAutor);

    jsonAutor.forEach(function(resultado) {
        if(resultado.id == feature.get('id_user')){
            $('#'+type+' input[name="author"]').val(resultado.name);
        }
    });

    atualizaStreet(type);
}

//ATUALIZA OS ATRIBUTOS DA FEATURE DE ACORDO COM O QUE FOI DIGITADO PELO USUÁRIO
function atualizaFeature(idFeature, type){

    if (bases instanceof ol.layer.Group){
        bases.getLayers().forEach(function(sublayer){
            if (sublayer.get('name') == 'places' || sublayer.get('name') == 'myplaces') {
                var f = sublayer.getSource().getFeatureById(idFeature);
                if(f != null){

                    $("#"+type+" input.inF").each(function(){
                        var colunmsName = $(this).attr('name');
                        var inputAtual = $('#'+type+' input[name="'+colunmsName+'"').val();
                        f.set(colunmsName, inputAtual, true);
                    });

                    var discDate = $("#"+type+" input[name='disc_date']").is(":checked") == true ? 't' : 'f';
                    f.set('disc_date', discDate, true);
                    
                    var descFeature = $("#"+type+" textarea").val();
                    f.set('description', descFeature, true);
                    f.setStyle(generateStylePlaces());

                    if(sublayer.get('name') == 'places'){
                        bases.getLayers().forEach(function(sublayerp){
                            if (sublayerp.get('name') == 'myplaces') {
                                sublayerp.getSource().addFeature(f);
                            }
                        }); 
                        sublayer.getSource().removeFeature(f);
                    }

                }
            }
        });
    }
}

//ATUALIZA E PREENCHE RUAS NO CAMPO DO FORMULARIO
function atualizaStreet(type){
    var streetID = $('#'+type+' input[name="id_street"').val();
    bases.getLayers().forEach(function(sublayer){
        if (sublayer.get('name') == 'street') {
            var f = sublayer.getSource().getFeatureById(streetID);
            if(f != null){
                $('#'+type+' input[name="street"').val(f.get('name'))
            }
        }
    });
}

//EXCLUI A FEATURE SELECIONADA DO 'LAYER ATUAL' NO MAPA
function excluiFeature(feature){
    var DelId = feature.getId();

    if(DelId=='waitingCheck'){
        if (bases instanceof ol.layer.Group){
            bases.getLayers().forEach(function(sublayer){
                if (sublayer.get('name') == 'myplaces'){
                    sublayer.getSource().removeFeature(feature);
                }
            });
        }
    }else{
        var Callback = 'Draw';
        var Callback_action = 'draw_delete';
        $.post('ajax/' + Callback + '.ajax.php', {callback: Callback, callback_action: Callback_action, del_id: DelId}, function (data) {

            if (data.trigger) {
                if (bases instanceof ol.layer.Group){
                    bases.getLayers().forEach(function(sublayer){
                        if (sublayer.get('name') == 'places' || sublayer.get('name') == 'myplaces'){
                            if(sublayer.getSource().getFeatureById(DelId) != null){
                                sublayer.getSource().removeFeature(feature);
                                colorPosDel(feature);
                            }
                        }
                    });
                }
            }

        }, 'json');
    }
}

//APÓS EXCLUSÃO -> ao excluir um ponto, ele verifica se a algum duplicado e volta a sua cor original.
function colorPosDel(featDel){
    if (bases instanceof ol.layer.Group){
        bases.getLayers().forEach(function(sublayer){

            if (sublayer.get('name') == 'places' || sublayer.get('name') == 'myplaces'){
                var styleActual = sublayer.get('name') == "myplaces" ? styleMyPlaces : stylePlaces;
                sublayer.getSource().getFeatures().forEach(function(feat){
                    var formatWKT = new ol.format.WKT();
                    var featDelwkt = formatWKT.writeFeature(featDel);
                    var featwkt = formatWKT.writeFeature(feat);

                    if(featDelwkt == featwkt){
                        feat.setStyle(styleActual);
                    }
                });
            }

        });
    }
}

//GET INFO FEATURE -> função i
    function viewInfo(feat, type){
        $("#infos .respInfo").html("<table>"+getFeatSelects(feat)+"</table>").fadeIn();        
    }

    //seleciona as features que possuem a geometria = selecionada
    function getFeatSelects(feat){
        var respInfo = "";
        
        if (bases instanceof ol.layer.Group){
            bases.getLayers().forEach(function(sublayer){
                if (sublayer.getVisible() && sublayer.get('name') != "sara" ){
                    sublayer.getSource().getFeatures().forEach(function(featSelect){
                        var formatWKT = new ol.format.WKT();
                        var featSelwkt = formatWKT.writeFeature(featSelect);
                        var featwkt = formatWKT.writeFeature(feat);
    
                        if( (featSelwkt == featwkt) && (JSON.stringify(featSelect.getStyle()) !== JSON.stringify(emptyStyle)) ){
                            respInfo += generateResp(featSelect);
                        }
                    });
                }
            });
        }
        
        return respInfo;
    }

    //gerar a resposta com as informações da feature
    function generateResp(feat){
        var resp = "";
        if(feat.get('tabName')=='tb_street'){
            var title = feat.get('name') != '' ? feat.get('name') : feat.get('obs');
            resp +=  "<tr style='background: #999;'> <td colspan='3'><b>"+title+"</b></td> </tr>";
            resp += "<tr> <td>First_year: "+feat.get('first_year')+"</td>";
            resp += "<td>Last_year: "+feat.get('last_year')+"</td> </tr>";
            resp += "<tr><td colspan='3'> Perimiter: "+feat.get('perimeter')+"</td></tr>"
            
        }else if(feat.get('tabName')=='tb_places'){
            var title = feat.get('name') != '' ? feat.get('name') : 'unnamed';
            resp += "<tr style='background: #999;'> <td colspan='3'><b>"+title+"</b></td> </tr>";

            if(feat.get('description') != '') resp += "<tr> <td colspan='3'>"+feat.get('description')+"</td> </tr>";

            resp += "<tr> <td>First day: "+feat.get('first_day')+"</td> <td>First month: "+feat.get('first_month')+"</td> <td>First year: "+feat.get('first_year')+"</td> </tr>";
            resp += "<tr> <td>Last day: "+feat.get('last_day')+"</td> <td>Last month: "+feat.get('last_month')+"</td> <td>Last year: "+feat.get('last_year')+"</td> </tr>";
            resp += "<tr> <td>Number: "+feat.get('number')+"</td> <td colspan='2'>Original_number: "+feat.get('original_number')+"</td> </tr>";
            resp += "<tr> <td colspan='3'>Source: "+feat.get('source')+"</td> </tr>";

        }

        return resp;
    }
