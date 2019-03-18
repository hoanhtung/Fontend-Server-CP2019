'use strict';

<<<<<<< HEAD
var EBSMSLocal = 'https://localhost:44372';
// var EBSMSLocal = 'http://172.20.10.7:5000';
// var EBSMSLocal = 'http://localhost:5000';
=======
//Get room show UI

var EBSMSLocal = 'https://localhost:44372';
// var EBSMSLocal = 'http://172.20.10.7:5000';


// function loadSurgeryRoom(surgeryDay) {
//     var strAppend1 = '';
//     var divRoom = $('#row-surgery-room');
//     divRoom.empty();
//     $.ajax({
//         url: EBSMSLocal + '/api/Schedule/GetSurgeryRooms/',
//         method: 'get',
//         success: function(room) {
//             for (let index = 0; index < room.length; index++) {
//                 strAppend1 += '<div class="div-roomHeaderItem"><div class="div-room-name">' 
//                 + room[index].name + '</div><div id ="header-room-' + room[index].id + '"></div>';
//                 $.ajax({
//                     url: EBSMSLocal + '/api/Schedule/GetSurgeryShiftsByRoomAndDate/',
//                     method: 'get',
//                     data: { roomId: room[index].id, dayNumber: surgeryDay},
//                     success: function(shift) {
//                         var strAppend2 = '';
//                         for (let index = 0; index < shift.length; index++) {
//                             var firstEstimatedStart = shift[index].estimatedStartDateTime;
//                             var firstEstimatedEnd = shift[index].estimatedEndDateTime;
//                             var firstActualStart = shift[index].actualStartDateTime
//                             var firstActualEnd = shift[index].actualEndDateTime

//                             var estimatedStart = new Date(firstEstimatedStart);
//                             var estimatedEnd = new Date(firstEstimatedEnd);
//                             var actualStart = new Date(firstActualStart);
//                             var actualEnd = new Date(firstActualEnd);

//                             var shiftId = shift[index].id;

//                             if (shift[index].statusName == 'Postoperative') {
//                                 strAppend2 += '<div style="background-color: #b2bec3" class="div-roomBodyItem">';
//                             } else if (shift[index].statusName == 'Intraoperative') {
//                                 strAppend2 += '<div style="background-color: #ffeaa7" class="div-roomBodyItem">';
//                             }
//                             else {
//                                 strAppend2 += '<div class="div-roomBodyItem">';
//                             }   
//                             strAppend2 += '<div class="info-shift"><div>';
//                             if (shift[index].statusName != 'Intraoperative' && shift[index].statusName != 'Postoperative') {
//                                 strAppend2 += '<input name="swapChk" type="checkbox" value="' + shiftId  + '" />';
//                             }
//                             strAppend2 += '<b>' + shiftId + '</b></div>' +
//                             '<div><b>' + shift[index].catalogName + '</b></div>' +
//                             '<div><b>Patient:</b> ' +  shift[index].patientName + '</div>' +
//                             '<div><b>Time:</b> ';
//                             if (firstActualStart == undefined) {
//                                 strAppend2 += convertDateToTime(estimatedStart);
//                             } else {
//                                 strAppend2 += convertDateToTime(actualStart);
//                             }
//                             strAppend2 += ' - ';
//                             if (firstActualEnd == undefined) {
//                                 strAppend2 += convertDateToTime(estimatedEnd);
//                             } else {
//                                 strAppend2 += convertDateToTime(actualEnd);
//                             }
//                             strAppend2 += '</div></div>' +
//                             '<div class="mybuttonoverlap">' +
//                             '<a data-toggle="tooltip" title="View" href="./viewScheduleItem.html?id=' + shiftId + '" class="btn btn-info"><i class="far fa-eye"/></a>';
//                             if (shift[index].statusName == 'Preoperative') {
//                                 strAppend2 += '<a id="changeScheduleA" title="Change" href="javascript:void(0)" class="btn btn-primary" data-priority="' + shift[index].priorityNumber +
//                                 '" data-schedule-index="' + shiftId + '" data-start-datetime="' + formatStringtoDateTimeString(firstEstimatedStart) + '" data-end-datetime="' + formatStringtoDateTimeString(firstEstimatedEnd) + '" ' +
//                                 'data-toggle="modal" data-target="#changeTimeModal"><i class="far fa-edit"/></a>' +
//                                 '<button title="Begin" data-toggle="modal" data-target="#changeIntraStatusModal" class="btn btn-success" onclick="appendIntraSurgeryShiftId(' + shiftId + ', \'' + firstEstimatedStart + '\', \'' + firstEstimatedEnd + '\')">' + 
//                                 '<i class="fas fa-procedures"></i></button>' +
//                                 '</div>';
//                             }
//                             else if (shift[index].statusName == 'Intraoperative') {
//                                 strAppend2 += '<button title="Complete" class="btn btn-success" onclick="appendPostSurgeryShiftId(' + shiftId + ', \'' + firstActualStart + '\', \'' + firstEstimatedEnd + '\')" data-toggle="modal" data-target="#changePostStatusModal">' + 
//                                 '<i style="color: white" class="far fa-check-square"></i></button>' +
//                                 '</div>';
//                             } else {
//                                 strAppend2 += '</div>';
//                             }
//                             strAppend2 += '</div></a>';
//                         }
//                         $('#header-room-' + room[index].id).append(strAppend2);
//                     }
//                 });
//                 strAppend1 += '</div>';
//             }
//             divRoom.append(strAppend1);
//         }
//     });
// }
>>>>>>> 80fad4b49ba86cf323235eddbc6db11f535c3b04

