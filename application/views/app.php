<html>
<head>
  <meta charset="utf-8" />
  <title>Eshop</title>
  <link rel="icon" type="image/png" href="assets/img/logo.png"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="author" content="https://tsalikidis.dev">
  
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

  <link rel="stylesheet" href="css/vendor.min.css">
  <link rel="stylesheet" href="css/styles.min.css">
  <link rel="stylesheet" href="assets/css/custom.css">
  <script src="js/modernizr.min.js"></script>
  <script src="js/vendor.min.js"></script>

  <script src="assets/js/react.development.js"></script>
  <script src="assets/js/react-dom.development.js"></script>
  <script src="assets/js/react-router-dom.min.js"></script>
  <script src="assets/js/babel.js"></script>
  <script src="assets/js/i18next.min.js"></script>
  <script src="assets/js/react-i18next.min.js"></script>
  <script src="assets/js/axios.min.js"></script>

  <script src="assets/js/i18n.js"></script>
  <script type="text/babel" src="assets/js/App/App.js"></script>
  <script type="text/babel" src="assets/js/Home/Home.js"></script>
</head>
<body>
  <div id='root'></div>
  <script>
    let baseUrl = '<?= base_url(); ?>';
  </script>
  <script type='text/babel'>
    ReactDOM.render(
        <ReactI18next.I18nextProvider i18n={i18next}>
          <App/>
        </ReactI18next.I18nextProvider>,
      document.querySelector('#root')
    );
  </script>
</body>
</html>