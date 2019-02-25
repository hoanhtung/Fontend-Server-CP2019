'use strict';

var EBSMSLocal = 'https://localhost:44372';

function removeSessionStorage() {
    sessionStorage.removeItem('infoObj');
    sessionStorage.removeItem('supplyObj');
    javascript: window.location.href = 'importList.html';
}

function getJSONfromSession() {
    var infoJSON = JSON.parse(sessionStorage.getItem('infoObj'));
    var supplyJSON = JSON.parse(sessionStorage.getItem('supplyObj'));
    if (infoJSON != null) parseImportInfo(infoJSON);
}

function ExcelExport(event) {
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function () {
        var fileData = reader.result;
        var wb = XLSX.read(fileData, { type: 'binary' });

        wb.SheetNames.forEach(function (sheetName) {
            var rowObj = XLSX.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);

            switch (sheetName) {
                case 'SurgeryProfile':
                    parseImportInfo(rowObj);
                    sessionStorage.setItem('infoObj', JSON.stringify(rowObj));
                    break;
                case 'MedicalSupply':
                    sessionStorage.setItem('supplyObj', JSON.stringify(rowObj));
                    break;
            }
        });
    };
    reader.readAsBinaryString(input.files[0]);
};
function parseImportInfo(jsonObj) {
    var table = document.getElementById('profile').getElementsByTagName('tbody')[0];
    for (var i = 0; i < jsonObj.length; i++) {
        var newRow = table.insertRow(table.rows.length);
        var newColumn;

        newColumn = newRow.insertCell(0);
        var a = document.createElement('a');
        a.appendChild(document.createTextNode(jsonObj[i]['Patient Name']));
        a.href = 'importDetail.html?no=' + jsonObj[i]['Surgery Shift Code'];
        newColumn.appendChild(a);

        newColumn = newRow.insertCell(1);
        newColumn.appendChild(document.createTextNode(jsonObj[i]['Gender']));
        newColumn = newRow.insertCell(2);
        newColumn.appendChild(document.createTextNode(jsonObj[i]['Medical Record']));
        newColumn = newRow.insertCell(3);
        newColumn.appendChild(document.createTextNode(jsonObj[i]['Surgery Name']));
        newColumn = newRow.insertCell(4);
        newColumn.appendChild(document.createTextNode(jsonObj[i]['Surgeon Name']));
        newColumn = newRow.insertCell(5);
        newColumn.appendChild(document.createTextNode(jsonObj[i]['Expected Date'] + ' - ' + jsonObj[i]['Expected Time']));
        newColumn = newRow.insertCell(6);
        newColumn.appendChild(document.createTextNode(jsonObj[i]['Surgery Weight']));
    }
}

function saveSurgeryProfile() {
    var shift = JSON.parse(sessionStorage.getItem('infoObj'));
    var shiftInfo = [];
    for (var sh in shift) {
        var gender = -1;
        var proStartDate = '',
            proEndDate = '';
        if (shift[sh]['Expected Date'] != 'NULL') {
            var day = shift[sh]['Expected Date'];
            var start = shift[sh]['Expected Time'].split(' - ')[0];
            var end = shift[sh]['Expected Time'].split(' - ')[1];
            proStartDate = day + ' ' + start;
            proEndDate = day + ' ' + end;
        }
        if (shift[sh]['Gender'] == 'Male') gender = 1;
        shiftInfo.push({
            'expectedSurgeryDuration': shift[sh]['Surgery Weight'],
            'priorityNumber': Number(shift[sh]['Priority']),
            'patientID': shift[sh]['Patient Id'],
            'patientName': shift[sh]['Patient Name'],
            'gender': gender,
            'yearOfBirth': Number(shift[sh]['Patient DOB']),
            'surgeryCatalogID': Number(shift[sh]['Surgery Code']),
            'surgeryShiftCode': shift[sh]['Surgery Shift Code'],
            'surgoenId': Number(shift[sh]['SurgeonID']),
            'proposedStartDateTime': proStartDate,
            'proposedEndDateTime': proEndDate
        });
    }

    $.ajax({
        url: EBSMSLocal + '/api/Import/ImportSurgeryShift',
        method: 'post',
        data: JSON.stringify(shiftInfo),
        contentType: 'application/json',
        dataType: 'json',
        success: function success() {
            var supplyList = JSON.parse(sessionStorage.getItem('supplyObj'));
            var supplyJson = [];
            for (var s in supplyList) {
                supplyJson.push({
                    medicalSupplyId: Number(supplyList[s]['Code']),
                    surgeryShiftCode: supplyList[s]['Surgery Shift Code']
                });
            }
            console.log(supplyJson);
            $.ajax({
                url: EBSMSLocal + '/api/Import/ImportSurgeryShiftMedicalSupply',
                method: 'post',
                data: JSON.stringify(supplyJson),
                contentType: 'application/json',
                dataType: 'json',
                success: function success() {
                    sessionStorage.removeItem('infoObj');
                    sessionStorage.removeItem('supplyObj');
                    alert('Import successfully!');
                    window.location.href = 'importList.html';
                }
            });
        }
    });
}

