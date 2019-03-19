'use strict';

getNotification();
var connection = new signalR.HubConnectionBuilder().withUrl('/notifyMessage').configureLogging(signalR.LogLevel.Information).build();
connection.on('displayNotification', function (message) {
    $('#div-notification').html(message);
});
connection.start().then(function () {
    console.log('connection');
});
//# sourceMappingURL=signalr.js.map
