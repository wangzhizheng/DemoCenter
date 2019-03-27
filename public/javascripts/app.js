window.addEventListener('load', function() {

    var idToken;
    var accessToken;
    var expiresAt;

    var webAuth = new auth0.WebAuth({
        domain: 'wangzz.au.auth0.com',
        clientID: 'dG11rEPaqPG-gKdaZa6PcsxJrRl_TYMw',
        responseType: 'token id_token',
        scope: 'openid',
        redirectUri: window.location.href
    });

    var loginBtn = document.getElementById('btn-login');

    loginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        webAuth.authorize();
    });
    // ...
    var loginStatus = document.querySelector('.container h4');
    var loginView = document.getElementById('login-view');
    var homeView = document.getElementById('home-view');
  
    // buttons and event listeners
    var homeViewBtn = document.getElementById('btn-home-view');
    var loginBtn = document.getElementById('btn-login');
    var logoutBtn = document.getElementById('btn-logout');
  
    homeViewBtn.addEventListener('click', function() {
      homeView.style.display = 'inline-block';
      loginView.style.display = 'none';
    });
  
    logoutBtn.addEventListener('click', logout);
  
    function handleAuthentication() {
      webAuth.parseHash(function(err, authResult) {
        if (authResult && authResult.accessToken && authResult.idToken) {
          window.location.hash = '';
          localLogin(authResult);
          loginBtn.style.display = 'none';
          homeView.style.display = 'inline-block';
          webAuth.client.userInfo(authResult.accessToken,function(err,user){
            console.log(user.toString);
            localStorage.setItem('username',user.user_id);
          });
        } else if (err) {
          homeView.style.display = 'inline-block';
          console.log(err);
          alert(
            'Error: ' + err.error + '. Check the console for further details.'
          );
        }
        
        displayButtons();
      });
      
    }
  
    function localLogin(authResult) {
      // Set isLoggedIn flag in localStorage
      localStorage.setItem('isLoggedIn', 'true');
      //localStorage.setItem('loginusername',loginusername);
      // Set the time that the access token will expire at
      expiresAt = JSON.stringify(
        authResult.expiresIn * 1000 + new Date().getTime()
      );
      accessToken = authResult.accessToken;
      idToken = authResult.idToken;
    }
  
    function renewTokens() {
      webAuth.checkSession({}, (err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          localLogin(authResult);
        } else if (err) {
          alert(
              'Could not get a new token '  + err.error + ':' + err.error_description + '.'
          );
          logout();
        }
        displayButtons();
      });
    }
  
    function logout() {
      // Remove isLoggedIn flag from localStorage
      localStorage.removeItem('isLoggedIn');
      // Remove tokens and expiry time
      accessToken = '';
      idToken = '';
      expiresAt = 0;
      webAuth.logout();
      displayButtons();
    }
  
    function isAuthenticated() {
      // Check whether the current time is past the
      // Access Token's expiry time
      var expiration = parseInt(expiresAt) || 0;
      return localStorage.getItem('isLoggedIn') === 'true' && new Date().getTime() < expiration;
    }
  
    function displayButtons() {
      if (isAuthenticated()) {
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
        var loginMessage="Hi " + localStorage.getItem('username')+ "! You are logged in!"
        loginStatus.innerHTML = loginMessage;
      } else {
        loginBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
        loginStatus.innerHTML =
          'You are not logged in! Please log in to continue.';
      }
    }

    if (localStorage.getItem('isLoggedIn') === 'true') {
        renewTokens();
    } else {
        handleAuthentication();
    }
  });