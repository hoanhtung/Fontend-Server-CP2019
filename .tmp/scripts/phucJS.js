'use strict';

// var FontEndLocal = 'http://localhost:9000';
// var EBSMSLocal = 'http://localhost:5000';
//================================Phuc==================================
function convertDatetimeToString(date) {
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    var year = date.getFullYear();
    var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    return [year, month, day].join('-') + 'T' + [hour, minute].join(':') + 'Z';
}

function loadAvailableRoomByStartEnd(start, end) {
    $.ajax({
        url: EBSMSLocal + '/api/Schedule/GetAvailableRoom/',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            startDate: convertDatetimeToString(start),
            endDate: convertDatetimeToString(end)
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

function changeSchedulePriority(shiftId, value) {
    $.ajax({
        url: EBSMSLocal + '/api/Schedule/ChangeShiftPriority',
        method: 'post',
        contentType: 'application/json',
        data: JSON.stringify({
            id: shiftId,
            changeLogDescription: '',
            newPriority: value
        })
    }).then(function (sc) {
        return alert('Success');
    }, function (er) {
        return alert('Fail');
    });
}

function changeIntraoperative(shiftId, status) {
    $.ajax({
        url: EBSMSLocal + '/api/Schedule/ChangeShiftStatus',
        method: 'post',
        contentType: 'application/json',
        data: JSON.stringify({
            shiftId: shiftId,
            currentStatus: status
        })
    }).then(function (sc) {
        return alert('Success');
    }, function (er) {
        return alert('Fail');
    });
}
//# sourceMappingURL=phucJS.js.map
