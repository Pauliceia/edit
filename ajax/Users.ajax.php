<?php
session_start();
require '../config/infoBase.php';

usleep(50000);

/* DEFINE CALLBACK (INFO) E RECUPERA POST - usuarios
* página reponsável por receber os dados enviados pelos formulários,
* tratar os dados, executar as ações necessárias e enviar uma resposta ao usuário
*
* @author Beto Noronha
*/
$jSON = null;
$CallBack = 'Info';
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
        /* EDIÇÃO DE USUÁRIO NO BD
        * case responsável por verificar se o usuário existe no BD
        * e posteriormente editar seu conteúdo
        */
        case 'user_edit':
                if($conn->getConn()){

                    if(empty($PostData['passAtual']) && empty($PostData['newPass']) && empty($PostData['repNewPass'])){
                        $sql = "UPDATE tb_users SET name='{$PostData['name']}', institution='{$PostData['institution']}' WHERE id={$PostData['id']}";
                        $result = pg_query($conn->getConn(), $sql);
                        $jSON['trigger'] = AjaxErro('User edited successfully!');
                    }else{
                        if(empty($PostData['passAtual']) || empty($PostData['newPass']) || empty($PostData['repNewPass'])){
                            $jSON['trigger'] = AjaxErro('Complete all fields!', E_USER_ERROR);
                        }else{
                            $passAtual = hash('sha512', $PostData['passAtual']);
                            $sql = "SELECT * FROM tb_users WHERE id={$PostData['id']} AND password='{$passAtual}'";
                            $result = pg_query($conn->getConn(), $sql);
                            if(pg_num_rows($result) > 0){
                                $jSON['trigger'] = AjaxErro('User edited successfully!');
                                if($PostData['newPass'] == $PostData['repNewPass']){
                                    $newPass = hash('sha512', $PostData['newPass']);
                                    $sql = "UPDATE tb_users SET name='{$PostData['name']}', institution='{$PostData['institution']}', password='{$newPass}' WHERE id={$PostData['id']}";
                                    $result = pg_query($conn->getConn(), $sql);
                                    $jSON['trigger'] = AjaxErro('User edited successfully!');
                                    $jSON['redirect'] = 'dashboard.php?p=info/home';
                                }else{
                                    $jSON['trigger'] = AjaxErro('The password and its repetition are different!', E_USER_ERROR);
                                }
                             }else{
                                $jSON['trigger'] = AjaxErro('Current password is incorrect!', E_USER_ERROR);
                             }
                        }
                    }

                }else{
                    $jSON['trigger'] = AjaxErro('database not connected!', E_USER_ERROR);
                }
            break;

            /* ADICIONAR USUÁRIO NO BD
            * case responsável por verificar os dados inseridos
            * e salvar estes no BD, criando assim um novo usuário
            */
            case 'user_add':
            if (in_array('', $PostData)){
                $jSON['trigger'] = AjaxErro('Complete all fields!', E_USER_NOTICE);
            }else{
                if($conn->getConn()){
                    $sql = "SELECT * FROM tb_users WHERE email='{$PostData['email']}'";
                    $result = pg_query($conn->getConn(), $sql);
                    if(pg_num_rows($result) > 0){
                        $jSON['trigger'] = AjaxErro('Email already registered in the system!', E_USER_ERROR);
                    }else{
                        $date = date("Y/m/d");
                        if($PostData['pass'] == $PostData['rePass']){
                            $PostData['pass'] = hash('sha512', $PostData['pass']);
                            $sql = "INSERT INTO tb_users (name, email, institution, password, level, datestart, status) VALUES ('{$PostData['name']}', '{$PostData['email']}', '{$PostData['institution']}', '{$PostData['pass']}', 2, '{$date}', 1)";
    
                            $result = pg_query($conn->getConn(), $sql);
                            $jSON['trigger'] = AjaxErro('User created success!');
                            $jSON['redirect'] = 'dashboard.php?p=info/add';
                        }else{
                            $jSON['trigger'] = AjaxErro('The password and its repetition are different!', E_USER_ERROR);
                        }
                    }

                }else{
                    $jSON['trigger'] = AjaxErro('database not connected!', E_USER_ERROR);
                }
            }
            break;

            /* DELETAR USUÁRIO DO TIPO editor (nivel2) DO BD
            * case responsável por verificar se o usuário(id) existe no BD
            * e posteriormente deleta-lo
            */
            case 'user_del':
                if($conn->getConn()){
                    $sql = "DELETE FROM tb_users WHERE id={$PostData['del_id']}";
                    $result = pg_query($conn->getConn(), $sql);
                    $jSON['redirect'] = 'dashboard.php?p=info/del';
                }else{
                    $jSON['trigger'] = AjaxErro('database not connected!', E_USER_ERROR);
                }
            break;

            /* PESQUISA DINÂMICA DE USUÁRIO NO BD
            * case responsável realizar uma pesquisa dos usuário cadastrados no BD, de acordo com as especificações passadas pelo usuário.
            * caso seja encontrado algum usuário, redireciona-se a uma url com os parametros escolhidos
            */
            case 'search_user':
                if(empty($PostData['search'])){
                    $jSON['redirect'] = 'dashboard.php?p=info/del';
                }else{
                    if($conn->getConn()){
                        $sql = "SELECT * FROM tb_users WHERE level<3 AND (name  ~*  '{$PostData['search']}' OR email ~* '{$PostData['search']}' OR institution ~* '{$PostData['search']}')";
                        $result = pg_query($conn->getConn(), $sql);
                        if(pg_num_rows($result) <= 0){
                            $jSON['trigger'] = AjaxErro('Não foi encontrado nenhum usuário com <b>'.$PostData['search'].'</b>', E_USER_ERROR);
                            $jSON['redirect'] = 'dashboard.php?p=info/del';
                        }else{
                            $jSON['redirect'] = 'dashboard.php?p=info/del&search='.$PostData['search'];
                        }
                    }else{
                        $jSON['trigger'] = AjaxErro('Banco de Dados não conectado!', E_USER_ERROR);
                    }
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