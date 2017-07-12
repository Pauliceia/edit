<?php
session_start();
require '../config/infoBase.php';

usleep(50000);

/**
 * Maps.class
 * Classe responsável por ler os dados de um maps em um banco de dados 
 * e retornar um json com esses dados
 *
 * @author Beto Noronha
 */
$jSON = null;
$CallBack = 'MapJson';
$PostData = filter_input_array(INPUT_POST, FILTER_DEFAULT);

//VALIDA AÇÃO
if ($PostData && $PostData['callback_action'] && $PostData['callback'] = $CallBack):
    //PREPARA OS DADOS
    $Case = $PostData['callback_action'];
    unset($PostData['callback'], $PostData['callback_action']);

    $Conn = new Connection();

    //ELIMINA CÓDIGOS
    $PostData = array_map('strip_tags', $PostData);

    //SELECIONA AÇÃO
    switch ($Case):
        case 'getRes':
            $name = $PostData['tbName'];
            $sqljson = "SELECT id";

            //LEITURA DAS COLUNAS PERTENCENTES A TABELA ATUAL
            $sql = "SELECT column_name FROM information_schema.columns WHERE table_name ='{$name}'";
            $result = pg_query($Conn->getConn(), $sql);
            if(pg_num_rows($result) > 0){
                $atributos = pg_fetch_all($result);
                foreach ($atributos as $columns){
                    extract($columns);
                    if($column_name != 'id' && $column_name != 'geom'){
                        //INSERÇÃO DAS COLUNAS NO SQL PARA LEITURA DOS DADOS GEOGRAFICOS
                        $sqljson .= ", {$column_name}";
                    }
                }
            }

            //CONCLUSÃO DA CONSTRUÇÃO DO SQL DOS DADOS GEOGRAFICOS, COM BASE NO TIPO DE DADO A SER CADASTRADO
            if($name=='tb_places') $sqljson .= ", st_asgeojson(st_transform(geom,4326)) AS geojson FROM {$name}";
            else $sqljson .= ", st_asgeojson(st_transform(geom,3857)) AS geojson FROM {$name}";

            $result = pg_query($Conn->getConn(), $sqljson);

            //CONSTRUÇÃO DA Build GeoJSON
            $output = '';
            $rowOutput = '';
            function escapeJsonString($value) {
                $escapers = array("\\", "/", "\"", "\n", "\r", "\t", "\x08", "\x0c");
                $replacements = array("\\\\", "\\/", "\\\"", "\\n", "\\r", "\\t", "\\f", "\\b");
                $result = str_replace($escapers, $replacements, $value);
                return $result;
            }
            while ($row = pg_fetch_assoc($result)) {
                $rowOutput = (strlen($rowOutput) > 0 ? ',' : '') . '{"type": "Feature", "geometry": ' . $row['geojson'] . ', "properties": {"tabName":"'.$name.'",';
                $props = '';
                $id    = '';
                foreach ($row as $key => $val) {
                    if ($key != "geojson") {
                        $props .= (strlen($props) > 0 ? ',' : '') . '"' . $key . '":"' . escapeJsonString($val) . '"';
                    }
                    if ($key == "id") {
                        $id .= ',"id":"' . escapeJsonString($val) . '"';
                    }
                }
                $rowOutput .= $props . '}';
                $rowOutput .= $id;
                $rowOutput .= '}';
                $output .= $rowOutput;
            }
            $output = '{ "type": "FeatureCollection", "features": [ ' . $output . ' ]}';

            //get features duplicadas
            if($name=='tb_places') {
                $sql = "select st_astext(geom) AS geojson,count(*) from tb_places group by geojson having count(*) > 1";
                $result = pg_query($Conn->getConn(), $sql);
                $duplic = [];
                if(pg_num_rows($result) > 0){
                    foreach (pg_fetch_all($result) as $geometrias){
                        extract($geometrias);
                        array_push($duplic,$geojson);
                    }
                }
                $jSON['PlacesDuplicated'] = $duplic;
            }

            $jSON['ResultJson'] = $output;
        
        break;
    endswitch;

    //RETORNA O CALLBACK
    if ($jSON):
        echo json_encode($jSON);
    else:
        $jSON['trigger'] = AjaxErro('<b>Desculpe.</b> Mas uma ação do sistema não respondeu corretamente. Ao persistir, contate o desenvolvedor!', E_USER_ERROR);
        echo json_encode($jSON);
    endif;
else:
    //ACESSO DIRETO
    die('<br><br><br><center><h1>Acesso Restrito!</h1></center>');
endif;