function loadSurgeryRoom(surgeryDay) {
    var strAppend1 = '';
    var divRoom = $('#row-surgery-room');
    divRoom.empty();
    $.ajax({
        url: EBSMSLocal + '/api/Schedule/GetSlotRooms/',
        method: 'get',
        success: function success(room) {
            var _loop = function _loop(i) {
                strAppend1 += '<div class="div-item-surgery-room">';
                strAppend1 += '<div class = "div-room-name">' + room[i].name + '</div>';
                strAppend1 += '<div class="div-all-slot-room">';

                var _loop2 = function _loop2(j) {
                    strAppend1 += '<div class="div-item-slot-room" id="body-slot-room-' + room[i].slotRooms[j].id + '"></div>';
                    $.ajax({
                        url: EBSMSLocal + '/api/Schedule/GetSurgeryShiftsByRoomAndDate/',
                        method: 'get',
                        data: { slotRoomId: room[i].slotRooms[j].id, dayNumber: surgeryDay },
                        success: function success(shift) {
                            var strAppend2 = '';
                            for (var _index = 0; _index < shift.length; _index++) {
                                var firstEstimatedStart = shift[_index].estimatedStartDateTime;
                                var firstEstimatedEnd = shift[_index].estimatedEndDateTime;
                                var firstActualStart = shift[_index].actualStartDateTime;
                                var firstActualEnd = shift[_index].actualEndDateTime;

                                var estimatedStart = new Date(firstEstimatedStart);
                                var estimatedEnd = new Date(firstEstimatedEnd);
                                var actualStart = new Date(firstActualStart);
                                var actualEnd = new Date(firstActualEnd);

                                var shiftId = shift[_index].id;
                                if (shift[_index].statusName == 'Postoperative') {
                                    strAppend2 += '<div style="background-color: #b2bec3" class="div-shift-room">';
                                } else if (shift[_index].statusName == 'Intraoperative') {
                                    strAppend2 += '<div style="background-color: #ffeaa7" class="div-shift-room">';
                                } else {
                                    strAppend2 += '<div class="div-shift-room">';
                                }
                                strAppend2 += '<div class="info-shift">';
                                // if (shift[index].statusName != 'Intraoperative' && shift[index].statusName != 'Postoperative') {
                                //     strAppend2 += '<input name="swapChk" type="checkbox" value="' + shiftId  + '" />';
                                // }
                                strAppend2 += '<div><span><b>' + shiftId + '</b></span></div>';
                                strAppend2 += '<div><span><b>' + shift[_index].catalogName + '</b></div>';
                                strAppend2 += '<div><span><b>Patient: </b>' + shift[_index].patientName + '</span></div>';
                                strAppend2 += '<div><span><b>Time: </b>';
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
                                strAppend2 += '</span></div>'; //div time
                                strAppend2 += '<div class="mybuttonoverlap">' + '<a data-toggle="tooltip" title="View" href="./viewScheduleItem.html?id=' + shiftId + '" class="btn btn-info"><i class="far fa-eye"/></a>';
                                if (shift[_index].statusName == 'Preoperative') {
                                    strAppend2 += '<a id="changeScheduleA" title="Change" href="javascript:void(0)" class="btn btn-primary" data-priority="' + shift[_index].priorityNumber + '" data-schedule-index="' + shiftId + '" data-start-datetime="' + formatStringtoDateTimeString(firstEstimatedStart) + '" data-end-datetime="' + formatStringtoDateTimeString(firstEstimatedEnd) + '" ' + 'data-toggle="modal" data-target="#changeTimeModal"><i class="far fa-edit"/></a>' + '<button title="Begin" id="begin-btn" data-toggle="modal" data-target="#changeIntraStatusModal" class="btn btn-success" onclick="appendIntraSurgeryShiftId(' + shiftId + ', \'' + firstEstimatedStart + '\', \'' + firstEstimatedEnd + '\')">' + '<i class="fas fa-procedures"></i></button>' + '</div>'; //div mybuttonoverlap
                                } else if (shift[_index].statusName == 'Intraoperative') {
                                    strAppend2 += '<button title="Complete" class="btn btn-success" onclick="appendPostSurgeryShiftId(' + shiftId + ', \'' + firstActualStart + '\', \'' + firstEstimatedEnd + '\')" data-toggle="modal" data-target="#changePostStatusModal">' + '<i style="color: white" class="far fa-check-square"></i></button>' + '</div>'; //div mybuttonoverlap
                                } else {
                                    strAppend2 += '</div>'; //div mybuttonoverlap
                                }
                                strAppend2 += '</div>'; //div-shift-room
                                strAppend2 += '</div>'; //info-shift
                            }
                            $('#body-slot-room-' + room[i].slotRooms[j].id).html(strAppend2);
                            strAppend1 += '</div>'; //div-item-slot-room
                        }
                    }); // end ajax surgery shift
                };

                for (var j = 0; j < room[i].slotRooms.length; j++) {
                    _loop2(j);
                }
                strAppend1 += '</div>'; // div all slot room
                strAppend1 += '</div>'; // div item surgery room
            };

            for (var i = 0; i < room.length; i++) {
                _loop(i);
            }
            divRoom.html(strAppend1);
        }
        // async: false
    }); // end ajax room
}
function checkPreviousShift(surgeryShiftId) {
    var result;
    $.ajax({
        url: EBSMSLocal + '/api/Schedule/CheckStatusPreviousSurgeryShift',
        method: 'get',
        data: { 'shiftId': surgeryShiftId },
        success: function success(data) {
            // if (data) {
            //     $('#begin-btn').removeClass('btn-visibility');
            // } else {
            //     $('#begin-btn').addClass('btn-visibility');
            // }
            result = data;
            console.log('trong nay ne: ' + result);
        }
        // async: false
    });
    return result;
}

