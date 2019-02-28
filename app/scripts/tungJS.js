//Get room show UI
// var EBSMSLocal = 'https://localhost:44372';
// var EBSMSLocal = 'http://192.168.100.180:5000';
var EBSMSLocal = 'http://localhost:5000';

// var FontEndLocal = 'http://localhost:9000';
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
                            if (shift[index].priorityNumber == 1) {
                                // strAppend2 += '<a href="./viewScheduleItem.html?id=' + shift[index].id + '"><div style="background-color: #FF8A80" class="div-roomBodyItem">';
                                strAppend2 += '<div style="background-color: #FF8A80" class="div-roomBodyItem">';
                            }
                            else if (shift[index].priorityNumber == 2) {
                                // strAppend2 += '<a href="./viewScheduleItem.html?id=' + shift[index].id + '"><div style="background-color: #FFFF8D" class="div-roomBodyItem">';
                                strAppend2 += '<div style="background-color: #FFFF8D" class="div-roomBodyItem">';
                            }
                            else {
                                strAppend2 += '<div style="background-color: #C8E6C9" class="div-roomBodyItem">';
                                // strAppend2 += '<a href="./viewScheduleItem.html?id=' + shift[index].id + '"><div style="background-color: #C8E6C9" class="div-roomBodyItem">';
                            }   
                            // 'Surgeon:' + 'Nguyễn Hoàng Anh' +
                            strAppend2 += '<div class="info-shift"><div><b>' + shift[index].id + '</b></div>' +
                            '<div><b>' + shift[index].catalogName + '</b></div>' +
                            '<div><b>Patient:</b> ' +  shift[index].patientName + '</div>' +
                            '<div><b>Time:</b> ' + shift[index].estimatedStartDateTime + ' - ' + shift[index].estimatedEndDateTime + '</div></div>' +
                            '<div class="mybuttonoverlap"><a href="./viewScheduleItem.html?id=' + shift[index].id + '" class="btn btn-info">View <i class="far fa-eye"/></a>'+
                            '<a href="javascript:void(0)" class="btn btn-primary" data-schedule-index="' + shift[index].id + '" data-toggle="modal" data-target="#changeTimeModal">Change <i class="far fa-edit"/></a></div>' +
                            '</div></a>';
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

function setPostStatus(surgeryShiftId) {   
    alert(surgeryShiftId);
    $.ajax({
        url:  EBSMSLocal + '/api/Schedule/SetPostoperativeStatus?shiftId='+ surgeryShiftId,
        method: 'post',
        success: function(data) {
            if (data == true) {
                alert('Change postoperative status successfully!');
            } else {
                alert('Fail!');
            }
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