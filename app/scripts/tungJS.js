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
        success: function(room) {
            for (let index = 0; index < room.length; index++) {
                strAppend1 += '<div class="div-roomHeaderItem"><div class="div-room-name">' 
                + room[index].name + '</div><div id ="header-room-' + room[index].id + '"></div>';
                $.ajax({
                    url: EBSMSLocal + '/api/Schedule/GetSurgeryShiftsByRoomAndDate/',
                    method: 'get',
                    data: { roomId: room[index].id, dayNumber: surgeryDay},
                    success: function(shift) {
                        var strAppend2 = '';
                        for (let index = 0; index < shift.length; index++) {
                            var firstEstimatedStart = shift[index].estimatedStartDateTime;
                            var firstEstimatedEnd = shift[index].estimatedEndDateTime;
                            var firstActualStart = shift[index].actualStartDateTime
                            var firstActualEnd = shift[index].actualEndDateTime

                            var estimatedStart = new Date(firstEstimatedStart);
                            var estimatedEnd = new Date(firstEstimatedEnd);
                            var actualStart = new Date(firstActualStart);
                            var actualEnd = new Date(firstActualEnd);
                            
                            var shiftId = shift[index].id;
                            if (shift[index].statusName == 'Postoperative') {
                                strAppend2 += '<div style="background-color: #b2bec3" class="div-roomBodyItem">';
                            } else if (shift[index].statusName == 'Intraoperative') {
                                strAppend2 += '<div style="background-color: #ffeaa7" class="div-roomBodyItem">';
                            }
                            else {
                                strAppend2 += '<div class="div-roomBodyItem">';
                            }   
                            strAppend2 += '<div class="info-shift"><div><input type="checkbox" value="' + shiftId  + '" /><b>' + shiftId + '</b></div>' +
                            '<div><b>' + shift[index].catalogName + '</b></div>' +
                            '<div><b>Patient:</b> ' +  shift[index].patientName + '</div>' +
                            '<div><b>Time:</b> ';
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
                            strAppend2 += '</div></div>' +
                            '<div class="mybuttonoverlap">' +
                            '<a data-toggle="tooltip" title="View" href="./viewScheduleItem.html?id=' + shiftId + '" class="btn btn-info"><i class="far fa-eye"/></a>';
                            if (shift[index].statusName == 'Preoperative') {
                                strAppend2 += '<a title="Change" href="javascript:void(0)" class="btn btn-primary" data-priority="' + shift[index].priorityNumber +
                                '" data-schedule-index="' + shiftId + '" data-start-datetime="' + formatStringtoDateTimeString(firstEstimatedStart) + '" data-end-datetime="' + formatStringtoDateTimeString(firstEstimatedEnd) + '" ' +
                                'data-toggle="modal" data-target="#changeTimeModal"><i class="far fa-edit"/></a>' +
                                '<button title="Begin" data-toggle="modal" data-target="#changeIntraStatusModal" class="btn btn-success" onclick="appendIntraSurgeryShiftId(' + shiftId + ', \'' + firstEstimatedStart + '\', \'' + firstEstimatedEnd + '\')">' + 
                                '<i class="fas fa-procedures"></i></button>' +
                                '</div>';
                            }
                            
                            else if (shift[index].statusName == 'Intraoperative') {
                                strAppend2 += '<button title="Complete" class="btn btn-success" onclick="appendPostSurgeryShiftId(' + shiftId + ', \'' + firstEstimatedStart + '\', \'' + firstEstimatedEnd + '\')" data-toggle="modal" data-target="#changePostStatusModal">' + 
                                '<i style="color: white" class="far fa-check-square"></i></button>' +
                                '</div>';
                            } else {
                                strAppend2 += '</div>';
                            }
                            strAppend2 += '</div></a>';
                        }
                        $('#header-room-' + room[index].id).append(strAppend2);
                    }
                });
                strAppend1 += '</div>';
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
        success: function(data) {
            if (data == true) {
                loadSurgeryRoom(convertDateToNumber(new Date($('#date-input').val())));
            }
        }
    })
}
function setPostStatus(surgeryShiftId, actualEndTime) {   
    const roomPost = $('#roomPost').val();
    const bedPost = $('#bedPost').val();
    const nurseId =  $('#select-nurse').children("option:selected").attr('id');
    $.ajax({
        url: EBSMSLocal + '/api/Schedule/SetPostoperativeStatus?shiftId=' + surgeryShiftId + 
        '&roomPost=' + roomPost + '&bedPost=' + bedPost + '&actualEndDateTime=' + actualEndTime + '&nurseId=' + nurseId,
        method: 'post',
        success: function(data) {
            loadSurgeryRoom(convertDateToNumber(new Date($('#date-input').val())));
        }
    })
}
function SetFinishedStatus(surgeryShiftId) {   
    $.ajax({
        url: EBSMSLocal + '/api/Schedule/SetFinishedStatus?shiftId=' + surgeryShiftId,
        method: 'post',
        success: function(data) {
        }
    })
}

