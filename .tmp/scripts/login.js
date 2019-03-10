'use strict';

var isLogin = false;

var checkLogin = function checkLogin() {
    var tokenData = JSON.parse(localStorage.getItem('TOKEN_DATA'));
    if (!tokenData) {
        if (window.location.pathname !== '/login.html') {
            window.location.replace('login.html');
        }
    }
    checkRole(tokenData);
};

var checkRole = function checkRole(tokenData) {
    var url = window.location.pathname;
    if (tokenData && tokenData.role) {
        switch (tokenData.role.toUpperCase().trim()) {
            case 'HOSPITALSTAFF':
                {
                    var accessUrl = ['importList.html'];
                    if (!checkAccessPage(accessUrl, url)) {
                        window.location.replace(accessUrl[0]);
                    };
                    break;
                }
            case 'MEDICALSUPPLIER':
                {
                    var _accessUrl = ['confirmMSRequest.html'];
                    if (!checkAccessPage(_accessUrl, url)) {
                        window.location.replace(_accessUrl[0]);
                    };
                    break;
                }
            case 'CHIEFNURSE':
                {
                    var _accessUrl2 = ['viewSchedule.html', 'viewScheduleItem.html'];
                    if (!checkAccessPage(_accessUrl2, url)) {
                        window.location.replace(_accessUrl2[0]);
                    };
                    break;
                }
            default:
                window.location.replace('login.html');break;
        }
    }
};

var logout = function logout() {
    localStorage.removeItem('TOKEN_DATA');
    window.location.replace('login.html');
};

var checkAccessPage = function checkAccessPage(array, url) {
    var isAccess = false;
    array.forEach(function (el) {
        if (url.includes(el)) {
            isAccess = true;
            return;
        }
    });
    return isAccess;
};

var showMessage = function showMessage(text) {
    var container = $('div[target="invalid-message"]');
    if (text) {
        $(container).removeClass('d-none');
        $(container).find('span').html(text);
    } else {
        $(container).addClass('d-none');
    }
};

$('#buttonLogin').on('click', function () {
    var username = $('#username').val();
    var password = $('#password').val();
    showMessage(null);
    if (username && password) {
        $.ajax({
            url: EBSMSLocal + '/api/Account/Login',
            method: 'post',
            data: JSON.stringify({ username: username, password: password }),
            contentType: 'application/json',
            dataType: 'json'
        }).then(function (a, b, c) {
            if (c && c.status === 204) {
                showMessage('Invalid username or password');
            }
            localStorage.setItem('TOKEN_DATA', JSON.stringify(a));
            checkRole(a);
        }, function (er) {
            showMessage('Invalid username or password');
        });
    } else {
        showMessage('You have to input username and password!!!');
    }
});

checkLogin();
//# sourceMappingURL=login.js.map
