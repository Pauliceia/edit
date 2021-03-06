//liberando as ações por evento
function actDefault(){

    //OPEN / CLOSE TOOBAR LAYERS
    $('#layersModel').click(function () {
        clearInteraction('points');
        if (!$(this).hasClass('active')) {
            $(this).addClass('active');
        }
        $('.form_draw').fadeOut();
        $('#searchEnd').fadeOut();
        $('#searchModel').removeClass('active');
        $('#infoModel').removeClass('active');
        $('#infos').fadeOut();
        arrowLine('remove');

        $('#layers').fadeIn();
    });
    $('#cl_layers').click(function () {
        $('#layersModel').removeClass('active');
        $('#layers').fadeOut();
    });

    // CLOSE TOOBAR DE FORMULARIOS
    $('.cl_form').click(function () {
        clearInteraction('points');
        $('.form_draw').fadeOut();
        $('.btn_edit .btn').removeClass('activeOptions');
    });

    //OPEN / CLOSE TOOBAR SEARCH
    $('#searchModel').click(function () {
        clearInteraction('points');
        if (!$(this).hasClass('active')) {
            $(this).addClass('active');
        }
        $('.form_draw').fadeOut();
        $('#layersModel').removeClass('active');
        $('#infoModel').removeClass('active');
        $('#infos').fadeOut();
        $('#layers').fadeOut();
        $('.selectCamadas').fadeOut();
        arrowLine('remove');

        $('#searchEnd').fadeIn();
        //load_dados();
    });
    $('#cl_search').click(function () {
        $('#searchModel').removeClass('active');
        $('#searchEnd').fadeOut();
    });

    //OPEN / CLOSE TOOBAR REVERSE
    $('#reverseModel').click(function () {
        clearInteraction('points');
        clearInteraction('line');
        if (!$(this).hasClass('active')) {
            $(this).addClass('active');
        }
        arrowLine('');
    });
    $('#cl_reverse').click(function () {
        arrowLine('remove');
    });

    //OPEN / CLOSE TOOBAR INFOS
    $('#infoModel').click(function () {
        clearInteraction('points');
        if (!$(this).hasClass('active')) {
            $(this).addClass('active');
        }
        $('.form_draw').fadeOut();
        $('#layersModel').removeClass('active');
        $('#searchEnd').fadeOut();
        $('#searchModel').removeClass('active');
        $('#layers').fadeOut();
        $('.selectCamadas').fadeOut();
        $('#searchEnd').fadeOut();
        arrowLine('remove');

        $('#infos').fadeIn();
        //load_dados();
    });
    $('#cl_info').click(function () {
        $('#infoModel').removeClass('active');
        $('#infos').fadeOut();
    });

    //btn RECARREGAMENTO de PÁGINA
    $('#recEditModel').click(function () {
        var viewCenter = map.getView().getCenter();
        var viewZoom = map.getView().getZoom();

        $.cookie("saveViewCenter", viewCenter);
        $.cookie("saveViewZoom", viewZoom);

        location.reload();
    });
    $('#recDefModel').click(function () {
        $.removeCookie("saveViewCenter");
        $.removeCookie("saveViewZoom");

        location.reload();
    });

    // função que adiciona e remove os arrows das ruas
    function arrowLine(actionType){
        if(actionType=='remove'){
            $('#reverseModel').removeClass('active');
            $('#reverseStr').fadeOut();
            $('#strReverse').attr('disabled', true);
        }else{
            $('.form_draw').fadeOut();
            $('#layersModel').removeClass('active');
            $('#layers').fadeOut();
            $('.selectCamadas').fadeOut();
            $('#searchEnd').fadeOut();
            $('#searchModel').removeClass('active');
            $('#infoModel').removeClass('active');
            $('#infos').fadeOut();

            $('#reverseStr').fadeIn();
        }
        return;
    }

    //btn SELECT DE FEATURES EM DETERMINADO TEMPO (DATE)
    $('.selectCam').click(function () {
        $('.selectCamadas input[name="featureName"]').val($(this).attr('name'));
        
        var refMap = $('#layers span.period.'+$(this).attr('name')).text().substr(2, 11).split(' - ');
        $('.selectCamadas input[name="first_year"]').val(refMap[0]);
        $('.selectCamadas input[name="last_year"]').val(refMap[1]);
    
        $('.selectCamadas').fadeIn();
    });
    $('#cl_selectC').click(function () {
        $('.selectCamadas').fadeOut();
    });
    $('#applyCamadas').click(function () {
        var featName = $('.selectCamadas input[name="featureName"]').val();
        var anoFirst = $('.selectCamadas input[name="first_year"]').val();
        var anoLast = $('.selectCamadas input[name="last_year"]').val();

        if(!anoFirst) anoFirst=1868;
        if(!anoLast) anoLast=1940;

        if (bases instanceof ol.layer.Group){
            bases.getLayers().forEach(function(sublayer){
                if (sublayer.get('name') == featName) {

                    getPlacesDuplicated(function(dups){
                        sublayer.getSource().getFeatures().forEach( function(feat){
                            var visibleStyle = sublayer.getStyle();

                            if(feat.get('first_year')=="" && feat.get('last_year')==""){
                                feat.setStyle(visibleStyle);
                            }else if(feat.get('first_year')==""){
                                if (feat.get('last_year') >= anoFirst && feat.get('last_year') <= anoLast) feat.setStyle(visibleStyle);
                                else feat.setStyle(emptyStyle);
                            }else if(feat.get('last_year')==""){
                                if (feat.get('first_year') >= anoFirst && feat.get('first_year') <= anoLast) feat.setStyle(visibleStyle);
                                else feat.setStyle(emptyStyle);
                            }else{
                                if ( (feat.get('first_year') >= anoFirst && feat.get('first_year') <= anoLast) || 
                                        (feat.get('last_year') >= anoFirst && feat.get('last_year') <= anoLast) ||
                                        (feat.get('first_year') <= anoFirst && feat.get('last_year') >= anoLast) ) feat.setStyle(visibleStyle);
                                else feat.setStyle(emptyStyle);
                            }
                            
                            //verifica se a feature pertence aos places duplicados
                            if( (JSON.stringify(feat.getStyle()) === JSON.stringify(visibleStyle)) && (sublayer.get('name') == "myplaces" || sublayer.get('name') == "myplaces") ){
                                var styleActual = sublayer.get('name') == "myplaces" ? styleMyDuplic : styleDuplic;
                                dups.forEach(function(res){
                                    var pontos = res.substr(res.indexOf('(')+1);
                                    pontos = pontos.substr(0,pontos.indexOf(')'));
                                    var listPoints = pontos.split(' ');
    
                                    if(feat.getGeometry().getCoordinates()[0]==listPoints[0] && feat.getGeometry().getCoordinates()[1]==listPoints[1]){
                                        if(JSON.stringify(generateStylePlaces()) !== JSON.stringify(feat.getStyle())){
                                            feat.setStyle(styleActual);
                                        }
                                    }
                                });
                            }
                        });                     

                    });
                }
            });
        }

        $('#layers span.period.'+featName).html('( '+anoFirst+' - '+anoLast+' )');
    });


    // ===========================
    //ações de mostragem dos mapas fixos ONLINE
    $('.layersMap input[type=radio]').change(function() {
        var layer = $(this).val();

        map.getLayers().getArray().forEach(function(e) {
            var name = e.get('name');
            if(name == layer){
                if(!e.get('visible')){
                    e.setVisible(true);
                }
            }else if(name != 'bases'){
                e.setVisible(false);
            }
        });
    });
    //ações de mostragem dos mapas NATIVOS (geoserver ou banco de dados)
    $('.layersMap input[type=checkbox]').click(function() {
        var layerselect = $(this).val();

        if (bases instanceof ol.layer.Group){
            bases.getLayers().forEach(function(sublayer){
                if (sublayer.get('name') == layerselect) {
                    if(!sublayer.get('visible')){
                        sublayer.setVisible(true);
                    }else{
                        sublayer.setVisible(false);
                    }
                }
            });
        }

    });

    //btn SEARCH (GEOCODIFICAÇÃO DE ENDEREÇOS)
        //inicia-se a função de GEOLOCALIZAÇÃO
        $(".searchEnd input[name='searchInput']").keyup(function(){
            load_dados();
        });

        $(".searchEnd .years").keyup(function(){
            if($('.searchEnd input[name="first_year"]').val()>=1868 
                && $('.searchEnd input[name="first_year"]').val()<=1940
                && $('.searchEnd input[name="last_year"]').val()>=1868
                && $('.searchEnd input[name="last_year"]').val()<=1940
                && $('.searchEnd input[name="first_year"]').val() <= $('.searchEnd input[name="last_year"]').val()){
                load_dados();
            }
        });

        $(".searchEnd .camada").click(function(){
            load_dados();
        });

        //função que carrega os dados do formulário para o ajax
        function load_dados(){
            var form = $('#searchForm_end');

            var first_year = form.find('input[name="first_year"]').val().length > 0 
                                && parseInt(form.find('input[name="first_year"]').val()) >= 1868
                                && parseInt(form.find('input[name="first_year"]').val()) <= 1940
                                ? form.find('input[name="first_year"]').val() : 1868;
            var last_year = form.find('input[name="last_year"]').val().length > 0 
                                && parseInt(form.find('input[name="last_year"]').val()) >= 1868
                                && parseInt(form.find('input[name="last_year"]').val()) <= 1940 
                                ? form.find('input[name="last_year"]').val() : 1940;

            var consulta = form.find('input[name="searchInput"]').val();
            var camada = form.find('input[name="camada"]:checked').val(); 
                 
            var  resp="";
            bases.getLayers().forEach(function(layer) {
                if(layer.get('name') == camada){
                    
                    var results=0;
                    var feats = layer.getSource().getFeatures();
                    for(var i=0; i<feats.length; i++){
                        var nameFeat = feats[i].get("name").toLowerCase().trim();

                        if( ((nameFeat).search(consulta.toLowerCase()) >= 0) && (
                             ((feats[i].get('first_year') >= first_year && feats[i].get('first_year') <= last_year) || feats[i].get('first_year')=="") || 
                             ((feats[i].get('last_year') >= first_year && feats[i].get('last_year') <= last_year) || feats[i].get('last_year')=="") 
                            ) ){
                                nameFeat = nameFeat != "" ? nameFeat : "unnamed";
                                if(feats[i].get('tabName')=="tb_street"){
                                    resp += "<p>"+nameFeat+"<button onclick='viewFeatSelect("+feats[i].getId()+","+1+")' geom='geomeria'>&#10146;</button></p>";
                                }else if(feats[i].get('tabName')=="tb_places"){
                                    resp += "<p>"+nameFeat+"<button onclick='viewFeatSelect("+feats[i].getId()+","+2+")' geom='geomeria'>&#10146;</button></p>";
                                }
                                if(++results==5) return;
                        }
                        
                    }
                }
            });

            $("#searchResposta").html(resp).fadeIn();
        }              

}