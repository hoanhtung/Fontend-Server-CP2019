'use strict';

//Get room show UI
// var EBSMSLocal = 'http://45.119.212.145:5520';
// var EBSMSLocal = 'http://10.82.139.179:5000';
// var EBSMSLocal = 'http://172.20.10.7:5000';
var EBSMSLocal = 'https://localhost:44372';

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
                            var firstEstimatedStart = shift[_index2].estimatedStartDateTime;
                            var firstEstimatedEnd = shift[_index2].estimatedEndDateTime;
                            var firstActualStart = shift[_index2].actualStartDateTime;
                            var firstActualEnd = shift[_index2].actualEndDateTime;

                            var estimatedStart = new Date(firstEstimatedStart);
                            var estimatedEnd = new Date(firstEstimatedEnd);
                            var actualStart = new Date(firstActualStart);
                            var actualEnd = new Date(firstActualEnd);

                            var shiftId = shift[_index2].id;
                            if (shift[_index2].statusName == 'Postoperative') {
                                strAppend2 += '<div style="background-color: #b2bec3" class="div-roomBodyItem">';
                            } else if (shift[_index2].statusName == 'Intraoperative') {
                                strAppend2 += '<div style="background-color: #ffeaa7" class="div-roomBodyItem">';
                            } else {
                                strAppend2 += '<div class="div-roomBodyItem">';
                            }
                            strAppend2 += '<div class="info-shift"><div>';
                            if (shift[_index2].statusName != 'Intraoperative' && shift[_index2].statusName != 'Postoperative') {
                                strAppend2 += '<input name="swapChk" type="checkbox" value="' + shiftId + '" />';
                            }
                            strAppend2 += '<b>' + shiftId + '</b></div>' + '<div><b>' + shift[_index2].catalogName + '</b></div>' + '<div><b>Patient:</b> ' + shift[_index2].patientName + '</div>' + '<div><b>Time:</b> ';
                            if (firstActualStart == undefined) {
                                strAppend2 += convertDateToTime(estimatedStart);
                            } else {
                                strAppend2 += convertDateToTime(actualStart);
                            }
                            strAppend2 += ' - ';
                            if (firstActualEnd == undefined) {
                                strAppend2 += convertDateToTime(estimatedEnd);
                            } else {
                                strAppend2 += convertDateToTime(actualEnd);
                            }
                            strAppend2 += '</div></div>' + '<div class="mybuttonoverlap">' + '<a data-toggle="tooltip" title="View" href="./viewScheduleItem.html?id=' + shiftId + '" class="btn btn-info"><i class="far fa-eye"/></a>';
                            if (shift[_index2].statusName == 'Preoperative') {
                                strAppend2 += '<a id="changeScheduleA" title="Change" href="javascript:void(0)" class="btn btn-primary" data-priority="' + shift[_index2].priorityNumber + '" data-schedule-index="' + shiftId + '" data-start-datetime="' + formatStringtoDateTimeString(firstEstimatedStart) + '" data-end-datetime="' + formatStringtoDateTimeString(firstEstimatedEnd) + '" ' + 'data-toggle="modal" data-target="#changeTimeModal"><i class="far fa-edit"/></a>' + '<button title="Begin" data-toggle="modal" data-target="#changeIntraStatusModal" class="btn btn-success" onclick="appendIntraSurgeryShiftId(' + shiftId + ', \'' + firstEstimatedStart + '\', \'' + firstEstimatedEnd + '\')">' + '<i class="fas fa-procedures"></i></button>' + '</div>';
                            } else if (shift[_index2].statusName == 'Intraoperative') {
                                strAppend2 += '<button title="Complete" class="btn btn-success" onclick="appendPostSurgeryShiftId(' + shiftId + ', \'' + firstActualStart + '\', \'' + firstEstimatedEnd + '\')" data-toggle="modal" data-target="#changePostStatusModal">' + '<i style="color: white" class="far fa-check-square"></i></button>' + '</div>';
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

function loadNewSurgeryRoom(surgeryDay) {
    var strAppend1 = '';
    var divRoom = $('#row-surgery-room');
    divRoom.empty();
    $.ajax({
        url: EBSMSLocal + '/api/Schedule/GetSurgeryRooms/',
        method: 'get',
        success: function success(room) {
            var _loop2 = function _loop2(_index3) {
                strAppend1 += '<div class="div-roomHeaderItem"><div class="div-room-name">' + room[_index3].name + '</div><div id ="header-room-' + room[_index3].id + '"></div>';
                $.ajax({
                    url: EBSMSLocal + '/api/Schedule/GetSurgeryShiftsByRoomAndDate/',
                    method: 'get',
                    data: { roomId: room[_index3].id, dayNumber: surgeryDay },
                    success: function success(shift) {
                        var strAppend2 = '';
                        for (var _index4 = 0; _index4 < shift.length; _index4++) {
                            var firstEstimatedStart = shift[_index4].estimatedStartDateTime;
                            var firstEstimatedEnd = shift[_index4].estimatedEndDateTime;
                            var firstActualStart = shift[_index4].actualStartDateTime;
                            var firstActualEnd = shift[_index4].actualEndDateTime;

                            var estimatedStart = new Date(firstEstimatedStart);
                            var estimatedEnd = new Date(firstEstimatedEnd);
                            var actualStart = new Date(firstActualStart);
                            var actualEnd = new Date(firstActualEnd);

                            var shiftId = shift[_index4].id;
                            if (shift[_index4].statusName == 'Postoperative') {
                                strAppend2 += '<div style="background-color: #b2bec3" class="div-roomBodyItem">';
                            } else if (shift[_index4].statusName == 'Intraoperative') {
                                strAppend2 += '<div style="background-color: #ffeaa7" class="div-roomBodyItem">';
                            } else {
                                strAppend2 += '<div class="div-roomBodyItem">';
                            }
                            strAppend2 += '<div class="info-shift"><div>';
                            if (shift[_index4].statusName != 'Intraoperative' && shift[_index4].statusName != 'Postoperative') {
                                strAppend2 += '<input name="swapChk" type="checkbox" value="' + shiftId + '" />';
                            }
                            strAppend2 += '<b>' + shiftId + '</b></div>' + '<div><b>' + shift[_index4].catalogName + '</b></div>' + '<div><b>Patient:</b> ' + shift[_index4].patientName + '</div>' + '<div><b>Time:</b> ';
                            if (firstActualStart == undefined) {
                                strAppend2 += convertDateToTime(estimatedStart);
                            } else {
                                strAppend2 += convertDateToTime(actualStart);
                            }
                            strAppend2 += ' - ';
                            if (firstActualEnd == undefined) {
                                strAppend2 += convertDateToTime(estimatedEnd);
                            } else {
                                strAppend2 += convertDateToTime(actualEnd);
                            }
                            strAppend2 += '</div></div>' + '<div class="mybuttonoverlap">' + '<a data-toggle="tooltip" title="View" href="./viewScheduleItem.html?id=' + shiftId + '" class="btn btn-info"><i class="far fa-eye"/></a>';
                            if (shift[_index4].statusName == 'Preoperative') {
                                strAppend2 += '<a id="changeScheduleA" title="Change" href="javascript:void(0)" class="btn btn-primary" data-priority="' + shift[_index4].priorityNumber + '" data-schedule-index="' + shiftId + '" data-start-datetime="' + formatStringtoDateTimeString(firstEstimatedStart) + '" data-end-datetime="' + formatStringtoDateTimeString(firstEstimatedEnd) + '" ' + 'data-toggle="modal" data-target="#changeTimeModal"><i class="far fa-edit"/></a>' + '<button title="Begin" data-toggle="modal" data-target="#changeIntraStatusModal" class="btn btn-success" onclick="appendIntraSurgeryShiftId(' + shiftId + ', \'' + firstEstimatedStart + '\', \'' + firstEstimatedEnd + '\')">' + '<i class="fas fa-procedures"></i></button>' + '</div>';
                            } else if (shift[_index4].statusName == 'Intraoperative') {
                                strAppend2 += '<button title="Complete" class="btn btn-success" onclick="appendPostSurgeryShiftId(' + shiftId + ', \'' + firstActualStart + '\', \'' + firstEstimatedEnd + '\')" data-toggle="modal" data-target="#changePostStatusModal">' + '<i style="color: white" class="far fa-check-square"></i></button>' + '</div>';
                            } else {
                                strAppend2 += '</div>';
                            }
                            strAppend2 += '</div></a>';
                        }
                        $('#header-room-' + room[_index3].id).append(strAppend2);
                    }
                });
                strAppend1 += '</div>';
            };

            for (var _index3 = 0; _index3 < room.length; _index3++) {
                _loop2(_index3);
            }
            divRoom.append(strAppend1);
        }
    });
}

// change status
function startSurgeryShift(shiftId, actualStartTime) {
    $.ajax({
        url: EBSMSLocal + '/api/Schedule/SetIntraoperativeStatus?shiftId=' + shiftId + '&actualStartDateTime=' + actualStartTime,
        method: 'post',
        success: function success(data) {
            if (data == true) {
                loadSurgeryRoom(convertDateToNumber(new Date($('#date-input').val())));
            }
        }
    });
}

//Refresh Schedule
function refreshSchedule(surgeryShiftId) {
    $.ajax({
        url: EBSMSLocal + '/api/Schedule/RefreshSurgeryShift?shiftId=' + surgeryShiftId,
        method: 'post',
        success: function success(data) {
            if (data) {
                loadSurgeryRoom(convertDateToNumber(new Date($('#date-input').val())));
            }
        }
    });
}
function setPostStatus(surgeryShiftId, actualEndTime) {
    var roomPost = $('#roomPost').val();
    var bedPost = $('#bedPost').val();
    $.ajax({
        url: EBSMSLocal + '/api/Schedule/SetPostoperativeStatus?shiftId=' + surgeryShiftId + '&roomPost=' + roomPost + '&bedPost=' + bedPost + '&actualEndDateTime=' + actualEndTime,
        method: 'post',
        success: function success(data) {
            if (data) {
                refreshSchedule(surgeryShiftId);
            }
        }
    });
}
function SetFinishedStatus(surgeryShiftId) {
    $.ajax({
        url: EBSMSLocal + '/api/Schedule/SetFinishedStatus?shiftId=' + surgeryShiftId,
        method: 'post',
        success: function success(data) {}
    });
}

//-----------------------------------
// append surgery modal
function appendIntraSurgeryShiftId(shiftId, start, end) {
    $('#surgery-shift-intra-status').html(shiftId);
    $('#surgery-shift-intra-status').data('shiftId', shiftId);
    $('.estimated-start-time').html(formatStringtoDateTimeString(start));
    $('.estimated-end-time').html(formatStringtoDateTimeString(end));
    $('#surgery-shift-intra-status').data('day', end.split('T')[0]);
}
function appendPostSurgeryShiftId(shiftId, start, end) {
    $('#surgery-shift-post-status').html(shiftId);
    $('#surgery-shift-post-status').data('shiftId', shiftId);
    $('.estimated-start-time').html(formatStringtoDateTimeString(start));
    $('.estimated-end-time').html(formatStringtoDateTimeString(end));
    $('#surgery-shift-post-status').data('day', end.split('T')[0]);
}
// -----------------------------------

function LoadSurgeryShiftByRoomAndDate() {
    $.ajax({
        url: EBSMSLocal + '/api/Schedule/GetSurgeryShiftsByRoomAndDate/',
        method: 'get',
        data: { roomId: room[index].id, dayNumber: surgeryDay },
        success: function success(shift) {
            for (var _index5 = 0; _index5 < shift.length; _index5++) {
                strAppend += '<a href="./viewScheduleItem.html?Id=' + shift[_index5].id + '"><div class="div-roomBodyItem">' + shift[_index5].catelogName + 'Patient: ' + shift[_index5].patientName + 'Time: ' + shift[_index5].estimatedStartDateTime + '-' + shift[_index5].estimatedEndDateTime;
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
            $('#span-start-time').data('start', shift.startTime);
            $('#span-start-time').append(formatStringtoDateTimeString(shift.startTime));
            $('#span-end-time').data('end', shift.endTime);
            $('#span-end-time').append(formatStringtoDateTimeString(shift.endTime));
            $('#textarea-procedure').append(shift.procedure);

            $('#body-detail-shift').append('<tr></tr>');
            if (shift.actualStartTime != null) {
                $('#body-detail-shift').children().last().append('<td><b>Actual Start Time:</b></td>' + '<td id="span-actual-start-time">' + formatStringtoDateTimeString(shift.actualStartTime) + '</td>');
            }
            if (shift.actualEndTime != null) {
                $('#body-detail-shift').children().last().append('<td><b>Actual End Time:</b></td>' + '<td id="span-actual-end-time">' + formatStringtoDateTimeString(shift.actualEndTime) + '</td>');
            }
        }
    });
}

function makeSchedule() {
    $.ajax({
        url: EBSMSLocal + '/api/Schedule/MakeScheduleList',
        method: 'get',
        success: function success(data) {
            window.location.href = 'viewSchedule.html';
        }
    });
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
// function loadSurgeryShiftNoScheduleByProposedTime() {
//     var div_shift = $('#div-shift-proposed');
//     $.ajax({
//         url: EBSMSLocal + '/api/Schedule/GetSurgeryShiftNoScheduleByProposedTime',
//         method: 'get',
//         success: function(data) {
//             var container = '<table class="table-no-schedule"><thead><tr><th>No.</th><th>Shift ID</th>'
//                             + '<th>Proposed Time</th><th>Schedule Time</th>'
//                             + '<th>Priority Number</th></th><th>ExpectedDuration</th></tr></thead>';
//             for (var i = 0; i < data.length; i++) {
//                 container += '<tr><td>' + (i + 1) + '</td><td>' +  data[i].surgeryShiftId + '</td><td>';
//                 if (data[i].proposedStartDateTime != undefined && data[i].proposedEndDateTime != undefined) {
//                     container += data[i].proposedStartDateTime.split('T')[0] 
//                     + ' ' + data[i].proposedStartDateTime.split('T')[1] + ' - ' 
//                     + data[i].proposedEndDateTime.split('T')[1];
//                 }
//                 container += '</td><td>' + data[i].scheduleDate + '</td>'
//                 + '<td>' + data[i].priorityNumber + '</td>'
//                 + '<td>' + data[i].expectedSurgeryDuration + '</td></tr>';
//             }
//             container += '</table>';
//             div_shift.append(container);
//         }
//     })
//  }
function checkSetPostStatus(surgeryId) {
    $.ajax({
        url: EBSMSLocal + '/api/Schedule/CheckPostStatus/',
        method: 'get',
        data: { shiftId: surgeryId },
        success: function success(data) {
            if (data == 1) {
                $('#checkSetPostStatus').show();
            } else if (data == 2) {
                $('#btn-change-post-status').hide();
            }
        }
    });
}

function CheckRecoveryStatus(surgeryId) {
    $.ajax({
        url: EBSMSLocal + '/api/Schedule/CheckRecoveryStatus/',
        method: 'get',
        data: { shiftId: surgeryId },
        success: function success(data) {
            if (data == true) {
                $('#btn-change-finished-status').show();
            } else {
                $('#btn-change-finished-status').hide();
            }
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

//Add emergency
function AddEmergencyShift(startDatetime, endDatetime) {
    $.ajax({
        url: EBSMSLocal + '/api/Schedule/AddEmergencyShift/',
        method: 'post',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
            startTime: startDatetime,
            endTime: endDatetime
        }),
        success: function success(data) {
            console.log(data);
            if (data == true) {
                alert('Success');
                loadSurgeryRoom(convertDateToNumber(new Date($('#date-input').val())));
            }
            if (data == false) {
                alert('Fail');
            }
        }
    });
}
//---------------------------
//# sourceMappingURL=tungJS.js.map