function deleteRecord() {
    var supplyJSON = JSON.parse(sessionStorage.getItem('supplyObj'));
    var infoJSON = JSON.parse(sessionStorage.getItem('infoObj'));
    var url_string = window.location.href;
    var url = new URL(url_string);
    var no = url.searchParams.get('no');

    for (var i = 0; i < infoJSON.length; i++) {
        if (infoJSON[i]['Surgery Shift Code'] == no) {
            delete infoJSON[i];
            break;
        }
    }
    for (var i = 0; i < supplyJSON.length; i++) {
        if (supplyJSON[i]['Surgery Shift Code'] == no) {
            delete supplyJSON[i];
            i--;
        }
    }
    sessionStorage.removeItem('infoJSON');
    sessionStorage.removeItem('supplyJSON');
    sessionStorage.setItem('infoObj', JSON.stringify(infoJSON));
    sessionStorage.setItem('supplyJSON', JSON.stringify(supplyJSON));
    javascript: window.location.href = 'importList.html';
}

function parseJSONImportDetail(jsonObj) {
    var table = document.getElementById('listSupply').getElementsByTagName('tbody')[0];
    var supplyJSON = jsonObj;
    var j = 0;
    var url_string = window.location.href;
    var url = new URL(url_string);
    var no = url.searchParams.get('no');
    for (var i = 0; i < supplyJSON.length; i++) {
        if (supplyJSON[i]['Surgery Shift Code'] == no) {
            var newRow = table.insertRow(table.rows.length);
            var newColumn;

            newColumn = newRow.insertCell(0);
            newColumn.appendChild(document.createTextNode(++j));
            newColumn = newRow.insertCell(1);
            newColumn.appendChild(document.createTextNode(supplyJSON[i]['Code']));
            newColumn = newRow.insertCell(2);
            newColumn.appendChild(document.createTextNode(supplyJSON[i]['Name']));
        }
    }
}

function getImportDetail() {
    //get surgery code from url
    var url_string = window.location.href;
    var url = new URL(url_string);
    var no = url.searchParams.get('no');

    var supplyJSON = JSON.parse(sessionStorage.getItem('supplyObj'));
    parseJSONImportDetail(supplyJSON);
}

// === JS for MEDICAL SUPPLY CONFIRM ===
var surgeryCode;

function getRequestDetail() {
    //get surgery code from url
    var url_string = window.location.href;
    var url = new URL(url_string);
    surgeryCode = url.searchParams.get('code');
    document.getElementById('sid').innerHTML = surgeryCode;
    document.getElementById('name').innerHTML = url.searchParams.get('sname');
    document.getElementById('patient').innerHTML = url.searchParams.get('pname');
    $.ajax({
        url: EBSMSLocal + '/api/MedicalConfirm/GetMedicalSupplyRequest',
        method: 'get',
        data: { surgeryShiftId: surgeryCode },
        success: function success(data) {
            var table = document.getElementById('listSupply').getElementsByTagName('tbody')[0];
            for (var i = 0; i < data.length; i++) {
                var newRow = table.insertRow(table.rows.length);
                var newColumn;

                newColumn = newRow.insertCell(0);
                newColumn.appendChild(document.createTextNode(i + 1));
                newColumn = newRow.insertCell(1);
                newColumn.appendChild(document.createTextNode(data[i]['code']));
                newColumn = newRow.insertCell(2);
                newColumn.appendChild(document.createTextNode(data[i]['name']));
            }
        }
    });
}
//Send confirm MS
function confirmSupply() {
    $.ajax({
        url: EBSMSLocal + '/api/MedicalConfirm/ConfirmMedicalRequest',
        method: 'get',
        data: { surgeryShiftId: surgeryCode }
    });
    window.location.href = 'confirmMSRequest.html';
}

function confirmAllSupply() {
    alert('asdasdas');
    $.ajax({
        url: EBSMSLocal + '/api/MedicalConfirm/ConfirmedAllSupplyRequest',
        method: 'get'
    });
    window.location.href = 'confirmMSRequest.html';
}
//Get all medical supply request
function getMedicalRequest() {
    $.ajax({
        url: EBSMSLocal + '/api/MedicalConfirm/GetAllMedicalSupplyRequest',
        method: 'get',
        success: function success(data) {
            var table = document.getElementById('request').getElementsByTagName('tbody')[0];
            for (var i = 0; i < data.length; i++) {
                var newRow = table.insertRow(table.rows.length);
                var newColumn;
                newColumn = newRow.insertCell(0);
                newColumn.appendChild(document.createTextNode(i + 1));

                newColumn = newRow.insertCell(1);
                var a = document.createElement('a');
                a.appendChild(document.createTextNode(data[i]['id']));
                a.href = 'requestDetail.html?code=' + data[i]['id'] + '&sname=' + data[i]['surgeryName'] + '&pname=' + data[i]['patientName'];
                newColumn.appendChild(a);

                newColumn = newRow.insertCell(2);
                newColumn.appendChild(document.createTextNode(data[i]['surgeryCatalogId']));
                newColumn = newRow.insertCell(3);
                newColumn.appendChild(document.createTextNode(data[i]['surgeryName']));
                newColumn = newRow.insertCell(4);
                newColumn.appendChild(document.createTextNode(data[i]['patientName']));
                newColumn = newRow.insertCell(5);
                newColumn.appendChild(document.createTextNode(data[i]['createdDate']));
            }
        }
    });
}
//# sourceMappingURL=linhJS.js.map
