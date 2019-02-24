//Get room show UI
var EBSMSLocal = 'https://localhost:44372';
var FontEndLocal = 'http://localhost:9000';
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
                            if (shift[index].estimatedStartDateTime == '13:00') {
                                strAppend2 += '<div style="background-color: black; height: 50px"></div>'
                            }
                            if (shift[index].priorityNumber == 1) {
                                strAppend2 += '<div onclick="loadSurgeryShiftDetail(' + shift[index].id + ')"><div style="background-color: #FF8A80" class="div-roomBodyItem">';
                            }
                            else if (shift[index].priorityNumber == 2) {
                                strAppend2 += '<a href="./viewScheduleItem.html/' + shift[index].id + '"><div style="background-color: #FFFF8D" class="div-roomBodyItem">';
                            }
                            else {
                                strAppend2 += '<a href="./viewScheduleItem.html/' + shift[index].id + '"><div style="background-color: #C8E6C9" class="div-roomBodyItem">';
                            }   
                            // 'Surgeon:' + 'Nguyễn Hoàng Anh' +
                            strAppend2 += '<div><b>' + shift[index].catalogName + ' ' + shift[index].id + '</b></div>' +
                            '<div><b>Patient:</b> ' +  shift[index].patientName + '</div>' +
                            '<div><b>Time:</b> ' + shift[index].estimatedStartDateTime + ' - ' + shift[index].estimatedEndDateTime + '</div>' +
                            '</div></div>';
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
            console.log(shift);
            for (let index = 0; index < shift.length; index++) {
                strAppend += '<a href="./viewScheduleItem.html"><div class="div-roomBodyItem">' +
                // 'Surgeon:' + 'Nguyễn Hoàng Anh' +
                // 'Phẫu thuật xương' +
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
            window.location.href = FontEndLocal + '/viewScheduleItem.html';
        }
    });
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
 