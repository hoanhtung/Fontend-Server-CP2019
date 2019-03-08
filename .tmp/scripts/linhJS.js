'use strict';

function removeSessionStorage() {
    sessionStorage.removeItem('infoObj');
    sessionStorage.removeItem('supplyObj');
    sessionStorage.removeItem('surgeryName');
    javascript: window.location.href = 'importList.html';
}

function getJSONfromSession() {
    var infoJSON = JSON.parse(sessionStorage.getItem('infoObj'));
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
                    getSurgeryName(rowObj);
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
    var surName = JSON.parse(sessionStorage.getItem("surgeryName"));
    var table = document.getElementById('profile').getElementsByTagName('tbody')[0];

    var _loop = function _loop() {
        newRow = table.insertRow(table.rows.length);

        newColumn = newRow.insertCell(0);
        checkBox = document.createElement('input');

        checkBox.setAttribute('type', 'checkbox');
        checkBox.setAttribute('id', 'chk' + jsonObj[i]['Surgery Shift Code']);
        checkBox.setAttribute('class', 'checkbox chkSurgery');
        newColumn.appendChild(checkBox);

        newColumn = newRow.insertCell(1);
        newColumn.appendChild(document.createTextNode(i + 1));
        newColumn = newRow.insertCell(2);
        a = document.createElement('a');

        a.appendChild(document.createTextNode(jsonObj[i]['Patient Name']));
        a.href = '#';
        var surgeryShiftCode = jsonObj[i]['Surgery Shift Code'];
        a.addEventListener("click", function () {
            getImportDetail(surgeryShiftCode);
        });
        newColumn.appendChild(a);
        newColumn = newRow.insertCell(3);
        newColumn.appendChild(document.createTextNode(jsonObj[i]['Gender']));
        newColumn = newRow.insertCell(4);
        newColumn.appendChild(document.createTextNode(surName[i].name));
        newColumn = newRow.insertCell(5);
        if (jsonObj[i]['Expected Date'] == null && jsonObj[i]['Expected Time'] == null) {
            newColumn.appendChild(document.createTextNode('N/A'));
        } else {
            newColumn.appendChild(document.createTextNode(jsonObj[i]['Expected Date'] + ' - ' + jsonObj[i]['Expected Time']));
        }
    };

    for (var i = 0; i < jsonObj.length; i++) {
        var newRow;
        var newColumn;
        var checkBox;
        var a;

        _loop();
    }
}
function getSurgeryName(surgeryInfo) {
    var surName = [];
    for (var i = 0; i < surgeryInfo.length; i++) {
        surName.push({ 'id': Number(surgeryInfo[i]['Surgery Code']) });
    }
    $.ajax({
        url: EBSMSLocal + '/api/Import/getSurgeryNameById',
        method: 'post',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(surName),
        success: function success(data) {
            sessionStorage.setItem("surgeryName", JSON.stringify(data));
            parseImportInfo(surgeryInfo);
        }
    });
}

