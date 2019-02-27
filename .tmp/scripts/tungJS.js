'use strict';

//Get room show UI
var EBSMSLocal = 'https://localhost:44372';
// var EBSMSLocal = 'https://localhost:5001';

var FontEndLocal = 'http://localhost:9000';
function loadSurgeryRoom(surgeryDay) {
    var strAppend1 = '';
    var divRoom = $('#row-surgery-room');
    divRoom.empty();
    $.ajax({
        url: EBSMSLocal + '/api/Schedule/GetSurgeryRooms/',
        method: 'get',
        success: function success(room) {
            var _loop = function _loop(_index) {
                strAppend1 += '<div class="div-roomHeaderItem"><div class="div-room-name">' + room[_index].name + '</div><div id ="header-room-' + room[_index].id + '"></div>';
                $.ajax({
                    url: EBSMSLocal + '/api/Schedule/GetSurgeryShiftsByRoomAndDate/',
                    method: 'get',
                    data: { roomId: room[_index].id, dayNumber: surgeryDay },
                    success: function success(shift) {
                        var strAppend2 = '';
                        for (var _index2 = 0; _index2 < shift.length; _index2++) {
                            // if (shift[index].estimatedStartDateTime == '13:00') {
                            //     strAppend2 += '<div style="background-color: black; height: 50px"></div>'
                            // }
                            if (shift[_index2].priorityNumber == 1) {
                                strAppend2 += '<a href="./viewScheduleItem.html?id=' + shift[_index2].id + '"><div style="background-color: #FF8A80" class="div-roomBodyItem">';
                                // strAppend2 += '<a href="javascript:void(0)" data-schedule-index="' + shift[index].id + '" data-toggle="modal" data-target="#changeTimeModal"><div style="background-color: #FF8A80" class="div-roomBodyItem">';
                            } else if (shift[_index2].priorityNumber == 2) {
                                strAppend2 += '<a href="./viewScheduleItem.html?id=' + shift[_index2].id + '"><div style="background-color: #FFFF8D" class="div-roomBodyItem">';
                                // strAppend2 += '<a href="javascript:void(0)" data-schedule-index="' + shift[index].id + '" data-toggle="modal" data-target="#changeTimeModal"><div style="background-color: #FFFF8D" class="div-roomBodyItem">';
                            } else {
                                strAppend2 += '<a href="./viewScheduleItem.html?id=' + shift[_index2].id + '"><div style="background-color: #C8E6C9" class="div-roomBodyItem">';
                                // strAppend2 += '<a href="javascript:void(0)" data-schedule-index="' + shift[index].id + '" data-toggle="modal" data-target="#changeTimeModal"><div style="background-color: #C8E6C9" class="div-roomBodyItem">';
                            }
                            // 'Surgeon:' + 'Nguyễn Hoàng Anh' +
                            strAppend2 += '<div><b>' + shift[_index2].id + '</b></div>' + '<div><b>' + shift[_index2].catalogName + '</b></div>' + '<div><b>Patient:</b> ' + shift[_index2].patientName + '</div>' + '<div><b>Time:</b> ' + shift[_index2].estimatedStartDateTime + ' - ' + shift[_index2].estimatedEndDateTime + '</div>' + '</div></a>';
                        }
                        $('#header-room-' + room[_index].id).append(strAppend2);
                    }
                });
                strAppend1 += '</div>';
            };

            for (var _index = 0; _index < room.length; _index++) {
                _loop(_index);
            }
            divRoom.append(strAppend1);
        }
    });
}
function LoadSurgeryShiftByRoomAndDate() {
    $.ajax({
        url: EBSMSLocal + '/api/Schedule/GetSurgeryShiftsByRoomAndDate/',
        method: 'get',
        data: { roomId: room[index].id, dayNumber: surgeryDay },
        success: function success(shift) {
            for (var _index3 = 0; _index3 < shift.length; _index3++) {
                strAppend += '<a href="./viewScheduleItem.html?Id=' + shift[_index3].id + '"><div class="div-roomBodyItem">' +
                // 'Surgeon:' + 'Nguyễn Hoàng Anh' +
                // 'Phẫu thuật xương' +
                shift[_index3].catelogName + 'Patient: ' + shift[_index3].patientName + 'Time: ' + shift[_index3].estimatedStartDateTime + '-' + shift[_index3].estimatedEndDateTime;
                '</div></a>';
            }
        }
    });
}

function loadSurgeryShiftDetail(surgeryShiftId) {
    $.ajax({
        url: EBSMSLocal + '/api/Schedule/GetSurgeryShiftDetail/',
        method: 'get',
        data: { shiftId: surgeryShiftId },
        success: function success(shift) {
            console.log(shift);
            $('#span-name').append(shift.patientName);
            $('#span-gender').append(shift.gender);
            $('#span-age').append(shift.age);
            $('#span-specialty').append(shift.speciality);
            $('#span-surgery-name').append(shift.surgeryName);
            $('#span-surgery-type').append(shift.surgeryType);
            $('#span-start-time').append(shift.startTime);
            $('#span-end-time').append(shift.endTime);
            $('#textarea-procedure').append(shift.procedure);
        }
    });
}

