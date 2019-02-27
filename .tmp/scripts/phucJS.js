'use strict';

$('#changeTimeModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var scheduleIndex = button.data('schedule-index');
    $('#changeRoomWrapper').css('visibility', 'hidden');
    $('#changeRoom').data('shift-id', scheduleIndex);
    $('#changeRoomDurationWrapper').css('visibility', 'hidden');
    $('#changeRoomDuration').data('shift-id', scheduleIndex);
});
$('#checkSchedule').click(function () {
    var start = new Date($('#startTime').val()).toJSON();
    var end = new Date($('#endTime').val()).toJSON();
    loadAvailableRoomByStartEnd(start, end);
});
$('#checkScheduleDuration').click(function () {
    var hour = $('#hour').val();
    var minute = $('#minute').val();
    loadAvailableRoomByHourMinute(hour, minute);
});
$('#changeRoom').click(function () {
    var shiftId = $(this).data('shift-id');
    var start = new Date($('#startTime').val()).toJSON();
    var end = new Date($('#endTime').val()).toJSON();
    var roomId = Number.parseInt($('#availableRoom').val());
    changeSchedule(shiftId, start, end, roomId);
});
$('#changeRoomDuration').click(function () {
    var shiftId = $(this).data('shift-id');
    var room = $('#availableDurationRoom').val();
    var roomArr = room.split(';');
    var roomId = Number.parseInt(roomArr[0]);
    var start = roomArr[1];
    var end = roomArr[2];
    changeScheduleDuration(shiftId, start, end, roomId);
});

//================================Phuc==================================
function loadAvailableRoomByStartEnd(start, end) {
    $.ajax({
        url: EBSMSLocal + '/api/Schedule/GetAvailableRoom/',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            startDate: start,
            endDate: end
        }),
        method: 'post',
        success: function success(response) {
            var select = $('#availableRoom');
            var wrapper = $('#changeRoomWrapper');
            wrapper.css('visibility', 'hidden');
            select.empty();
            console.log(response);
            if (Array.isArray(response)) {
                var options = response.map(function (e) {
                    var opt = $('<option></option>');
                    opt.val(e);
                    opt.text(getRoomById(e).name);
                    return opt;
                });
                options.forEach(function (e) {
                    select.append(e);
                });
                wrapper.css('visibility', 'visible');
            }
        }
    });
}
function loadAvailableRoomByHourMinute(hour, minute) {
    $.ajax({
        url: EBSMSLocal + '/api/Schedule/GetAvailableRoomForDuration/',
        data: {
            hour: hour,
            minute: minute
        },
        method: 'get',
        success: function success(response) {
            var select = $('#availableDurationRoom');
            var wrapper = $('#changeRoomDurationWrapper');
            wrapper.css('visibility', 'hidden');
            select.empty();
            console.log(response);
            if (Array.isArray(response)) {
                var options = response.map(function (e) {
                    var opt = $('<option></option>');
                    opt.val(e.roomId + ';' + e.startDateTime + ';' + e.endDateTime);
                    opt.text(getRoomById(e.roomId).name + ' --- startDateTime: ' + e.startDateTime.replace('T', ' - ') + ' - endDateTime: ' + e.endDateTime.replace('T', ' - '));
                    return opt;
                });
                options.forEach(function (e) {
                    select.append(e);
                });
                wrapper.css('visibility', 'visible');
            }
        }
    });
}
function changeSchedule(shiftId, start, end, roomId) {
    $.ajax({
        url: EBSMSLocal + '/api/Schedule/ChangeSchedule/',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            id: shiftId,
            estimatedStartDateTime: start,
            estimatedEndDateTime: end,
            roomId: roomId
        }),
        method: 'post',
        success: function success() {
            console.log('Kudo iz da bezt!');
        }
    });
}
function changeScheduleDuration(shiftId, start, end, roomId) {
    $.ajax({
        url: EBSMSLocal + '/api/Schedule/ChangeScheduleForDuration/',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            id: shiftId,
            estimatedStartDateTime: start,
            estimatedEndDateTime: end,
            roomId: roomId
        }),
        method: 'post',
        success: function success() {
            console.log('Kudo iz da bezt!');
        }
    });
}
//# sourceMappingURL=phucJS.js.map
