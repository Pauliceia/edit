<?php
ob_start();
session_start();

require 'config/infoBase.php';
$Conn = new Connection();

/*
* Lendo informações do usuário
* Nesse bloco, é salvado os dados do usuário em array/dicionário chamado 'Admin'
* Para se obter alguma informação do usuário logado no decorrer do programa, é necessáio chamar: $Admin['nome'] => para o nome | $Admin['email'] => para o email ...
*/
if (isset($_SESSION['userLogin']) && isset($_SESSION['userLogin']['level']) && $_SESSION['userLogin']['level'] >= 1):
    $sql = "SELECT * FROM tb_users WHERE id = {$_SESSION['userLogin']['id']}";
    $result = pg_query($Conn->getConn(), $sql);
    $ArrayResult = pg_fetch_all($result);
    if (!$ArrayResult || $ArrayResult[0]['level'] < 1):
        unset($_SESSION['userLogin']);
        header('Location: ./index.php');
    else:
        $Admin = $_SESSION['userLogin'];
        $DashboardLogin = true;
    endif;
else:
    unset($_SESSION['userLogin']);
    header('Location: ./index.php');
endif;

/*
* Deslogar no portal
* Ao receber: 'logoff=true' em sua url, o sistema mata a sessão do usuário e redireciona para a página de login.
*/
$LogOff = filter_input(INPUT_GET, 'logoff', FILTER_VALIDATE_BOOLEAN);
if ($LogOff):
    $_SESSION['trigger_login'] = Erro("<b>LOGOFF:</b> Bye {$Admin['name']}, logoff success!");
    unset($_SESSION['userLogin']);
    header('Location: ./index.php');
endif;

$getViewInput = filter_input(INPUT_GET, 'p', FILTER_DEFAULT);
$getView = ($getViewInput == 'home' ? 'home' : $getViewInput);

?>
<!DOCTYPE html>
<html lang="pt-br">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <title>Sistema WEB - <?= P_NAME; ?></title>
        <meta name="description" content="<?= P_DESC; ?>"/>
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <meta name="robots" content="noindex, nofollow"/>

        <link rel="icon" href="images/favicon.png" />
        <link href='https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800' rel='stylesheet' type='text/css'>
        <link href='https://fonts.googleapis.com/css?family=Source+Code+Pro:300,500' rel='stylesheet' type='text/css'>
        <link rel="base" href="<?= BASE; ?>">

        <link rel="stylesheet" href="css/main.css"/>
        <link rel="stylesheet" href="css/main_responsive.css" media="screen and (max-width: 1280px)"/>
        <link rel="stylesheet" href="css/lib/bootstrap.min.css"/>
        <link rel="stylesheet" href="css/lib/ol.css"/>

        <script src="js/lib/jquery.js"></script>
        <script src="js/lib/cookie.js"></script>
        <script src="js/lib/jquery.form.js"></script>
        <script src="js/lib/maskinput.js"></script>
        <script src="js/lib/bootstrap.min.js"></script>
        <script src="js/main.js"></script>

    </head>
    <body>
        <header class="navbar navbar-default">
            <div class="container">
                <div class="logo">
                    <a href="dashboard.php?p=home" title="pauliceia"><img src="images/logo.png" alt="[logo pauliceia]" title="logo pauliceia"/></a>
                </div>
                <div class="banner">
                    <p>Welcome <b><?= $Admin['name']; ?></b>! </p>
                    <a class="btn btn-default glyphicon glyphicon-log-out" title="logoff <?= P_NAME; ?>!" href="dashboard.php?p=home&logoff=true"></a>
                </div>
            </div>
        </header>

        <?php
        //QUERY STRING - URL DINÂMICA
        if (!empty($getView)):
             $includepatch = __DIR__ . '/sis/' . strip_tags(trim($getView) . '.php');
        else:
             $includepatch = __DIR__ . '/sis/' . 'dashboard.php';
        endif;
        if (file_exists($includepatch)):
             require_once($includepatch);
        else:
             $_SESSION['trigger_controll'] = "<b>DESCULPE:</b> The controller <b class='fontred'>sis/{$getView}.php</b> not found!";
             header('Location: dashboard.php?p=home');
             endif;
        //FIM QUERY STRING
        ?>

        <ul class="pager"><li><a href="dashboard.php?p=home">&#8617; BACK MENU</a></li></ul>
        <br>
       <footer class="navbar navbar-default">
            <div class="content">
                <p>2017 - Pauliceia 2.0</p>
            </div>
        </footer>
    </body>
</html>
<?php
ob_end_flush();
