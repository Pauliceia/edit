<?php
$AdminLevel = 1;
if (empty($DashboardLogin) || empty($Admin) || $Admin['level'] < $AdminLevel ):
    die('<div style="text-align: center; margin: 5% 0; color: #C54550; font-size: 1.6em; font-weight: 400; background: #fff; float: left; width: 100%; padding: 30px 0;"><b>ACESSO NEGADO:</b> Você não esta logado<br>ou não tem permissão para acessar essa página!</div>');
endif;
?>

<script src="https://maps.googleapis.com/maps/api/js?v=3&key=AIzaSyBOzBrY44aUb2j3VIi4faeCIrhgy9-MSIU"></script>
<script src="js/ol4/ol-debug.js" defer></script>

<script src="js/map/colorDuplicPlaces.js" defer></script>
<script src="js/map/stylesFeatures.js" defer></script>

<script src="js/map/index.js" defer></script>
<script src="js/map/rendMap.js" defer></script>

<script src="js/map/actDefault.js" defer></script>
<script src="js/map/actPoints.js" defer></script>
<script src="js/map/actLine.js" defer></script>
<script src="js/map/actInfos.js" defer></script>

<script src="js/map/default.func.js" defer></script>

<section class="mapedit" id="mapafixo"> 

    <!--- ### BOTÕES ### -->
        <!--- btn LAYERS -->
        <div class="base_btn layerB">
            <a class='btn_draw' id="layersModel"><span class="glyphicon glyphicon-folder-open"></span> LAYERS</a>
        </div>

        <!--- btn SEARCH -->
        <div class="base_btn searchB">
            <a class='btn_draw glyphicon glyphicon-search' id='searchModel'></a>
        </div>

        <!--- btn AÇÕES DESENHO -->
        <div class="base_btn typeGeomB">
            <span style="color: #3366FF; font-size: 2em; font-weight: 600;text-shadow: 1px 1px 1px #333;">&#9997;</span>
            <a class='btn_draw drawPoint glyphicon glyphicon-record' id='pointsModel'></a>
        </div>

        <!--- btn REVERSE STREET -->
        <div class="base_btn reverseStrB">
            <a class='btn_draw glyphicon glyphicon-sort' id='reverseModel'></a>
        </div>

        <!--- btn INFOS -->
        <div class="base_btn infoB">
            <a class='btn_draw glyphicon glyphicon-info-sign' id='infoModel'></a>
        </div>

        <!--- btn RECARREGAMENTO de PÁGINA -->
        <div class="base_btn recarregB">
            <a class='btn_draw glyphicon glyphicon-refresh' id='recEditModel'></a>
            <a class='btn_draw glyphicon glyphicon-remove' id='recDefModel'></a>
        </div>
    <!--- ### FIM BOTÕES ### -->

    <!--- TOOBAR dos Desenhos -->
    <div id="pointsOptions" class="btn_edit">
        <p class="btn" id="panPoint">[ ]</p>
        <p class="btn line" id="selectStLine">Line</p>
        <p class="btn" id="drawPoint">Draw</p>
        <p class="btn" id="editPoint">Edit</p>
        <p class="btn" id="duplicPoint">Duplicate</p>
        <p class="btn" id="erasePoint">Erase</p>
    </div>
    <!---fim toobar -->

    <!--- TOOBAR DE LAYERS -->
    <?php require 'tpl/draw/layers.php'; ?>

    <!--- FORMULARIO DE ENVIO DO DADO -->
    <?php require 'tpl/draw/insertdados.php'; ?>

    <!--- FORMULARIO DE EDIÇÃO DO DADO -->
    <?php require 'tpl/draw/editdados.php'; ?>

    <!--- FORMULARIO DE DUPLICAÇÃO DO DADO -->
    <?php require 'tpl/draw/duplicdados.php'; ?>

    <!--- TOOBAR DE PESQUISA (GEOCODIFICAÇÃO) -->
    <?php require 'tpl/draw/search.php'; ?>

    <!--- TOOBAR DE REVERSE STREET -->
    <?php require 'tpl/draw/reverse.php'; ?>

    <!--- TOOBAR DE INFORMÇÕES -->
    <?php require 'tpl/draw/infos.php'; ?>
    
    <!--- TOOBAR DE SELEÇÃO DE CAMADAS (FEATURE por data) -->
    <?php require 'tpl/draw/selectCamadas.php'; ?>

    <img src="images/logo.png" title="logo Pauliceia-Edit">
    <a href="dashboard.php?p=home" title="portal web Pauliceia-Edit" class="icon-office btnbackMap">Voltar ao Menu</a>

</section>
<div class="clear"></div>