<?php

/**
 * Maps.class
 * Classe responsável por ler os dados de um maps em um banco de dados 
 * e retornar um json com esses dados
 *
 * @author Beto Noronha
 */
class Maps {

    public function generateJson($name){
        $Conn = new Connection();
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
        $sqljson .= ", st_asgeojson(st_transform(geom,4326)) AS geojson FROM {$name}";

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
        
        return $output;
    }
}