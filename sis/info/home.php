<?php
$AdminLevel = 1;
if (empty($DashboardLogin) || empty($Admin) || $Admin['level'] < $AdminLevel):
    die('<div style="text-align: center; margin: 5% 0; color: #C54550; font-size: 1.6em; font-weight: 400; background: #fff; float: left; width: 100%; padding: 30px 0;"><b>ACESSO NEGADO:</b> Você não esta logado<br>ou não tem permissão para acessar essa página!</div>');
endif;
?>

<section class="page-weapper">
    <div class="container">
        <?php
        $sql = "SELECT * FROM tb_users WHERE id='{$Admin['id']}'";
        $result = pg_query($Conn->getConn(), $sql);
        if(pg_num_rows($result) > 0){
            $MAP = pg_fetch_all($result)[0];
            extract($MAP);
            ?>
        <header class="row">
           <h1 class="page-header">Update your information, <b><?= $name;?></b></h1>    
        </header>
        <form action="" method="post" enctype="multipart/form-data">
            <div class="row">
                <input type="hidden" name="callback" value="Users">
                <input type="hidden" name="callback_action" value="user_edit">
                <input type="hidden" name="id" value="<?= $id ?>">
        
                <article class="col-lg-6">
                    <div class="form-group">
                        <label for="name">&#10143; Name:</label>
                        <input type="text" name="name" class="form-control" value="<?= $name ?>" required>
                    </div>
                    <?php
                        if($level == 2){
                            $funcao = 'Editor';
                        }else{
                            $funcao = 'Administrador';
                        }
                    ?>
                    <div class="form-group">
                        <label for="function">&#10143; Function:</label>
                        <input type="text" name="level" class="form-control" value="<?= $funcao ?>" disabled required>
                    </div>
                </article>
                <article class="col-lg-6">
                    <div class="form-group">
                        <label for="email">&#10143; Email:</label>
                        <input type="text" name="email" class="form-control" value="<?= $email ?>" required>
                    </div>
                    <div class="form-group">
                        <label for="institution">&#10143; Institution:</label>
                        <input type="text" name="institution" class="form-control" value="<?= $institution ?>" required>
                    </div>
                </article>
                <div class="newpass" style="display: none;">
                    <div class="col-lg-12">
                        <div class="form-group">
                            <label for="passCurrent">&#10143; Current password:</label>
                            <input type="password" name="passAtual" class="form-control" placeholder="******">
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="form-group">
                            <label for="passCurrent">&#10143; New Password:</label>
                            <input type="password" name="newPass" class="form-control" placeholder="******">
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="form-group">
                            <label for="passCurrent">&#10143; Repeat new Password:</label>
                            <input type="password" name="repNewPass" class="form-control" placeholder="******">
                        </div>
                    </div>
                </div>

            </div>

            <br>
            <a class="btn btn-info actnewPass" style="float: left; margin-right:8px;">Alter Password</a>
            <img class="form_load" style="float: right; margin-top: 5px; margin-left: 10px; display: none;" alt="Enviando Requisição!" title="Enviando Requisição!" src="images/load.gif"/>
            <button class="btn btn-success">Update Infos</button>

            <div class="clear"></div><br>
            <div class="callback_return m_botton">
                <?php
                    if (!empty($_SESSION['trigger_login'])):
                        echo $_SESSION['trigger_login'];
                        unset($_SESSION['trigger_login']);
                    endif;
                ?>
            </div>
        </form>
        <?php
        }else{
             echo '<br>';
             echo Erro("User does not exist!");
        }
    ?>
        <div class="clear"></div>
    </div>
</section>