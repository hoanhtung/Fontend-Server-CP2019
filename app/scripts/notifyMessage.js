var connection = new signalR.HubConnectionBuilder().withUrl('https://localhost:44372/notifyMessage').build();

connection.start(function () {
    console.log('connected');
}).catch(function (err) {
    return console.error(err.toString());
});

function SendNotification() {
    connection.invoke('SendMessage', 'Ahihihi').catch(err => { return console.error(err.toString()); });
}

connection.on('ReceiveMessage', (message) => {
    $('#div-notification').html(message);
})