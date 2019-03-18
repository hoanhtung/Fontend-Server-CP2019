const isLogin = false;

var checkLogin = function () {
    const tokenData = JSON.parse(localStorage.getItem('TOKEN_DATA'));
    if (!tokenData) {
        if (window.location.pathname !== '/login.html') {
            window.location.replace('login.html');
        }
    }
    checkRole(tokenData);
};
checkLogin();
function checkRole(tokenData) {
    const url = window.location.pathname;    
    if (tokenData && tokenData.role) {
        switch (tokenData.role.toUpperCase().trim()) {
            case 'HOSPITALSTAFF': {
                const accessUrl = ['importList.html','importDetail.html'];
                if (!checkAccessPage(accessUrl, url)) {
                    window.location.replace(accessUrl[0]);
                };
                break;
            }
            case 'MEDICALSUPPLIER': {
                const accessUrl = ['confirmMSRequest.html','requestDetail.html'];
                if (!checkAccessPage(accessUrl, url)) {
                    window.location.replace(accessUrl[0]);
                };
                break;
            }
            case 'CHIEFNURSE': {
                const accessUrl = ['viewSchedule.html', 'viewScheduleItem.html'];
                if (!checkAccessPage(accessUrl, url)) {
                    window.location.replace(accessUrl[0]);
                };
                break;
            }
            default: window.location.replace('login.html'); break;
        }
    }
}

function logout (){
    localStorage.removeItem('TOKEN_DATA');
    window.location.replace('login.html');
}

function checkAccessPage (array, url) {
    let isAccess = false;
    array.forEach(el => {
        if (url.includes(el)) {
            isAccess = true;
            return;
        }
    })
    return isAccess;
}

function showMessage (text) {
    const container = $('div[target="invalid-message"]');
    if (text) {
        $(container).removeClass('d-none');
        $(container).find('span').html(text);
    } else {
        $(container).addClass('d-none');
    }
}

  $(document).ready(function() {
$('#frmLogin').submit(function(e){
    e.preventDefault();
    const username = $('#username').val();
    const password = $('#password').val();
    showMessage(null);
    if (username && password) {
        $.ajax({
            url: EBSMSLocal + '/api/Account/Login',
            method: 'post',
            data: JSON.stringify({ username: username, password: password }),
            contentType: 'application/json',
            dataType: 'json'
        }).then((a, b, c) => {
            if (c && c.status === 204) {
                showMessage('Invalid username or password');
            }
            localStorage.setItem('TOKEN_DATA', JSON.stringify(a));
            checkRole(a);
        }, er => {
            showMessage('Invalid username or password');
        })
    } else {
        showMessage('You have to input username and password!!!');
    }
});
});
checkLogin();