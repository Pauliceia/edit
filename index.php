<?php
ob_start();
session_start();

//Executa a conexão com o banco de dados
require 'config/infoBase.php';
$Conn = new Connection();

//verifica se o usuário tem uma sessão aberta no servidor, para que não precise logar-se novamente
if(isset($_SESSION['userLogin']) && isset($_SESSION['userLogin']['level']) && $_SESSION['userLogin']['level'] >= 1){
  header('Location: dashboard.php?p=home');
}

?>
<!DOCTYPE html>
<html lang="pt-br">
    <head>
    <meta charset="UTF-8">
        <meta name="mit" content="004671">
        <title><?= P_NAME; ?></title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <meta name="description" content="<?= P_DESC; ?>"/>
        <meta name="robots" content="noindex, nofollow"/>

        <link rel="shortcut icon" href="images/favicon.png" />
        <link href='https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800' rel='stylesheet' type='text/css'>
        <link href='https://fonts.googleapis.com/css?family=Source+Code+Pro:300,500' rel='stylesheet' type='text/css'>
        <link rel="base" href="<?= BASE; ?>">

        <link rel="stylesheet" href="css/lib/bootstrap.min.css"/>
        <link rel="stylesheet" href="css/index.css"/>
        
    </head>
    <body>
        <div class="container"> 

            <form name="login_form" action="" method="post" enctype="multipart/form-data" class="form-signin">
                <div class='form-signin-heading'>
                    <img class="logo" alt="<?= P_NAME; ?>" title="<?= P_NAME; ?>" src="images/logo.png"/>
                </div>
                <div class="callback_return">
                    <?php
                    if (!empty($_SESSION['trigger_login'])):
                        echo $_SESSION['trigger_login'];
                        unset($_SESSION['trigger_login']);
                    endif;
                    ?>
                </div>
                <input type="hidden" name="callback" value="Login">
                <input type="hidden" name="callback_action" value="login_submit">

                <div class="input-group">
                    <span class="input-group-addon" id="basic-addon1"><span class="glyphicon glyphicon-user"></span></span>
                    <input type="email" name="email" class="form-control" aria-describedby="basic-addon1" placeholder="Email Address" required autofocus/>
                </div>
                <input type="password" name="password" class="form-control" placeholder="Password" required autofocus/>

                <button class="btn btn-lg btn-primary btn-block">Sign in!</button>
                <img class="form_load" alt="Enviando Requisição!" title="Enviando Requisição!" style="margin: 10px; display: none; float:right;" src="images/load.gif"/>
                
            </form>
            
        </div>

        <script src="js/lib/jquery.js"></script>
        <script src="js/lib/jquery.form.js"></script>
        <script src="js/lib/html5shiv.js"></script>
        <script src="js/lib/maskinput.js"></script>
        <script src="js/lib/bootstrap.min.js"></script>
        <script src="js/main.js"></script>
    </body>
</html>
<?php
ob_end_flush();
