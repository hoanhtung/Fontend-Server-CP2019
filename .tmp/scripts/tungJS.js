'use strict';

//Get room show UI
var EBSMSLocal = 'https://localhost:44372';
// var EBSMSLocal = 'http://10.82.139.179:5000';
// var EBSMSLocal = 'http://172.20.10.7:5000';


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
                            var estimatedStart = new Date(shift[_index2].estimatedStartDateTime);
                            var estimatedEnd = new Date(shift[_index2].estimatedEndDateTime);
                            if (shift[_index2].statusName == 'Postoperative') {
                                strAppend2 += '<div style="background-color: #b2bec3" class="div-roomBodyItem">';
                            } else if (shift[_index2].statusName == 'Intraoperative') {
                                strAppend2 += '<div style="background-color: #ffeaa7" class="div-roomBodyItem">';
                            } else {
                                strAppend2 += '<div class="div-roomBodyItem">';
                            }
                            strAppend2 += '<div class="info-shift"><div><b>' + shift[_index2].id + '</b></div>' + '<div><b>' + shift[_index2].catalogName + '</b></div>' + '<div><b>Patient:</b> ' + shift[_index2].patientName + '</div>' + '<div><b>Time:</b> ' + convertDateToTime(estimatedStart) + ' - ' + convertDateToTime(estimatedEnd) + '</div></div>' + '<div class="mybuttonoverlap">' + '<a data-toggle="tooltip" title="View" href="./viewScheduleItem.html?id=' + shift[_index2].id + '" class="btn btn-info"><i class="far fa-eye"/></a>';
                            if (shift[_index2].statusName == 'Preoperative') {
                                strAppend2 += '<a title="Change" href="javascript:void(0)" class="btn btn-primary" data-priority="' + shift[_index2].priorityNumber + '" data-schedule-index="' + shift[_index2].id + '" data-start-datetime="' + formatStringtoDateTimeString(shift[_index2].estimatedStartDateTime) + '" data-end-datetime="' + formatStringtoDateTimeString(shift[_index2].estimatedEndDateTime) + '" ' + 'data-toggle="modal" data-target="#changeTimeModal"><i class="far fa-edit"/></a>' + '<button title="Begin" class="btn btn-success" onclick="startSurgeryShift(' + shift[_index2].id + ')">' + '<i class="fas fa-procedures"></i></button>' + '</div>';
                            } else if (shift[_index2].statusName == 'Intraoperative') {
                                strAppend2 += '<button title="Complete" class="btn btn-success" onclick="appendSurgeryShiftId(' + shift[_index2].id + ')" data-toggle="modal" data-target="#changePostStatusModal">' + '<i style="color: white" class="far fa-check-square"></i></button>' + '</div>';
                            } else {
                                strAppend2 += '</div>';
                            }
                            strAppend2 += '</div></a>';
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

function startSurgeryShift(shiftId) {
    $.ajax({
        url: EBSMSLocal + '/api/Schedule/SetIntraoperativeStatus?shiftId=' + shiftId,
        method: 'post',
        success: function success(data) {
            if (data == true) {
                loadSurgeryRoom(convertDateToNumber(new Date()));
            }
        }
    });
}

// Change status postoperative
function appendSurgeryShiftId(shiftId) {
    $('#surgery-shift-status').html(shiftId);
    $('#surgery-shift-status').data('shiftId', shiftId);
}
// -----------------------------------

