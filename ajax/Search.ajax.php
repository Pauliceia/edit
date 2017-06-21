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
$CallBack = 'Search';
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
        case 'search_end':
            if($conn->getConn()){

                $searchInput = $PostData['searchInput'];

                //limpa a string nome - retirando os espaços
                $searchInput = str_replace("    ", " ", $searchInput);
                $searchInput = str_replace("   ", " ", $searchInput);
                $searchInput = str_replace("  ", " ", $searchInput);
                $searchInput = trim($searchInput);

                //realiza as buscas no banco de dados
                $anoI = $PostData['first_year'];
                $anoF = $PostData['last_year'];
                if(empty($anoI)) $anoI = 1868;
                if(empty($anoF)) $anoF = 1940;

                $resultado = "";

                $sql="SELECT * FROM tb_street WHERE upper(name) LIKE upper('%{$searchInput}%') AND (";
                $sql.="((first_year>={$anoI} AND first_year<={$anoF}) OR first_year=null) OR ";
                $sql.="((last_year>={$anoI} AND last_year<={$anoF}) OR last_year=null) ";
                $sql.=") ORDER BY name ASC limit 5";
                $result = pg_query($conn->getConn(), $sql);

                if(pg_num_rows($result) > 0){
                    $ruas = pg_fetch_all($result);
                    foreach ($ruas as $rua){
                        extract($rua);
                        if(strpos($resultado, $id." -") === false){
                            $resultado .= "<p><span style='display:none;'>".$id." - </span> ".$name."<button id=".$id." geom='geomeria'>&#10146;</button></p>";
                        }
                    }
                }

                $jSON['sucess'] = $resultado;

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
