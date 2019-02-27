$('#changeTimeModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var scheduleIndex = button.data('schedule-index');
    $('#changeRoomWrapper').css('visibility', 'hidden');
    $('#changeRoom').data('shift-id', scheduleIndex);
    $('#changeRoomDurationWrapper').css('visibility', 'hidden');
    $('#changeRoomDuration').data('shift-id', scheduleIndex);
});
$('#checkSchedule').click(function() {
    var start = new Date($('#startTime').val()).toJSON();
    var end = new Date($('#endTime').val()).toJSON();
    loadAvailableRoomByStartEnd(start, end);
});
$('#checkScheduleDuration').click(function() {
    var hour = $('#hour').val();
    var minute = $('#minute').val();
    loadAvailableRoomByHourMinute(hour, minute);
});
$('#changeRoom').click(function() {
    var shiftId = $(this).data('shift-id');
    var start = new Date($('#startTime').val()).toJSON();
    var end = new Date($('#endTime').val()).toJSON();
    var roomId = Number.parseInt($('#availableRoom').val());
    changeSchedule(shiftId, start, end, roomId);
});
$('#changeRoomDuration').click(function() {
    var shiftId = $(this).data('shift-id');
    var room = $('#availableDurationRoom').val();
    var roomArr = room.split(';');
    var roomId = Number.parseInt(roomArr[0]);
    var start = roomArr[1];
    var end = roomArr[2];
    changeScheduleDuration(shiftId, start, end, roomId);
});