//-----------------------------------
// append surgery modal
function appendIntraSurgeryShiftId(shiftId, start, end) {
    $('#surgery-shift-intra-status').html(shiftId)
    $('#surgery-shift-intra-status').data('shiftId', shiftId);
    $('.estimated-start-time').html(formatStringtoDateTimeString(start));
    $('.estimated-end-time').html(formatStringtoDateTimeString(end));
    $('#surgery-shift-intra-status').data('day', end.split('T')[0]);
}
function appendPostSurgeryShiftId(shiftId, start, end) {
    $('#surgery-shift-post-status').html(shiftId)
    $('#surgery-shift-post-status').data('shiftId', shiftId);
    $('.estimated-start-time').html(formatStringtoDateTimeString(start));
    $('.estimated-end-time').html(formatStringtoDateTimeString(end));
    $('#surgery-shift-post-status').data('day', end.split('T')[0]);
    getNurse();
}
// -----------------------------------

function LoadSurgeryShiftByRoomAndDate() {
    $.ajax({
        url: EBSMSLocal + '/api/Schedule/GetSurgeryShiftsByRoomAndDate/',
        method: 'get',
        data: { roomId: room[index].id, dayNumber: surgeryDay},
        success: function(shift) {
            for (let index = 0; index < shift.length; index++) {
                strAppend += '<a href="./viewScheduleItem.html?Id=' + shift[index].id + '"><div class="div-roomBodyItem">' +
                shift[index].catelogName +
                'Patient: ' +  shift[index].patientName +
                'Time: ' + shift[index].estimatedStartDateTime + '-' + shift[index].estimatedEndDateTime;
                '</div></a>';
            }
        }
    });
}

