'use strict';

//Get room show UI
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
                            if (shift[_index2].estimatedStartDateTime == '13:00') {
                                strAppend2 += '<div style="background-color: black; height: 50px"></div>';
                            }
                            if (shift[_index2].priorityNumber == 1) {
                                strAppend2 += '<a href="./viewScheduleItem.html"><div style="background-color: #FF8A80" class="div-roomBodyItem">';
                            } else if (shift[_index2].priorityNumber == 2) {
                                strAppend2 += '<a href="./viewScheduleItem.html"><div style="background-color: #FFFF8D" class="div-roomBodyItem">';
                            } else {
                                strAppend2 += '<a href="./viewScheduleItem.html"><div style="background-color: #C8E6C9" class="div-roomBodyItem">';
                            }
                            // 'Surgeon:' + 'Nguyễn Hoàng Anh' +
                            strAppend2 += '<div><b>' + shift[_index2].catalogName + ' ' + shift[_index2].id + '</b></div>' + '<div><b>Patient:</b> ' + shift[_index2].patientName + '</div>' + '<div><b>Time:</b> ' + shift[_index2].estimatedStartDateTime + ' - ' + shift[_index2].estimatedEndDateTime + '</div>' + '</div></a>';
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
            console.log(shift);
            for (var _index3 = 0; _index3 < shift.length; _index3++) {
                strAppend += '<a href="./viewScheduleItem.html"><div class="div-roomBodyItem">' +
                // 'Surgeon:' + 'Nguyễn Hoàng Anh' +
                // 'Phẫu thuật xương' +
                shift[_index3].catelogName + 'Patient: ' + shift[_index3].patientName + 'Time: ' + shift[_index3].estimatedStartDateTime + '-' + shift[_index3].estimatedEndDateTime;
                '</div></a>';
            }
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
//# sourceMappingURL=tungJS.js.map
