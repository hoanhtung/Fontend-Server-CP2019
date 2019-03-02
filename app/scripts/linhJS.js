
// var EBSMSLocal = 'http://192.168.100.180:5000';
// var EBSMSLocal = 'http://10.82.139.179:5000';
// var EBSMSLocal = 'http://127.20.10.7:5000';
function removeSessionStorage() {
    sessionStorage.removeItem('infoObj');
    sessionStorage.removeItem('supplyObj');
    javascript:window.location.href='importList.html'
}

function getJSONfromSession() {
    var infoJSON = JSON.parse(sessionStorage.getItem('infoObj'));
    var supplyJSON = JSON.parse(sessionStorage.getItem('supplyObj'));
    if (infoJSON != null)
        parseImportInfo(infoJSON);
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
                console.log(rowObj);
                    parseImportInfo(rowObj);
                    sessionStorage.setItem('infoObj', JSON.stringify(rowObj));
                    break;
                case 'MedicalSupply':
                    sessionStorage.setItem('supplyObj', JSON.stringify(rowObj));
                    break;
            }
        })
    };
    reader.readAsBinaryString(input.files[0]);
};
function parseImportInfo(jsonObj) {
    var table = document.getElementById('profile').getElementsByTagName('tbody')[0];
    for (var i = 0; i < jsonObj.length; i++) {
        var newRow = table.insertRow(table.rows.length);
        var newColumn;

        newColumn = newRow.insertCell(0);
        // var checkBox = document.createElement("input");
        // checkBox.setAttribute("type", "checkbox");
        // checkBox.setAttribute("value", jsonObj[i]['Surgery Shift Code']);
        // checkBox.setAttribute("class", "checkbox");
        // newColumn.appendChild(checkBox);
        newColumn = newRow.insertCell(1);
        newColumn.appendChild(document.createTextNode(i + 1));
        newColumn = newRow.insertCell(2);
        var a = document.createElement('a');
        a.appendChild(document.createTextNode(jsonObj[i]['Patient Name']));
        a.href = '#';
        let surgeryShiftCode = jsonObj[i]['Surgery Shift Code'];
        a.addEventListener('click', () => {
            getImportDetail(surgeryShiftCode);
        });
        newColumn.appendChild(a);
        newColumn = newRow.insertCell(3);
        newColumn.appendChild(document.createTextNode(jsonObj[i]['Gender']));
        newColumn = newRow.insertCell(4);
        newColumn.appendChild(document.createTextNode(jsonObj[i]['Surgery Name']));
        newColumn = newRow.insertCell(5);
        if (jsonObj[i]['Expected Date'] == null && jsonObj[i]['Expected Time'] == null) {
            newColumn.appendChild(document.createTextNode('N/A'));
        }
        else {
            newColumn.appendChild(document.createTextNode(jsonObj[i]['Expected Date'] +
            ' - ' + jsonObj[i]['Expected Time']));
        }
    }
}

function saveSurgeryProfile() {
    var shift = JSON.parse(sessionStorage.getItem('infoObj'));
    var shiftInfo = [];
    for (var sh in shift) {
        var gender = -1;
        var proStartDate = '', proEndDate = '';
        if (shift[sh]['Expected Date'] != undefined && shift[sh]['Expected Time'] != undefined) {
            var day = shift[sh]['Expected Date'];
            console.log(shift[sh]['Expected Time']);
            var start = shift[sh]['Expected Time'].split(' - ')[0];
            console.log(start);
            var end = shift[sh]['Expected Time'].split(' - ')[1];
            console.log(end);
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
            'surgeonId': Number(shift[sh]['SurgeonID']),
            'proposedStartDateTime': proStartDate,
            'proposedEndDateTime': proEndDate
        })
    }

    $.ajax({
        url: EBSMSLocal + '/api/Import/ImportSurgeryShift',
        method: 'post',
        data: JSON.stringify(shiftInfo),
        contentType: 'application/json',
        dataType: 'json',
        success: function () {
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
                success: function () {
                    sessionStorage.removeItem('infoObj');
                    sessionStorage.removeItem('supplyObj');
                    alert('Import successfully!')
                    window.location.href = 'confirmMSRequest.html';
                }
            })

        }
    })
}