function loadSurgeryShiftDetail(surgeryShiftId) {
    $.ajax({
        url: EBSMSLocal + '/api/Schedule/GetSurgeryShiftDetail/',
        method: 'get',
        data: { shiftId: surgeryShiftId},
        success: function(shift) {
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
        success: function(data) {
            window.location.href = 'viewSchedule.html';
            // console.log(data.m_StringValue);
            // $('#content-schedule-notification').html(data.m_StringValue);
            // $(window).on('load', function() {
            //     $('#modal-schedule-notification').modal('show');
            // });
        }
    })
}


function makeScheduleProposedTime() {
    $.ajax({
        url: EBSMSLocal + '/api/Schedule/MakeScheduleProposedTime',
        method: 'get',
    })
    window.location.href = 'viewSchedule.html';
}

function loadSurgeryShiftNoSchedule() {
    var div_shift = $('#div-shift-no-schedule');
    $.ajax({
        url: EBSMSLocal + '/api/Schedule/GetSurgeryShiftsNoSchedule',
        method: 'get',
        success: function(data) {
            if (data.length != 0) {
                var container = '<table id="table-no-schedule" class="table"><thead><tr><th>No.</th><th>Shift ID</th>'
                + '<th>Confirm Time</th><th>Proposed Time</th><th>Schedule Time</th>'
                + '<th>Priority Number</th><th>ExpectedDuration</th></tr></thead>';
                for (var i = 0; i < data.length; i++) {
                    container += '<tr><td>' + (i + 1) + '</td>' 
                                + '<td>' +  data[i].surgeryShiftId + '</td>'
                                + '<td>' + data[i].confirmDate.split('T')[0] + ' ' + data[i].confirmDate.split('T')[1].split('.')[0] + '</td>';
                    if (data[i].proposedStartDateTime != undefined 
                        && data[i].proposedEndDateTime != undefined) {
                        container += '<td>' + data[i].proposedStartDateTime.split('T')[0] 
                        + ' | ' + data[i].proposedStartDateTime.split('T')[1] + ' - ' 
                        + data[i].proposedEndDateTime.split('T')[1] + '</td>';
                    } else {
                        container += '<td>N/A</td>'
                    }
                    container += '<td>' + data[i].scheduleDate.split('T')[0] + '</td>'
                                + '<td>' + data[i].priorityNumber + '</td>'
                                + '<td>' + data[i].expectedSurgeryDuration + '</td></tr>';
                }
                container += '</table>';
                div_shift.append(container);
            } else {   
                div_shift.append('<h2>Not found no schedule surgery shift</h2>');                   
            }
            
        }
    })
}
function loadSurgeryShiftNoScheduleByProposedTime() {
    var div_shift = $('#div-shift-proposed');
    $.ajax({
        url: EBSMSLocal + '/api/Schedule/GetSurgeryShiftNoScheduleByProposedTime',
        method: 'get',
        success: function(data) {
            var container = '<table class="table-no-schedule"><thead><tr><th>No.</th><th>Shift ID</th>'
                            + '<th>Proposed Time</th><th>Schedule Time</th>'
                            + '<th>Priority Number</th></th><th>ExpectedDuration</th></tr></thead>';
            for (var i = 0; i < data.length; i++) {
                container += '<tr><td>' + (i + 1) + '</td><td>' +  data[i].surgeryShiftId + '</td><td>';
                if (data[i].proposedStartDateTime != undefined && data[i].proposedEndDateTime != undefined) {
                    container += data[i].proposedStartDateTime.split('T')[0] 
                    + ' ' + data[i].proposedStartDateTime.split('T')[1] + ' - ' 
                    + data[i].proposedEndDateTime.split('T')[1];
                }
                container += '</td>'
                            // + '<td>' + data[i].priorityNumber + '</td>'
                            + '<td>' + data[i].scheduleDate + '</td>'
                + '<td>' + data[i].priorityNumber + '</td>'
                + '<td>' + data[i].expectedSurgeryDuration + '</td></tr>';
            }
            container += '</table>';
            div_shift.append(container);
        }
    })
 }
function checkSetPostStatus(surgeryId) {
    $.ajax({
        url: EBSMSLocal + '/api/Schedule/CheckPostStatus/',
        method: 'get',
        data: {shiftId: surgeryId},
        success: function(data) {
            if (data == 1) {
                $('#checkSetPostStatus').show();
            } 
            else if (data == 2) {
                $('#btn-change-post-status').hide();    
            }
            else {
                $('#btn-change-post-status').hide();
            }
        }
    })
}

function CheckRecoveryStatus(surgeryId) {
    $.ajax({
        url: EBSMSLocal + '/api/Schedule/CheckRecoveryStatus/',
        method: 'get',
        data: {shiftId: surgeryId},
        success: function(data) {
            if (data == true) {
                $('#btn-change-finished-status').show();
            } 
            else {
                $('#btn-change-finished-status').hide();
            }
        }
    })
}

function appendChangeInfoShift(id, start, end) {
    $('#change-shift-id').html(id);
    $('#change-date').html(start.split(' ')[1]);
    $('#change-start-time').html(start.split(' ')[0]);
    $('#change-end-time').html(end.split(' ')[0])
}

function getScheduleByDay() {
    var date = new Date($('#date-input').val());
    loadSurgeryRoom(convertDateToNumber(date));
}
function convertDateToNumber(date) {
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
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
    var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
    var year = date.getFullYear();
    var dateString = [year, month, day].join('-');
    return dateString;
}
function formatDateToDateTimeString(date) {
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
    var year = date.getFullYear();
    var dateString = [day, month, year].join('/');
    return dateString;
}
function formatDateToString(date) {
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
    var year = date.getFullYear();
    var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    return [hour, minute].join(':') + ' ' + [day, month, year].join('/')  ;
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