const isLogin = false;

const checkLogin = function () {
    const tokenData = JSON.parse(localStorage.getItem('TOKEN_DATA'));
    if (!tokenData) {
        if (window.location.pathname !== '/login.html') {
            window.location.replace('login.html');
        }
    }
    checkRole(tokenData);
};

const checkRole = function (tokenData) {
    const url = window.location.pathname;    
    if (tokenData && tokenData.role) {
        switch (tokenData.role.toUpperCase().trim()) {
            case 'HOSPITALSTAFF': {
                const accessUrl = ['importList.html'];
                if (!checkAccessPage(accessUrl, url)) {
                    window.location.replace(accessUrl[0]);
                };
                break;
            }
            case 'MEDICALSUPPLIER': {
                const accessUrl = ['confirmMSRequest.html'];
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

const logout = function(){
    localStorage.removeItem('TOKEN_DATA');
    window.location.replace('login.html');
}

const checkAccessPage = function (array, url) {
    let isAccess = false;
    array.forEach(el => {
        if (url.includes(el)) {
            isAccess = true;
            return;
        }
    })
    return isAccess;
}

const showMessage = function (text) {
    const container = $('div[target="invalid-message"]');
    if (text) {
        $(container).removeClass('d-none');
        $(container).find('span').html(text);
    } else {
        $(container).addClass('d-none');
    }
}

$('#buttonLogin').on('click', () => {
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

// checkLogin();