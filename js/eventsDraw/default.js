//OPEN / CLOSE TOOBAR LAYERS
$('#layersModel').click(function () {
    clearInteraction('points');
    if (!$(this).hasClass('active')) {
        $(this).addClass('active');
    }
    $('.form_draw').fadeOut();
    $('#searchEnd').fadeOut();
    $('#searchModel').removeClass('active');
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
     $('#layers').fadeOut();

    $('#searchEnd').fadeIn();
    //load_dados();
});
$('#cl_search').click(function () {
    $('#searchModel').removeClass('active');
    $('#searchEnd').fadeOut();
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






//OPEN POPUP SELECT CAMADAS
$('.selectC').click(function () {
    $('.selectCamadas').fadeIn();
});

//SELECT CAMADAS btn 'selecionar todas'
$('.selectCamadas .todasCamadas').click(function () {
    $('.selectCamadas input[type=checkbox]').prop("checked", true);
});

//CLOSE POPUP STYLE MAP
$('.closeSelectC').click(function () {
    $('.selectCamadas').fadeOut();
});

//CAMPO DE BUSCA POR ENDEREÇO (GEOODIFICAÇÃO)
    //funções que deixa visivel o gif de 'carregando'
    function loading_show(){
        $('.search_load').fadeIn();
    }
    function loading_hide(){
        $('.search_load').fadeOut();
    }

    //Ao digitar ou selecionar outra camada,
    //inicia-se a função de GEOLOCALIZAÇÃO
    $(".searchEnd input[name='searchInput']").keyup(function(){
        load_dados();
    });

    $(".searchEnd .years").keyup(function(){
        if($('.searchEnd input[name="anoI"]').val()>=1868 
            && $('.searchEnd input[name="anoI"]').val()<=1940
            && $('.searchEnd input[name="anoF"]').val()>=1868
            && $('.searchEnd input[name="anoF"]').val()<=1940
            && $('.searchEnd input[name="anoI"]').val() <= $('.searchEnd input[name="anoF"]').val()){
            load_dados();
        }
    });

    //função que carrega os dados para o ajax
    function load_dados(){
        var form = $('#searchForm_end');

        var consulta = form.find('input[name="searchInput"]').val();
        var numberStreet;
        if(consulta.indexOf("-") != -1){ numberStreet = parseInt(consulta.substr(consulta.indexOf("-")+1));}
        if(consulta.indexOf(",") != -1){ numberStreet = parseInt(consulta.substr(consulta.indexOf(",")+1));}
        if(consulta.indexOf(".") != -1) { numberStreet = parseInt(consulta.substr(consulta.indexOf(".")+1));}
        if(consulta.indexOf("/") != -1) { numberStreet = parseInt(consulta.substr(consulta.indexOf("/")+1));}

        var callback = form.find('input[name="callback"]').val();
        var callback_action = form.find('input[name="callback_action"]').val();

        form.ajaxSubmit({
                type: 'POST',
                data: {callback_action: callback_action},
                dataType: 'json',
                url: 'ajax/' + callback + '.ajax.php',
                beforeSend: function(){
                        //loading_show();
                },
                success: function(msg){
                    //loading_hide();
                    var res = msg.sucess;
                    $("#searchResposta").html(res).fadeIn();
                    //ao clicar no botão de visualizar a rua
                    $(".searchResposta p button").click(function(){
                        var idRua = $(this).attr('id');

                        //captura os pontos INICIAIS E FINAIS da rua
                        /* var pontos = $(".searchResposta p").text();
                        pontos = pontos.substr(pontos.indexOf("(")+1);
                        pontos = pontos.substr(0,pontos.indexOf(")"));
                        var pts = pontos.split(",");
                        if(numberStreet%2!=0){
                            var pIni = parseInt(pts[0]);
                            var pFim = parseInt(pts[1]);
                        }else{
                            var pIni = parseInt(pts[2]);
                            var pFim = parseInt(pts[3]);
                        } */           
                        
                        //centraliza o mapa na rua selecionada
                        var extent = ol.extent.createEmpty();
                        bases.getLayers().forEach(function(layer) {
                            if(layer.get('name') == "mapAtual"){
                                var ruaSelect = layer.getSource().getFeatureById(idRua);
                                ol.extent.extend(extent, ruaSelect.getGeometry().getExtent());
                            }
                        });
                        map.getView().fitExtent(extent, map.getSize());
                    });
                }
        });
    }
//fim GEOLOCALIZAÇÃO