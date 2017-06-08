<?php
session_start();
require '../config/infoBase.php';

usleep(50000);

/* DEFINE CALLBACK (DRAW) E RECUPERA POST
* página reponsável por receber os dados enviados pelos formulários,
* tratar os dados, executar as ações necessárias e enviar uma resposta ao usuário
*
* @author Beto Noronha
*/
$jSON = null;
$CallBack = 'Draw';
$PostData = filter_input_array(INPUT_POST, FILTER_DEFAULT);

//VALIDA AÇÃO
if ($PostData && $PostData['callback_action'] && $PostData['callback'] = $CallBack):
    //PREPARA OS DADOS
    $Case = $PostData['callback_action'];
    unset($PostData['callback'], $PostData['callback_action']);

    $conn = new Connection();

    //ELIMINA CÓDIGOS
    $PostData = array_map('strip_tags', $PostData);

    //SELECIONA AÇÃO
    switch ($Case):
        /* INSERÇÃO DE CONTEÚDOS NOS MAPAS (tabelas) NO BD
        * case responsável por inserir os dados espaciais na tabela
        */
        case 'draw_insert':
                if($conn->getConn()){

                    $date = date("Y/m/d");
                    $PostData['id_user'] = $_SESSION['userLogin']['id'];

                    $sql = "INSERT INTO tb_places ";
                    $sqlKeys = "(geom, date";
                    $sqlValues = "VALUES (st_GeomFromText('{$PostData['geom']}', 4326), '{$date}'";
                    foreach($PostData as $key => $value){
                        if($key!="geom"){
                            $sqlKeys .= ", {$key}";
                            if($value==''){
                                $sqlValues .= ", null";
                            }else{
                                if($key == "name" || $key == "original_number" || $key == "source"){
                                    $sqlValues .= ", '{$value}'";
                                }else{
                                    $sqlValues .= ", {$value}";
                                }
                            }
                            
                        }
                    }

                    $sql .= $sqlKeys.")"." ".$sqlValues.")";
                    $result = pg_query($conn->getConn(), $sql);
                    if(!$result) {
                        $jSON['trigger'] = AjaxErro('Error: verify your data, (*) <b>Required fields</b>', E_USER_ERROR);
                    }

                    $sql = "SELECT * FROM tb_places ORDER BY id DESC limit 1";
                    $result = pg_query($conn->getConn(), $sql);
                    $registro = pg_fetch_all($result)[0];
                    $newID = $registro['id'];

                    if($result){
                        $jSON['trigger'] = AjaxErro('Data inserted successfully');
                        $jSON['draw'] = 'insert';
                        $jSON['drawId'] = $newID;
                        $jSON['clearInput'] = true;
                    }

                }else{
                    $jSON['trigger'] = AjaxErro('Database not conected!', E_USER_ERROR);
                }

            break;

            /* DELETA OS CONTEÚDOS DOS MAPAS (tabelas) NO BD
            */
            case 'draw_delete':
                $sql = "DELETE FROM tb_places WHERE id={$PostData['del_id']}";
                $result = pg_query($conn->getConn(), $sql);
                if(pg_affected_rows($result) <= 0){
                    $jSON['erro'] = true;
                }
            break;

            /* EDIÇÃO DOS CONTEÚDOS NOS MAPAS (tabelas) DO BD
            * case responsável por editar os dados na tabela
            */
            case 'draw_editar':
                if($conn->getConn()){

                    $date = date("Y/m/d");
                    $PostData['id_user'] = $_SESSION['userLogin']['id'];
                    $sql = "UPDATE tb_places SET date='{$date}', id_user={$PostData['id_user']}";

                    $sqlcolumn = "SELECT column_name FROM information_schema.columns WHERE table_name ='tb_places'";
                    $result = pg_query($conn->getConn(), $sqlcolumn);
                    if(pg_num_rows($result) > 0){
                        $atributos = pg_fetch_all($result);
                        foreach ($atributos as $columns){
                            extract($columns);
                            if($column_name != 'id' && $column_name != 'geom' && $column_name != 'id_user' && $column_name != 'date'){
                                $sql .= ", {$column_name}=";
                                $atributo = $PostData[$column_name];
                                if($atributo==''){
                                    $sql .= "null";
                                }else{
                                    if($column_name == "name" || $column_name == "original_number" || $column_name == "source"){
                                        $sql .= "'{$atributo}'";
                                    }else{
                                        $sql .= "{$atributo}";
                                    }
                                } 
                            }
                        }
                    }

                    $sql .= " WHERE id={$PostData['id']}";
                    $result = pg_query($conn->getConn(), $sql);
                    if($result){
                        $jSON['trigger'] = AjaxErro('Data updated successfully');
                        $jSON['draw'] = 'edit';
                        $jSON['drawId'] = $PostData['id'];
                        $jSON['none'] = true;
                    }else{
                        $jSON['trigger'] = AjaxErro('Error: verify your data, obs: do not use quotation marks', E_USER_ERROR);
                    }

                }else{
                    $jSON['trigger'] = AjaxErro('Database not conected!', E_USER_ERROR);
                }
                
            break;

            /* DUPLICAÇÃO DOS CONTEÚDOS NOS MAPAS (tabelas) DO BD
            * case responsável por duplicar os dados espaciais na tabela, fazendo ou não pequenas modificação no seu conteúdo
            */
            case 'draw_duplic':
                 if($conn->getConn()){

                    $date = date("Y/m/d");
                    $mapname = $PostData['map'];
                    $camadasSelect='';
                    for($z=1870;$z<=1930;$z+=10){
                        if(isset($PostData[$z])){
                            $camadasSelect .= $z.', ';
                        }
                    }
                    $sql = "SELECT id, st_astext(geom) geom FROM {$mapname} WHERE id={$PostData['id']}";
                    $result = pg_query($conn->getConn(), $sql);
                    $wktgeom = pg_fetch_all($result)[0];
                    $geom = $wktgeom['geom'];

                    $sqlkeys = "INSERT INTO {$mapname} (geom, rep_id, datemod, camadas";
                    $sqlvalues = " VALUES (st_GeomFromText('{$geom}', 4326), {$PostData['responsavel']}, '{$date}', '{$camadasSelect}'";

                    $sqlcolumn = "SELECT column_name FROM information_schema.columns WHERE table_name ='{$mapname}'";
                    $result = pg_query($conn->getConn(), $sqlcolumn);
                    if(pg_num_rows($result) > 0){
                        $atributos = pg_fetch_all($result);
                        foreach ($atributos as $columns){
                            extract($columns);
                            if($column_name != 'id' && $column_name != 'geom' && $column_name != 'rep_id' && $column_name != 'datemod' && $column_name != 'camadas'){
                                $sqlkeys .= ",{$column_name}";
                                $atributo = $PostData[$column_name];
                                $sqlvalues .= ", '{$atributo}'";
                            }
                        }
                    }
                    $sqlkeys .= ")";
                    $sqlvalues .= ")";
                    $sql = $sqlkeys.$sqlvalues;

                    $result = pg_query($conn->getConn(), $sql);

                    $sql = "SELECT * FROM {$PostData['map']} ORDER BY id DESC limit 1";
                    $result = pg_query($conn->getConn(), $sql);
                    $registro = pg_fetch_all($result)[0];
                    $newID = $registro['id'];

                    if($result){
                        $jSON['trigger'] = AjaxErro('Data updated successfully');
                        $jSON['draw'] = 'duplic';
                        $jSON['drawIdAnt'] = $PostData['id'];
                        $jSON['drawId'] = $newID;
                        //$jSON['none'] = true;
                    }else{
                        $jSON['trigger'] = AjaxErro('Error: verifique seus dados, não é possível utilizar aspas.', E_USER_ERROR);
                    }

                }else{
                    $jSON['trigger'] = AjaxErro('Database not conected!', E_USER_ERROR);
                }
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