function saveSurgeryProfile() {
    var shift = JSON.parse(sessionStorage.getItem('infoObj'));
    var shiftInfo = [];
    for (var sh = 0; sh < shift.length; sh++) {
        var ckb = document.getElementById('chk' + shift[sh]['Surgery Shift Code']);
        if (!ckb.checked) continue;
        var gender = -1;
        var proStartDate = '',
            proEndDate = '';
        if (shift[sh]['Expected Date'] != undefined && shift[sh]['Expected Time'] != undefined) {
            var day = shift[sh]['Expected Date'];
            var start = shift[sh]['Expected Time'].split(' - ')[0];
            var end = shift[sh]['Expected Time'].split(' - ')[1];
            proStartDate = day + ' ' + start;
            proEndDate = day + ' ' + end;
        }
        if (shift[sh]['Gender'] == 'M') gender = 1;
        shiftInfo.push({
            'expectedSurgeryDuration': shift[sh]['Surgery Weight'],
            'priorityNumber': Number(shift[sh]['Priority']),
            'patientID': shift[sh]['Patient Id'],
            'patientName': shift[sh]['Patient Name'],
            'gender': gender,
            'yearOfBirth': Number(shift[sh]['Patient DOB']),
            'surgeryCatalogID': Number(shift[sh]['Surgery Code']),
            'surgeryShiftCode': shift[sh]['Surgery Shift Code'],
            'doctorId': Number(shift[sh]['Doctor ID']),
            'proposedStartDateTime': proStartDate,
            'proposedEndDateTime': proEndDate
        });
        shift.splice(sh, 1);
        sh--;
    }
    if (shiftInfo.length == 0) {
        alert("There're NOTHING to import !!!");
        return;
    }
    sessionStorage.setItem('infoObj', JSON.stringify(shift));
    $.ajax({
        url: EBSMSLocal + '/api/Import/ImportSurgeryShift',
        method: 'post',
        data: JSON.stringify(shiftInfo),
        contentType: 'application/json',
        dataType: 'json',
        success: function success() {
            var supplyList = JSON.parse(sessionStorage.getItem('supplyObj'));
            var supplyJson = [];
            for (var s = 0; s < supplyList.length; s++) {
                for (var i in shiftInfo) {
                    if (shiftInfo[i].surgeryShiftCode == supplyList[s]['Surgery Shift Code']) {
                        supplyJson.push({
                            medicalSupplyId: Number(supplyList[s]['Code']),
                            surgeryShiftCode: supplyList[s]['Surgery Shift Code'],
                            quantity: supplyList[s]['Quantity']
                        });
                        supplyList.splice(s, 1);
                        s--;
                        break;
                    }
                }
            }
            $.ajax({
                url: EBSMSLocal + '/api/Import/ImportSurgeryShiftMedicalSupply',
                method: 'post',
                data: JSON.stringify(supplyJson),
                contentType: 'application/json',
                dataType: 'json',
                success: function success() {
                    sessionStorage.removeItem('infoObj');
                    sessionStorage.removeItem('supplyObj');
                    sessionStorage.setItem('infoObj', JSON.stringify(shift));
                    sessionStorage.setItem('supplyObj', JSON.stringify(supplyList));
                    alert('Import successfully!');
                    window.location.href = 'importList.html';
                }
            });
        }
    });
}

function getImportDetail(id) {
    window.location.href = 'importDetail.html?Id=' + id;
}
function parseImportDetail() {
    var url = new URL(window.location.href);
    var id = url.searchParams.get("Id");
    var infoJSON = JSON.parse(sessionStorage.getItem('infoObj'));
    var surName = JSON.parse(sessionStorage.getItem('surgeryName'));
    for (var i = 0; i < infoJSON.length; i++) {
        if (infoJSON[i]['Surgery Shift Code'] == id) {
            document.getElementById('span-name').innerHTML = infoJSON[i]['Patient Name'];
            document.getElementById('span-gender').innerHTML = infoJSON[i]['Gender'];
            document.getElementById('span-age').innerHTML = new Date().getFullYear() - infoJSON[i]['Patient DOB'];
            document.getElementById('span-identity').innerHTML = infoJSON[i]['Patient Id'];

            document.getElementById('span-sname').innerHTML = surName[i].name;
            document.getElementById('span-weight').innerHTML = infoJSON[i]['Surgery Weight'];
            document.getElementById('span-doctor').innerHTML = infoJSON[i]['Doctor Name'];
        }
    }
    var supplyJSON = JSON.parse(sessionStorage.getItem('supplyObj'));
    var table = document.getElementById('listSupply').getElementsByTagName('tbody')[0];
    var j = 0;
    for (var i = 0; i < supplyJSON.length; i++) {
        if (supplyJSON[i]['Surgery Shift Code'] == id) {
            var newRow = table.insertRow(table.rows.length);
            var newColumn;
            newColumn = newRow.insertCell(0);
            newColumn.appendChild(document.createTextNode(++j));
            newColumn = newRow.insertCell(1);
            newColumn.appendChild(document.createTextNode(supplyJSON[i]['Name']));
            newColumn = newRow.insertCell(2);
            newColumn.appendChild(document.createTextNode(supplyJSON[i]['Quantity']));
        }
    }
}

