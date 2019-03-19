'use strict';

var connection = new signalR.HubConnectionBuilder().withUrl('https://localhost:44372/notifyMessage').build();

connection.start(function () {
    console.log('connected');
}).catch(function (err) {
    return console.error(err.toString());
});

function SendNotification() {
    connection.invoke('SendMessage', 'Ahihihi').catch(function (err) {
        return console.error(err.toString());
    });
}

connection.on('ReceiveMessage', function (message) {
    $('#div-notification').html(message);
});
//# sourceMappingURL=notifyMessage.js.map