function getScheduleByDay() {
    var date = new Date($('#date-input').val());
    loadSurgeryRoom(convertDateToNumber(date));
}
function convertDateToNumber(date) {
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    var year = date.getFullYear();
    var dateNumber = [year, month, day].join('');
    return dateNumber;
}
function formatInputDate(date) {
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    var year = date.getFullYear();
    var dateString = [year, month, day].join('-');
    return dateString;
}
function formatDateToDateTimeString(date) {
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    var year = date.getFullYear();
    var dateString = [day, month, year].join('/');
    return dateString;
}

function makeSchedule() {
    $.ajax({
        url: EBSMSLocal + '/api/Schedule/MakeScheduleList',
        method: 'get'
    });
    window.location.href = 'viewSchedule.html';
}

function makeScheduleProposedTime() {
    $.ajax({
        url: EBSMSLocal + '/api/Schedule/MakeScheduleProposedTime',
        method: 'get'
    });
    window.location.href = 'viewSchedule.html';
}

function loadSurgeryShiftNoSchedule() {
    var div_shift = $('#div-shift-no-schedule');
    $.ajax({
        url: EBSMSLocal + '/api/Schedule/GetSurgeryShiftsNoSchedule',
        method: 'get',
        success: function success(data) {
            var container = '<table class="table-no-schedule"><thead><tr><th>No.</th><th>Shift ID</th>' + '<th>Confirm Time</th><th>Proposed Time</th><th>Schedule Time</th>' + '<th>Priority Number</th><th>ExpectedDuration</th></tr></thead>';
            for (var i = 0; i < data.length; i++) {
                container += '<tr><td>' + (i + 1) + '</td>' + '<td>' + data[i].surgeryShiftId + '</td>' + '<td>' + data[i].confirmDate.split('T')[0] + ' ' + data[i].confirmDate.split('T')[1] + '</td>';
                if (data[i].proposedStartDateTime != undefined && data[i].proposedEndDateTime != undefined) {
                    container += '<td>' + data[i].proposedStartDateTime.split('T')[0] + ' | ' + data[i].proposedStartDateTime.split('T')[1] + ' - ' + data[i].proposedEndDateTime.split('T')[1] + '</td>';
                } else {
                    container += '<td>N/A</td>';
                }
                container += '<td>' + data[i].scheduleDate.split('T')[0] + '</td>' + '<td>' + data[i].priorityNumber + '</td>' + '<td>' + data[i].expectedSurgeryDuration + '</td></tr>';
            }
            container += '</table>';
            div_shift.append(container);
        }
    });
}
function loadSurgeryShiftNoScheduleByProposedTime() {
    var div_shift = $('#div-shift-proposed');
    $.ajax({
        url: EBSMSLocal + '/api/Schedule/GetSurgeryShiftNoScheduleByProposedTime',
        method: 'get',
        success: function success(data) {
            var container = '<table class="table-no-schedule"><thead><tr><th>No.</th><th>Shift ID</th>' + '<th>Proposed Time</th><th>Schedule Time</th>' + '<th>Priority Number</th></th><th>ExpectedDuration</th></tr></thead>';
            for (var i = 0; i < data.length; i++) {
                container += '<tr><td>' + (i + 1) + '</td><td>' + data[i].surgeryShiftId + '</td><td>';
                if (data[i].proposedStartDateTime != undefined && data[i].proposedEndDateTime != undefined) {
                    container += data[i].proposedStartDateTime.split('T')[0] + ' ' + data[i].proposedStartDateTime.split('T')[1] + ' - ' + data[i].proposedEndDateTime.split('T')[1];
                }
                container += '</td>'
                // + '<td>' + data[i].priorityNumber + '</td>'
                + '<td>' + data[i].scheduleDate + '</td>' + '<td>' + data[i].priorityNumber + '</td>' + '<td>' + data[i].expectedSurgeryDuration + '</td></tr>';
            }
            container += '</table>';
            div_shift.append(container);
        }
    });
}
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

function setPostStatus(surgeryShiftId) {
    alert(surgeryShiftId);
    $.ajax({
        url: EBSMSLocal + '/api/Schedule/SetPostoperativeStatus?shiftId=' + surgeryShiftId,
        method: 'post',
        contentType: 'application/json',
        dataType: 'json',
        // data: JSON.stringify({shiftId: surgeryShiftId}),
        success: function success(data) {
            console.log(data);
            if (data == true) {
                alert('Change postoperative status successfully!');
            } else {
                alert('Fail!');
            }
        }
    });
}
//# sourceMappingURL=tungJS.js.map
