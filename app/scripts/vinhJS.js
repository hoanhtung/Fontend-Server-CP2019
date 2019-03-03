function createTreatmentReport(shiftId, progressiveDisease, medicalRequirement) {
    $.ajax({
        url: EBSMSLocal + '/api/PostOp/CreateTreatmenReport',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            shiftId: shiftId,
            progressiveDisease: progressiveDisease,
            medicalRequirement: medicalRequirement
        }),
        method: 'post'
    })
        .done(rs => {
            console.log(rs)
            loadTreatmentReport(shiftId);
            $('#treatmentModal').modal('toggle');
        })
        .fail(er => console.log(er));
}

function loadTreatmentReport(shiftId) {
    var div_treatment_table = $('#div-treatment-table');
    div_treatment_table.empty();
    $.ajax({
        url: EBSMSLocal + '/api/PostOp/GetTreatmentReportByShiftId?surgeryShiftId=' + shiftId,
        method: 'get',
        success: function (data) {
            console.table(data);
            if (data.length != 0) {
                var container = '<table class="table "><thead><tr><th>No.</th><th>Create Time</th>'
                    + '<th>Progressive Disease</th><th>Medical Requirement</th></tr></thead>';
                for (var i = 0; i < data.length; i++) {
                    var progressiveDisease = data[i].progressiveDisease.replace(/\n/g, "<br />");
                    var medicalRequirement = data[i].medicalRequirement.replace(/\n/g, "<br />");
                    container += '<tr><td>' + (i + 1) + '</td>'
                    container += '<td>' + data[i].dateCreated.split('T')[0] + '</td>'
                        + '<td>' + progressiveDisease + '</td>'
                        + '<td>' + medicalRequirement + '</td></tr>';
                }
                container += '</table>';
                div_treatment_table.append(container);
            } else {
                div_treatment_table.append('<h2>Not found no treatment</h2>');
            }

        },
        error: function (data) {
            console.log(data);
        }
    })
}

function loadHealthcareReport(shiftId) {
    var div_healthcare_table = $('#div-healthcare-table');
    div_healthcare_table.empty();
    $.ajax({
        url: EBSMSLocal + '/api/PostOp/GetHealthCareReportBySurgeryShiftId?surgeryShiftId=' + shiftId,
        method: 'get',
        success: function (data) {
            console.table(data);
            if (data.length != 0) {
                var container = '<table class="table "><thead><tr><th>No.</th><th>Create Time</th>'
                    + '<th>Wound Condition</th>'
                    + '<th>Event Content</th><th>Care Content</th></tr></thead>';
                for (var i = 0; i < data.length; i++) {
                    var progressiveDisease = data[i].eventContent.replace(/\n/g, "<br />");
                    var medicalRequirement = data[i].careContent.replace(/\n/g, "<br />");
                    var badgeWoundCondition;
                    switch ( data[i].woundCondition) {
                        case 1:
                            badgeWoundCondition = '<span class="badge badge-success">Good</span>';
                            break;
                        case 2:
                            badgeWoundCondition = '<span class="badge badge-danger">Bad</span>';
                            break;
                    }
                    container += '<tr><td>' + (i + 1) + '</td>'
                    container += '<td>' + data[i].dateCreated.split('T')[0] + '</td>'
                        + `<td>${badgeWoundCondition}</td>`
                        + '<td>' + progressiveDisease + '</td>'
                        + '<td>' + medicalRequirement + '</td></tr>';
                }
                container += '</table>';
                div_healthcare_table.append(container);
            } else {
                div_healthcare_table.append('<h2>Not found no healthcare report</h2>');
            }

        },
        error: function (data) {
            console.log(data);
        }
    })
}