function confirmAllSupply() {
    var ids = [];
    var checkboxS = document.getElementsByClassName('checkbox');
    for (var i = 0; i < checkboxS.length; i++) {
        if (checkboxS[i].checked) {
            var value = Number(checkboxS[i].value);
            var id = { id: value };
            ids.push(id);
        }
    }
    if (ids.length == 0) {
        alert("There're nothing to confirm!!");
        return;
    }
    $.ajax({
        url: EBSMSLocal + '/api/MedicalConfirm/ConfirmMedicalRequest',
        method: 'post',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(ids),
        success: function success() {
            makeSchedule();
            window.location.href = 'viewSchedule.html';
        }
    });
}

function getMedicalRequest() {
    $.ajax({
        url: EBSMSLocal + '/api/MedicalConfirm/GetAllMedicalSupplyRequest',
        method: 'get',
        success: function success(data) {
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

                var button = document.createElement('button');
                button.appendChild(document.createTextNode("View Detail"));
                button.setAttribute("onclick", "getMedicalRequestDetail(" + id + ");");
                button.setAttribute("id", "myBtn");
                button.setAttribute("type", "button");
                button.setAttribute("data-toggle", "modal");
                button.setAttribute("data-target", "#myModal");
                button.setAttribute("class", "btn btn-primary");
                newColumn.appendChild(button);
            }
        }
    });
}

function getMedicalRequestDetail(id) {
    $.ajax({
        url: EBSMSLocal + '/api/MedicalConfirm/GetMedicalSupplyRequest',
        method: 'get',
        data: { surgeryShiftId: id },
        success: function success(data) {
            var messesage = '';
            if (data.length == 0) {
                messesage = 'Not found medical supplies request';
            } else {
                messesage = "<table class=\"table\"><thead><tr class=\"border-0\">" + "<th class=\"border-0\">No.</th><th class=\"border-0\">Name</th><th class=\"border-0\">Quantity</th>";
                "</tr></thead>";
                for (var i = 0; i < data.length; i++) {
                    messesage = messesage + "<tr><td>" + (i + 1) + "</td><td>" + data[i]['name'] + "</td><td>" + data[i]['quantity'] + "</td></tr>";
                }
                messesage = messesage + "</table>";
            }
            document.getElementById('mheader').innerHTML = '<h4>Medical Supply Detail</h4><p>Surgery Shift Id - ' + id + '</p>';
            document.getElementById('mbody').innerHTML = messesage;
        }
    });
}

function selectAllCheckboxes(event) {
    var chkSurgery = $('.chkSurgery');
    var checked = event.checked === true;
    for (var i = 0; i < chkSurgery.length; i++) {
        chkSurgery[i].checked = checked;
    }
}

function searchSchedule() {
    var infoShift = document.getElementsByClassName('info-shift');
    document.getElementById("searchError").style.display = "none";
    for (var i = 0; i < infoShift.length; i++) {
        infoShift[i].style.display = "block";
    }
    var countResult = 0;
    var keyword = delete_mark_VI(document.getElementById('keyword').value);
    if (keyword == "") return;
    for (var i = 0; i < infoShift.length; i++) {
        var str = delete_mark_VI(infoShift[i].innerHTML);
        if (str.toLowerCase().includes(keyword.toLowerCase())) {
            countResult++;
            continue;
        }
        infoShift[i].style.display = "none";
    }
    if (countResult == 0) {
        document.getElementById("searchError").innerHTML = "No result found!!";
    } else {
        document.getElementById("searchError").innerHTML = "Found " + countResult + " results";
    }
    document.getElementById("searchError").style.display = "inline";
}
//# sourceMappingURL=linhJS.js.map
