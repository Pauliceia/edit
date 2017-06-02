<?php
$AdminLevel = 3;
if (empty($DashboardLogin) || empty($Admin) || $Admin['level'] < $AdminLevel):
    die('<div style="text-align: center; margin: 5% 0; color: #C54550; font-size: 1.6em; font-weight: 400; background: #fff; float: left; width: 100%; padding: 30px 0;"><b>ACESSO NEGADO:</b> Você não esta logado<br>ou não tem permissão para acessar essa página!</div>');
endif;
?>

<section class="page-weapper">
    <div class="container">

        <header class="row">
           <h1 class="page-header">Delete Users</h1>    
        </header>

        <form action="" method="post" enctype="multipart/form-data">
            <div class="row">
                <input type="hidden" name="callback" value="Users">
                <input type="hidden" name="callback_action" value="search_user">

                <div class="input-group">
                    <div class="form-group has-feedback">
                        <input type="text" class="form-control" name="search" placeholder="Search Name, email or institution: " <?php if(isset($_GET['search']) && !empty($_GET['search'])){ echo 'value="'.$_GET['search'].'"'; } ?>>
                        <span class="glyphicon glyphicon-search form-control-feedback" aria-hidden="true"></span>
                    </div>
                    <span class="input-group-btn">
                        <button class="btn btn-default" >Search!</button>
                        <img class="form_load" style="float: right; margin-top: 20px; margin-left: 10px; display: none;" alt="Enviando Requisição!" title="Enviando Requisição!" src="images/load.gif"/>
                    </span>
                </div>

                <div class="clear"></div><br>
                <div class="callback_return m_botton">
                    <?php
                        if (!empty($_SESSION['trigger_login'])):
                            echo $_SESSION['trigger_login'];
                            unset($_SESSION['trigger_login']);
                        endif;
                    ?>
                </div>
            </div>
        </form>
        
        <table class="table table-hover">
            <tr style="background: #f3f3f3;">
                <td><center><b>Nome</b></center></td>
                <td><center><b>E-mail</b></center></td>
                <td><center><b>Excluir</b></center></td>
            </tr>

        <?php
            if(isset($_GET['search']) && !empty($_GET['search'])){
                $sql = "SELECT * FROM tb_users WHERE level<3 AND (name  ~*  '{$_GET['search']}' OR email ~* '{$_GET['search']}' OR institution ~* '{$_GET['search']}') ORDER BY datestart DESC";
            }else{
                $sql = "SELECT * FROM tb_users WHERE level<3 ORDER BY datestart DESC";
            }
            $result = pg_query(Connection::getConn(), $sql);
            if(pg_num_rows($result) > 0){
                foreach (pg_fetch_all($result) as $Colaborador):
                extract($Colaborador);
                ?>
                <tr class="del_colaborador" id="<?= $id ?>">
                    <td><center><?= $name ?></center></td>
                    <td><center><?= $email ?></center></td>
                    <td>
                        <center><span rel='del_colaborador' class='btn j_delete_action icon-cancel-circle' id='<?= $id ?>'>DELETE</span>
                        <span rel='del_colaborador' callback='Users' callback_action='user_del' class='btn j_delete_action_confirm icon-warning' style='display:none; background: #cccc00' id='<?= $id ?>'>CONFIRMAR</span></center>
                    </td>
                </tr>
                <?php
                endforeach;
            }else{
                echo '<br>';
                echo Erro("{$Admin['name']}, there are no users to delete");
            }
        ?>
        </table>
    <div class="clear"></div>
</section>