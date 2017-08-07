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

                    if(!isset($PostData['id_street']) || empty($PostData['id_street'])){
                        $jSON['trigger'] = AjaxErro('Error: Select a street or avenue</b>', E_USER_ERROR);
                    }else{
                        if(!isset($PostData['geom']) || empty($PostData['geom'])){
                            $jSON['trigger'] = AjaxErro('Error: add point into map</b>', E_USER_ERROR);
                        }else{

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
                                        if($key == "name" || $key == "original_number" || $key == "source" || $key == "description"){
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
                        }
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

                    if(!isset($PostData['id_street']) || empty($PostData['id_street'])){
                        $jSON['trigger'] = AjaxErro('Error: Select a street or avenue</b>', E_USER_ERROR);
                    }else{

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
                                        if($column_name == "name" || $column_name == "original_number" || $column_name == "source" || $column_name == "description"){
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
                        }else{
                            $jSON['trigger'] = AjaxErro('Error: verify your data, (*) <b>Required fields', E_USER_ERROR);
                        }
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
                if(!isset($PostData['id_street']) || empty($PostData['id_street'])){
                    $jSON['trigger'] = AjaxErro('Error: Select a street or avenue</b>', E_USER_ERROR);
                }else{  

                    $date = date("Y/m/d");
                    $PostData['id_user'] = $_SESSION['userLogin']['id'];
                    $antId = $PostData['id'];

                    unset($PostData['id']);

                    $sql = "SELECT *, st_astext(geom) as geom FROM tb_places WHERE id={$antId}";
                    $result = pg_query($conn->getConn(), $sql);
                    $wktgeom = pg_fetch_all($result)[0];
                    $geom = $wktgeom['geom'];
                    $first_day = $wktgeom['first_day'];
                    $first_month = $wktgeom['first_month'];
                    $first_year = $wktgeom['first_year'];
                    $last_day = $wktgeom['last_day'];
                    $last_month = $wktgeom['last_month'];
                    $last_year = $wktgeom['last_year'];
                    
                    if($first_day == $PostData['first_day'] && $first_month == $PostData['first_month'] && $first_year == $PostData['first_year'] && $last_day == $PostData['last_day'] && $last_month == $PostData['last_month'] && $last_year == $PostData['last_year']){
                        $jSON['trigger'] = AjaxErro('<b>Error</b>! Change dates', E_USER_ERROR);
                    }else{

                        $sql = "INSERT INTO tb_places ";
                        $sqlKeys = "(geom, date";
                        $sqlValues = "VALUES (st_GeomFromText('{$geom}', 4326), '{$date}'";

                        foreach($PostData as $key => $value){
                            if($key!="geom"){
                                $sqlKeys .= ", {$key}";

                                if($value==''){
                                    $sqlValues .= ", null";
                                }else{
                                    if($key == "name" || $key == "original_number" || $key == "source" || $key == "description"){
                                        $sqlValues .= ", '{$value}'";
                                    }else{
                                        $sqlValues .= ", {$value}";
                                    }
                                }
                            }
                        }

                        $sql .= $sqlKeys.")"." ".$sqlValues.")";
                        $result = pg_query($conn->getConn(), $sql);
                        $sql = "SELECT * FROM tb_places ORDER BY id DESC limit 1";
                        $result = pg_query($conn->getConn(), $sql);
                        $registro = pg_fetch_all($result)[0];
                        $newID = $registro['id'];

                        if($result){
                            $jSON['trigger'] = AjaxErro('data replicated successfully');
                            $jSON['draw'] = 'duplic';
                            $jSON['drawIdAnt'] = $antId;
                            $jSON['drawId'] = $newID;
                            $jSON['none'] = true;
                        }else{
                            $jSON['trigger'] = AjaxErro('Error: verify your data, (*) <b>Required fields.', E_USER_ERROR);
                        }
                    }
                }

            }else{
                $jSON['trigger'] = AjaxErro('Database not conected!', E_USER_ERROR);
            }
            break;

            /* INVERSÃO DO SENTIDO DA RUA
            * salva no banco a nova geometria da rua, invertida pelo sistema.
            */
            case 'draw_reverse':
            if($conn->getConn()){
                if( (!isset($PostData['id']) || empty($PostData['id'])) || (!isset($PostData['geom']) || empty($PostData['geom']))){
                    $jSON['trigger'] = AjaxErro('Error: Select a line and edit</b>', E_USER_ERROR);
                }else{  
                    $id = $PostData['id'];
                    $geom = $PostData['geom'];

                    $sql = "UPDATE tb_street SET geom=st_tranform('{$geom}', 4326) WHERE id={$id}";
                    //realiza o procedimento
                    if($sql!=""){
                        $jSON['trigger'] = AjaxErro('street reversed successfully');
                        $jSON['none'] = true;
                    }else{
                        $jSON['trigger'] = AjaxErro('ERROR: street not reversed', E_USER_ERROR);
                    }          
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
