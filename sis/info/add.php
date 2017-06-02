<?php
$AdminLevel = 3;
if (empty($DashboardLogin) || empty($Admin) || $Admin['level'] < $AdminLevel):
    die('<div style="text-align: center; margin: 5% 0; color: #C54550; font-size: 1.6em; font-weight: 400; background: #fff; float: left; width: 100%; padding: 30px 0;"><b>ACESSO NEGADO:</b> Você não esta logado<br>ou não tem permissão para acessar essa página!</div>');
endif;
?>

<section class="page-weapper">
    <div class="container">

        <header class="row">
           <h1 class="page-header">Add Users</h1>    
        </header>
        <form action="" method="post" enctype="multipart/form-data">
            <div class="row">
                <input type="hidden" name="callback" value="Users">
                <input type="hidden" name="callback_action" value="user_add">

                <article class="col-lg-6">
                    <div class="form-group">
                        <label for="name">&#10143; Name:</label>
                        <input type="text" name="name" class="form-control" placeholder="name: " required>
                    </div>
                    <div class="form-group">
                        <label for="pass">&#10143; Password:</label>
                        <input type="password" name="pass" class="form-control" placeholder="******" required>
                    </div>
                    <div class="form-group">
                        <label for="rePass">&#10143; Repeat Password:</label>
                        <input type="password" name="rePass" class="form-control" placeholder="******" required>
                    </div>
                </article>

                <article class="col-lg-6">
                    <div class="form-group">
                        <label for="email">&#10143; Email Adress:</label>
                        <input type="email" name="email" class="form-control" placeholder="Email: " required>
                    </div>
                    <div class="form-group">
                        <label for="institution">&#10143; Institution:</label>
                        <input type="text" name="institution" class="form-control" placeholder="Institution: " required>
                    </div>
                </article>
            </div>

            
                <div class="callback_return">
                    <?php
                        if (!empty($_SESSION['trigger_login'])):
                            echo $_SESSION['trigger_login'];
                            unset($_SESSION['trigger_login']);
                        endif;
                    ?>
                </div>

            <img class="form_load" style="float: right; margin-top: 5px; margin-left: 10px; display: none;" alt="Enviando Requisição!" title="Enviando Requisição!" src="images/load.gif"/>
            <button class="btn btn-success">Adicionar Usuário</button>
        </form>
        
       
    </div>
</section>