function getImportDetail(id) {
    var messesage = '';
    var supplyJSON = JSON.parse(sessionStorage.getItem('supplyObj'));
    for (var i = 0; i < supplyJSON.length; i++) {
        if (supplyJSON[i]['Surgery Shift Code'] == id) {
            messesage = messesage + 'No.' + (i + 1) + supplyJSON[i]['Code']
                + ' ' + supplyJSON[i]['Name'] + '\n';
        }
    }
    console.log(messesage);
    alert(messesage);
}


//Send confirm MS
function confirmSupply() {
    $.ajax({
        url: EBSMSLocal + '/api/MedicalConfirm/ConfirmMedicalRequest',
        method: 'get',
        data: { surgeryShiftId: surgeryCode }
    })
    window.location.href = 'confirmMSRequest.html';
}


function confirmAllSupply() {
    var ids = [];
    var checkboxS = document.getElementsByClassName('checkbox');
    for (var i = 0; i < checkboxS.length; i++) {
        if (checkboxS[i].checked) {
            var value = Number(checkboxS[i].value);
            var id = {id: value};
            ids.push(id);
        }
    }
    $.ajax({
        url: EBSMSLocal + '/api/MedicalConfirm/ConfirmMedicalRequest',
        method: 'post',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(ids),
        success: function () {
            alert('success');
        }
    })
    window.location.href = 'viewShiftNoSchedule.html';
}
//Get all medical supply request
function getMedicalRequest() {
    $.ajax({
        url: EBSMSLocal + '/api/MedicalConfirm/GetAllMedicalSupplyRequest',
        method: 'get',
        success: function (data) {
            var table = document.getElementById('request').getElementsByTagName('tbody')[0];
            for (var i = 0; i < data.length; i++) {
                var id = data[i]['id'];
                var newRow = table.insertRow(table.rows.length);
                var newColumn;
                newColumn = newRow.insertCell(0);
                var checkBox = document.createElement('input');
                checkBox.setAttribute('type', 'checkbox');
                checkBox.setAttribute('value', id);
                checkBox.setAttribute('class', 'checkbox chkSurgery');
                newColumn.appendChild(checkBox);
                newColumn = newRow.insertCell(1);
                newColumn.appendChild(document.createTextNode(data[i]['patientName']));
                newColumn = newRow.insertCell(2);
                newColumn.appendChild(document.createTextNode(data[i]['surgeryName']));
                newColumn = newRow.insertCell(3);
                newColumn.appendChild(document.createTextNode(data[i]['createdDate']));
                newColumn = newRow.insertCell(4);
                var a = document.createElement('a');
                a.href = '#';
                a.appendChild(document.createTextNode('...'));
                a.setAttribute('onclick', 'getMedicalRequestDetail(" + id + ");');
                newColumn.appendChild(a);

            }
        }
    })
}

function getMedicalRequestDetail(id) {
    //get surgery code from url
    $.ajax({
        url: EBSMSLocal + '/api/MedicalConfirm/GetMedicalSupplyRequest',
        method: 'get',
        data: { surgeryShiftId: id },
        success: function (data) {
            console.log(data);
            var messesage = '';
            for (var i = 0; i < data.length; i++) {
                messesage = messesage + 'no. ' + (i + 1) + ' ' + data[i]['name'] + '.\n';
            }
            alert(messesage);
        }
    })
}

function selectAllCheckboxes(event) {
    var chkSurgery = $('.chkSurgery');
    var checked = event.checked === true;
    for (let i = 0; i < chkSurgery.length; i++) {
        chkSurgery[i].checked = checked;
    }
}