'use strict';

var connection = new signalR.HubConnectionBuilder().withUrl(EBSMSLocal + '/notifyMessage').build();

connection.start(function () {
    console.log('connected');
}).catch(function (err) {
    return console.error(err.toString());
});

function SendNotification() {
    connection.invoke('SendMessage').catch(function (err) {
        return console.error(err.toString());
    });
}
connection.on('ReceiveMessage', function (message) {
    if (message.length != 0) {
        $('#span-noti-count').html(message.length);
        $('#span-noti-count-text').html(message.length + ' New');
    }
    var messageItem = '';
    for (var i = 0; i < message.length; i++) {
        var scheduleDate = message[i].content.split('on ')[1];
        if (scheduleDate != null) {
            var array = scheduleDate.split('/');
            var dateNumber = [array[2], array[1], array[0]].join('');
            messageItem += '<a onclick="loadSurgeryRoom(' + dateNumber + ');" href="javascript:void(0)" class="list-group-item">';
        } else {
            messageItem += '<a href="javascript:void(0)" class="list-group-item">';
        }
        messageItem += '<div class="media"><div class="media-left valign-middle"><i class="fas fa-briefcase-medical"></i></div>';
        messageItem += '<div class="media-body"><h6 class="media-heading">You have new notification!</h6>';
        messageItem += '<p class="notification-text font-small-3 text-muted">' + message[i].content + '</p>';
        messageItem += '<small><time datetime="' + message[i].dateCreated + '" class="media-meta text-muted">' + formatStringtoDateTimeString(message[i].dateCreated) + '</time></small>';
        messageItem += '</div></div></a>'; // div-body, div-media, parient-a
    }
    $('#li-noti-parent').html(messageItem);
});
//# sourceMappingURL=notifyMessage.js.map
