//Get room show UI
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
                            var estimatedStart = new Date(shift[index].estimatedStartDateTime);
                            var estimatedEnd = new Date(shift[index].estimatedEndDateTime);
                            if (estimatedEnd < new Date()) {
                                strAppend2 += '<div style="background-color: #b2bec3" class="div-roomBodyItem">';
                            }

                            else {
                                strAppend2 += '<div class="div-roomBodyItem">';
                            }   
                            strAppend2 += '<div class="info-shift"><div><b>' + shift[index].id + '</b></div>' +
                            '<div><b>' + shift[index].catalogName + '</b></div>' +
                            '<div><b>Patient:</b> ' +  shift[index].patientName + '</div>' +
                            '<div><b>Time:</b> ' + convertDateToTime(estimatedStart) + ' - ' + convertDateToTime(estimatedEnd) + '</div></div>' +
                            '<div class="mybuttonoverlap"><a href="./viewScheduleItem.html?id=' + shift[index].id + 
                            '" class="btn btn-info">View<i class="far fa-eye"/></a>';
                            if (estimatedEnd < new Date()) {
                                strAppend2 += '</div>';
                            } else {
                                strAppend2 += '<a href="javascript:void(0)" class="btn btn-primary" data-priority="' + shift[index].priorityNumber +'" data-schedule-index="' + shift[index].id + 
                                '" data-toggle="modal" data-target="#changeTimeModal">Change <i class="far fa-edit"/></a></div>';
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
    })
    window.location.href = 'viewSchedule.html';
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
                $('#btn-change-post-status').show();
            } 
            else if (data == 2) {
                $('#btn-change-post-status').attr('style', 'cursor: not-allowed').attr('disabled', '');    
            }
            else {
                $('#btn-change-post-status').hide();
            }
        }
    })
}

function setPostStatus(surgeryShiftId) {   
    const roomPost = $('#roomPost').val();
    const bedPost = $('#bedPost').val();
    $.ajax({
        url: EBSMSLocal + '/api/Schedule/SetPostoperativeStatus?shiftId=' + surgeryShiftId + 
        '&roomPost=' + roomPost + '&bedPost=' + bedPost,
        method: 'post',
        success: function(data) {
            if (data == true) {
                alert('Change postoperative status successfully!');
            } else {
                alert('Fail!');
            }
            checkSetPostStatus(surgeryShiftId)
        }
    })
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