// change status
function startSurgeryShift(shiftId, actualStartTime) {
    var today = new Date($('#date-input').val());
    $.ajax({
        url: EBSMSLocal + '/api/Status/SetIntraoperativeStatus?shiftId=' + shiftId + '&actualStartDateTime=' + actualStartTime,
        method: 'post',
        success: function success(data) {
            if (data) {
                loadSurgeryRoom(convertDateToNumber(today));
                checkStatus(shiftId);
                loadSurgeryShiftDetail(shiftId);
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
        url: EBSMSLocal + '/api/Status/SetPostoperativeStatus?shiftId=' + surgeryShiftId + '&roomPost=' + roomPost + '&bedPost=' + bedPost + '&actualEndDateTime=' + actualEndTime,
        method: 'post',
        success: function success(data) {
            if (data) {
                refreshSchedule(surgeryShiftId);
                checkStatus(surgeryShiftId);
                loadSurgeryShiftDetail(surgeryShiftId);
            }
        }
    });
}

function SetFinishedStatus(surgeryShiftId) {
    $.ajax({
        url: EBSMSLocal + '/api/Status/SetFinishedStatus?shiftId=' + surgeryShiftId,
        method: 'post',
        success: function success(data) {
            if (data) {
                checkStatus(surgeryShiftId);
            }
        }
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
    var formatStartTime = formatStringtoDateTimeString(start).split(' ')[0];
    $('#actual-start').val(formatStartTime);
}
function appendPostSurgeryShiftId(shiftId, start, end) {
    $('#surgery-shift-post-status').html(shiftId);
    $('#surgery-shift-post-status').data('shiftId', shiftId);
    $('.estimated-start-time').html(formatStringtoDateTimeString(start));
    $('.estimated-end-time').html(formatStringtoDateTimeString(end));
    $('#surgery-shift-post-status').data('day', end.split('T')[0]);

    var formatEndTime = formatStringtoDateTimeString(end).split(' ')[0];
    $('#actual-end').val(formatEndTime);
}
// -----------------------------------

function LoadSurgeryShiftByRoomAndDate() {
    $.ajax({
        url: EBSMSLocal + '/api/Schedule/GetSurgeryShiftsByRoomAndDate/',
        method: 'get',
        data: { roomId: room[index].id, dayNumber: surgeryDay },
        success: function success(shift) {
            for (var _index2 = 0; _index2 < shift.length; _index2++) {
                strAppend += '<a href="./viewScheduleItem.html?Id=' + shift[_index2].id + '"><div class="div-roomBodyItem">' + shift[_index2].catelogName + 'Patient: ' + shift[_index2].patientName + 'Time: ' + shift[_index2].estimatedStartDateTime + '-' + shift[_index2].estimatedEndDateTime;
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
            $('#span-id').html(shift.id);
            $('#span-name').html(shift.patientName);
            $('#span-gender').html(shift.gender);
            $('#span-age').html(shift.age);
            $('#span-specialty').html(shift.speciality);
            $('#span-surgery-name').html(shift.surgeryName);
            $('#span-surgery-type').html(shift.surgeryType);
            $('#span-start-time').data('start', shift.startTime);
            $('#span-start-time').html(formatStringtoDateTimeString(shift.startTime));
            $('#span-end-time').data('end', shift.endTime);
            $('#span-end-time').html(formatStringtoDateTimeString(shift.endTime));
            $('#textarea-procedure').html(shift.procedure);

            if (shift.actualStartTime != null) {
                $('#span-actual-start-time').html(formatStringtoDateTimeString(shift.actualStartTime));
                $('#span-actual-start-time').data('actual-start', shift.actualStartTime);
            } else {
                $('#span-actual-start-time').html('N/A');
            }
            if (shift.actualEndTime != null) {
                $('#span-actual-end-time').html(formatStringtoDateTimeString(shift.actualEndTime));
                $('#span-actual-end-time').data('actual-end', shift.actualEndTime);
            } else {
                $('#span-actual-end-time').html('N/A');
            }
        },
        async: false
    });
}

function makeSchedule() {
    $.ajax({
        url: EBSMSLocal + '/api/Schedule/MakeScheduleList',
        method: 'get',
        success: function success(data) {
            alert('nice');
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

function checkStatus(surgeryId) {
    var preStatus = 'Preoperative';
    var intraStatus = 'Intraoperative';
    var postStatus = 'Postoperative';
    $('#btn-start-surgery').addClass('btn-visibility');
    $('#btn-complete-surgery').addClass('btn-visibility');
    $('#btn-finish-caring').addClass('btn-visibility');
    $.ajax({
        url: EBSMSLocal + '/api/Status/GetStatusByShiftId/',
        method: 'get',
        data: { shiftId: surgeryId },
        success: function success(data) {
            if (data.toLowerCase() == preStatus.toLowerCase()) {
                $('#btn-start-surgery').removeClass('btn-visibility');
            }
            if (data.toLowerCase() == intraStatus.toLowerCase()) {
                $('#btn-complete-surgery').removeClass('btn-visibility');
            }
            if (data.toLowerCase() == postStatus.toLowerCase()) {
                $('#btn-finish-caring').removeClass('btn-visibility');
            }
        },
        async: false
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
function AddEmergencyShift(startDatetime, endDatetime, chkForce) {
    $.ajax({
        url: EBSMSLocal + '/api/Schedule/AddEmergencyShift/',
        method: 'post',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
            startTime: startDatetime,
            endTime: endDatetime,
            isForceAdd: chkForce
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
