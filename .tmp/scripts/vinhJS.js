'use strict';

function createTreatmentReport(shiftId, progressiveDisease) {
    if (!checkDrug()) {} else {
        var drugs = createDrugObj();
        $.ajax({
            url: EBSMSLocal + '/api/PostOp/CreateTreatmenReport',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                shiftId: shiftId,
                progressiveDisease: progressiveDisease,
                treatmentReportDrugs: drugs
            }),
            method: 'post'
        }).done(function (rs) {
            if (rs === true) {
                $('#treatmentModal').modal('toggle');
                loadTreatmentReport(shiftId);
            }
        }).fail(function (er) {
            return console.log(er);
        });
    }
}

function checkDrug() {
    var counts = [];
    var rs = true;
    $("body").find(".row-drug").each(function () {
        var name = this.querySelector('input[name="drug-name"]').value;
        var id = $("#drugs").find('option[value="' + name + '"]').attr('id');
        if (id === undefined) {
            rs = false;
            alert("Please choose drug in list");
            return rs;
        }
        console.log(counts[id]);
        if (counts[id] === undefined) {
            counts[id] = 1;
        } else {
            rs = false;
            alert("Duplicate drugs in your selection");
            return rs;
        }
    });
    return rs;
}

function createDrugObj() {
    var drugs = [];
    $("body").find(".row-drug").each(function () {
        var name = this.querySelector('input[name="drug-name"]').value;
        var id = $("#drugs").find('option[value="' + name + '"]').attr('id');
        var isMorning = this.querySelector('input[name="isMorning"]').value != '' ? this.querySelector('input[name="isMorning"]').value : 0;
        var isAfternoon = this.querySelector('input[name="isAfternoon"]').value != '' ? this.querySelector('input[name="isAfternoon"]').value : 0;
        var isEvening = this.querySelector('input[name="isEvening"]').value != '' ? this.querySelector('input[name="isEvening"]').value : 0;
        var isNight = this.querySelector('input[name="isNight"]').value != '' ? this.querySelector('input[name="isNight"]').value : 0;
        if (isMorning == 0 && isAfternoon == 0 && isEvening == 0 && isNight == 0 && name != '') {
            alert('Please input quantity for drug');
        } else {
            drugs.push({
                'drugId': id,
                'morningQuantity': isMorning,
                'afternoonQuantity': isAfternoon,
                'eveningQuantity': isEvening,
                'nightQuantity': isNight
            });
        }
    });
    console.log(drugs);
    if (drugs.length > 0) {
        return drugs;
    }
}

function loadTreatmentReport(shiftId) {
    var div_treatment_table = $('#div-treatment-table');
    div_treatment_table.empty();
    $.ajax({
        url: EBSMSLocal + '/api/PostOp/GetTreatmentReportByShiftId?surgeryShiftId=' + shiftId,
        method: 'get',
        success: function success(data) {
            console.table(data);
            if (data.length != 0) {
                var container = '<table class="table "><thead><tr><th>No.</th><th>Create Time</th>' + '<th>Progressive Disease</th><th>Medical Requirement</th></tr></thead>';
                for (var i = 0; i < data.length; i++) {
                    var progressiveDisease = data[i].progressiveDisease.replace(/\n/g, "<br />");
                    var medicalRequirement = '';
                    data[i].treatmentReportDrugs.forEach(function (element) {
                        medicalRequirement += element.name + ' (Morning: ' + element.morningQuantity + '| Afternoon:' + element.afternoonQuantity + '| Evening:' + element.eveningQuantity + '| Night:' + element.nightQuantity + ')</br>';
                    });
                    // var medicalRequirement = data[i].medicalRequirement.replace(/\n/g, "<br />");
                    container += '<tr><td>' + (i + 1) + '</td>';
                    container += '<td>' + data[i].dateCreated.split('T')[0] + '</td>' + '<td>' + progressiveDisease + '</td>' + '<td>' + medicalRequirement + '</td></tr>';
                }
                container += '</table>';
                div_treatment_table.append(container);
            } else {
                div_treatment_table.append('<h2>Not found no treatment</h2>');
            }
        },
        error: function error(data) {
            console.log(data);
        }
    });
}

function loadHealthcareReport(shiftId) {
    var div_healthcare_table = $('#div-healthcare-table');
    div_healthcare_table.empty();
    $.ajax({
        url: EBSMSLocal + '/api/PostOp/GetHealthCareReportBySurgeryShiftId?surgeryShiftId=' + shiftId,
        method: 'get',
        success: function success(data) {
            console.table(data);
            if (data.length != 0) {
                var container = '<table class="table "><thead><tr><th>No.</th><th>Create Time</th>' + '<th>Wound Condition</th>' + '<th>Event Content</th><th>Care Content</th></tr></thead>';
                for (var i = 0; i < data.length; i++) {
                    var progressiveDisease = data[i].eventContent.replace(/\n/g, "<br />");
                    var medicalRequirement = data[i].careContent.replace(/\n/g, "<br />");
                    var badgeWoundCondition;
                    switch (data[i].woundCondition) {
                        case 1:
                            badgeWoundCondition = '<span class="badge badge-success">Good</span>';
                            break;
                        case 2:
                            badgeWoundCondition = '<span class="badge badge-danger">Bad</span>';
                            break;
                    }
                    container += '<tr><td>' + (i + 1) + '</td>';
                    container += '<td>' + data[i].dateCreated.split('T')[0] + '</td>' + ('<td>' + badgeWoundCondition + '</td>') + '<td>' + progressiveDisease + '</td>' + '<td>' + medicalRequirement + '</td></tr>';
                }
                container += '</table>';
                div_healthcare_table.append(container);
            } else {
                div_healthcare_table.append('<h2>Not found no healthcare report</h2>');
            }
        },
        error: function error(data) {
            console.log(data);
        }
    });
}

function DrugExcelExport(event) {
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function () {
        var fileData = reader.result;
        var wb = XLSX.read(fileData, { type: 'binary' });

        wb.SheetNames.forEach(function (sheetName) {
            var rowObj = XLSX.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);

            switch (sheetName) {
                case 'Sheet2':
                    // parseImportInfo(rowObj);
                    sessionStorage.setItem('drugObj', JSON.stringify(rowObj));
                    break;
            }
        });
    };
    reader.readAsBinaryString(input.files[0]);
};

function saveDrug() {
    var drug = JSON.parse(sessionStorage.getItem('drugObj'));
    var drugInfo = [];
    for (var sh in drug) {
        drugInfo.push({
            'name': drug[sh]['Name'],
            'unit': drug[sh]['Unit']
        });
    }
    $.ajax({
        url: EBSMSLocal + '/api/Drug/ImportDrug',
        method: 'post',
        data: JSON.stringify(drugInfo),
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
                    window.location.href = 'confirmMSRequest.html';
                }
            });
        }
    });
}
//# sourceMappingURL=vinhJS.js.map