function LoadSurgeryShiftByRoomAndDate() {
    $.ajax({
        url: EBSMSLocal + '/api/Schedule/GetSurgeryShiftsByRoomAndDate/',
        method: 'get',
        data: { roomId: room[index].id, dayNumber: surgeryDay },
        success: function success(shift) {
            for (var _index3 = 0; _index3 < shift.length; _index3++) {
                strAppend += '<a href="./viewScheduleItem.html?Id=' + shift[_index3].id + '"><div class="div-roomBodyItem">' + shift[_index3].catelogName + 'Patient: ' + shift[_index3].patientName + 'Time: ' + shift[_index3].estimatedStartDateTime + '-' + shift[_index3].estimatedEndDateTime;
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
            $('#span-id').append(shift.id);
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

function makeSchedule() {
    $.ajax({
        url: EBSMSLocal + '/api/Schedule/MakeScheduleList',
        method: 'get',
        success: function success(data) {
            window.location.href = 'viewSchedule.html';
            // console.log(data.m_StringValue);
            // $('#content-schedule-notification').html(data.m_StringValue);
            // $(window).on('load', function() {
            //     $('#modal-schedule-notification').modal('show');
            // });
        }
    });
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
            if (data.length != 0) {
                var container = '<table id="table-no-schedule" class="table"><thead><tr><th>No.</th><th>Shift ID</th>' + '<th>Confirm Time</th><th>Proposed Time</th><th>Schedule Time</th>' + '<th>Priority Number</th><th>ExpectedDuration</th></tr></thead>';
                for (var i = 0; i < data.length; i++) {
                    container += '<tr><td>' + (i + 1) + '</td>' + '<td>' + data[i].surgeryShiftId + '</td>' + '<td>' + data[i].confirmDate.split('T')[0] + ' ' + data[i].confirmDate.split('T')[1].split('.')[0] + '</td>';
                    if (data[i].proposedStartDateTime != undefined && data[i].proposedEndDateTime != undefined) {
                        container += '<td>' + data[i].proposedStartDateTime.split('T')[0] + ' | ' + data[i].proposedStartDateTime.split('T')[1] + ' - ' + data[i].proposedEndDateTime.split('T')[1] + '</td>';
                    } else {
                        container += '<td>N/A</td>';
                    }
                    container += '<td>' + data[i].scheduleDate.split('T')[0] + '</td>' + '<td>' + data[i].priorityNumber + '</td>' + '<td>' + data[i].expectedSurgeryDuration + '</td></tr>';
                }
                container += '</table>';
                div_shift.append(container);
            } else {
                div_shift.append('<h2>Not found no schedule surgery shift</h2>');
            }
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
function checkSetPostStatus(surgeryId) {
    $.ajax({
        url: EBSMSLocal + '/api/Schedule/CheckPostStatus/',
        method: 'get',
        data: { shiftId: surgeryId },
        success: function success(data) {
            if (data == 1) {
                $('#checkSetPostStatus').show();
            } else if (data == 2) {
                $('#btn-change-post-status').attr('style', 'cursor: not-allowed').attr('disabled', '');
            } else {
                $('#btn-change-post-status').hide();
            }
        }
    });
}

function setPostStatus(surgeryShiftId) {
    var roomPost = $('#roomPost').val();
    var bedPost = $('#bedPost').val();
    $.ajax({
        url: EBSMSLocal + '/api/Schedule/SetPostoperativeStatus?shiftId=' + surgeryShiftId + '&roomPost=' + roomPost + '&bedPost=' + bedPost,
        method: 'post',
        success: function success(data) {
            loadSurgeryRoom(convertDateToNumber(new Date()));
            // checkSetPostStatus(surgeryShiftId)
        }
    });
}

function appendChangeInfoShift(id, start, end) {
    $('#change-shift-id').html(id);
    $('#change-date').html(start.split(' ')[1]);
    $('#change-start-time').html(start.split(' ')[0]);
    $('#change-end-time').html(end.split(' ')[0]);
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
function convertDateToTime(date) {
    var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    return [hour, minute].join(':');
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
function formatDateToString(date) {
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    var year = date.getFullYear();
    var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    return [hour, minute].join(':') + ' ' + [day, month, year].join('/');
}

function formatStringtoDateTimeString(dateString) {
    var array = dateString.split('T');
    var time = array[1];
    var day = array[0];
    var formatDay = day.split('-')[2] + '/' + day.split('-')[1] + '/' + day.split('-')[0];
    var hour = time.split(':')[0];
    var minute = time.split(':')[1];
    return hour + ':' + minute + ' ' + formatDay;
}
//# sourceMappingURL=tungJS.js.map
