var deleteIdsTreatmentReportDrug = [];
var shiftId = $('#span-id').text();
//gets current server time
var start_time;
var current_time;
var get_time = function () {
    $.ajax({
        method: 'get',
        url: `${EBSMSLocal}/api/Schedule/GetServerTime`,
        success: function (data) {
            console.log(data);
            start_time = new Date(data);
            console.log(start_time);
            $('#clock').html(current_time.toLocaleTimeString());
        }
    });
}

//counts 0.25s
var cnt_time = function () {
    current_time = new Date(start_time.getTime() + 250);
    $('#clock').html(current_time.toLocaleTimeString());
    start_time = current_time;
}


setInterval(cnt_time, 250); //add 250ms to current time every 250ms
setInterval(get_time, 30250); //sync with server every 30,25 second
get_time();

function createTreatmentReport(shiftId, progressiveDisease) {
    if (!checkDrug()) {
    } else {
        var drugs = createDrugObj();
        $.ajax({
            url: EBSMSLocal + '/api/PostOp/CreateTreatmenReport',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                shiftId: shiftId,
                progressiveDisease: progressiveDisease,
                treatmentReportDrugs: drugs,
            }),
            method: 'post'
        })
            .done(rs => {
                if (rs === true) {
                    $('#treatmentModal').modal('toggle');
                    loadTreatmentReport(shiftId);
                }
            })
            .fail(er => console.log(er));
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
        var idTreatmentDrug = this.querySelector('input[name="drug-id"]').value != '' ? this.querySelector('input[name="drug-id"]').value : 0;
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
                'id' : idTreatmentDrug,
                'drugId': id,
                'morningQuantity': isMorning,
                'afternoonQuantity': isAfternoon,
                'eveningQuantity': isEvening,
                'nightQuantity': isNight
            })
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
        success: function (data) {
            console.table(data);
            if (data.length != 0) {
                var container = '<table class="table "><thead><tr><th>No.</th><th>From</th>'
                    + '<th>Progressive Disease</th><th>Medical Requirement</th><th>Action</th></tr></thead>';
                for (var i = 0; i < data.length; i++) {
                    var progressiveDisease = data[i].progressiveDisease.replace(/\n/g, "<br />");
                    var medicalRequirement = '';
                    data[i].treatmentReportDrugs.forEach(element => {
                        medicalRequirement += `${element.name} (Morning: ${element.morningQuantity}| Afternoon:${element.afternoonQuantity}| Evening:${element.eveningQuantity}| Night:${element.nightQuantity})</br>`;
                    });
                    // var medicalRequirement = data[i].medicalRequirement.replace(/\n/g, "<br />");
                    container += '<tr><td>' + (i + 1) + '</td>'
                    container += '<td>' + data[i].dateCreated.split('T')[0] + '</td>'
                        + '<td>' + progressiveDisease + '</td>'
                        + '<td>' + medicalRequirement + '</td>';
                       
                    if (data[i].isUsed === true) {
                        container += `<td><button id='edit-treatment-${data[i].id}' class='btn btn-info edit-treatment' data-id='${data[i].id}' data-toggle="modal"
                        data-target="#treatmentModal" disabled>Edit</button> <button id='delete-treatment-${data[i].id}' class='btn btn-danger delete-treatment' disabled>Delete</button></td>` + '</tr>';         
                    } else {
                        container += `<td><button id='edit-treatment-${data[i].id}' class='btn btn-info edit-treatment' data-id='${data[i].id}' data-toggle="modal"
                        data-target="#treatmentModal">Edit</button> <button id='delete-treatment-${data[i].id}' class='btn btn-danger delete-treatment'>Delete</button></td>` + '</tr>';
                    }
                
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

$(document).on("click", ".edit-treatment", function () {
    var treatmentId = $(this).data('id');
    var editForm = $("#edit-form-treatement-report");
    editForm.empty();
    $.ajax({
        url: EBSMSLocal + '/api/PostOp/GetTreatmentReportById?id=' + treatmentId,
        method: 'get',
        success: function (data) {
            console.table(data);
                editForm.append(`<div class="form-group">
                                <label for="progressiveDisease">Progressive Disease</label>
                                <textarea class="form-control" rows="5"
                                id="progressiveDisease">${data.progressiveDisease}</textarea>
                                </div>`);
                editForm.append(`<div class="form-group">
                <label for="medicalRequirement">Medical Requirement</label>
                <button class="btn btn-success add-more float-right" type="button"><i class="fa fa-plus"></i>Add more</button>
                <div class="mt-4 row">
                    <div class="col-5"></div>
                    <div class="col-1" style="text-align: center;"> Unit</div>
                    <div class="col-1" style="text-align: center;"> Morning</div>
                    <div class="col-1" style="text-align: center;"> Noon</div>
                    <div class="col-1" style="text-align: center;"> Evening</div>
                    <div class="col-1" style="text-align: center;"> Night</div>
                </div>
                <datalist id="drugs"></datalist>`);
                data.treatmentReportDrugs.forEach((element, index) => {
                    if (index === 0) {
                        editForm.append(
                            `<div class="row row-drug control-group after-add-more" style="padding-inline-start: 15px; margin-top: 10px">
                            <input type="text" class="d-none" name="drug-id" value="${element.id}" />
                                                                        <div class="easyautocomplete-wraper col-5">
                                                                        <input type="text" list="drugs" class="drug form-control has-error" name="drug-name" placeholder="Enter drug name" value="${element.name}"  onchange="updateUnit.call(this, this.value)"/>
                                                                        </div>
                                                                         <input type="text" class="drug-quantity col-1 form-control  drug-used-time" value=${element.unit} readonly/>
                                                                        <input type="number" min="0" class="col-1 drug-used-time form-control" name="isMorning" value=${element.morningQuantity}>
                                <input type="number" min="0" class="col-1 drug-used-time form-control" name="isAfternoon"  value=${element.afternoonQuantity}>
                                <input type="number" min="0" class="col-1 drug-used-time form-control" name="isEvening"  value=${element.eveningQuantity}>
                                <input type="number" min="0" class="col-1 drug-used-time form-control" name="isNight"  value=${element.nightQuantity}>
                            </div>`);
                    } else {
                        editForm.append(
                            `<div class="row row-drug control-group after-add-more" style="padding-inline-start: 15px; margin-top: 10px">
                            <input type="text" class="d-none" name="drug-id" value="${element.id}" />
                                                                        <div class="easyautocomplete-wraper col-5">
                                                                        <input type="text" list="drugs" class="drug form-control has-error" name="drug-name" placeholder="Enter drug name" value="${element.name}"  onchange="updateUnit.call(this, this.value)"/>
                                                                        </div>
                                                                         <input type="text" class="drug-quantity col-1 form-control  drug-used-time" value=${element.unit} readonly/>
                                                                        <input type="number" min="0" class="col-1 drug-used-time form-control" name="isMorning" value=${element.morningQuantity}>
                                <input type="number" min="0" class="col-1 drug-used-time form-control" name="isAfternoon"  value=${element.afternoonQuantity}>
                                <input type="number" min="0" class="col-1 drug-used-time form-control" name="isEvening"  value=${element.eveningQuantity}>
                                <input type="number" min="0" class="col-1 drug-used-time form-control" name="isNight"  value=${element.nightQuantity}>
                                                                        <div class="input-group-btn  col-1">
                                                                            <button class="btn btn-danger remove" type="button" data-id='${element.id}'><i class="fa fa-times"></i></button>
                                                                        </div>`);
                    }
                });
                editForm.append(`<button id="editTreatment" type="button" data-id='${treatmentId}' 
                                                        class="btn btn-success float-right" style="margin-top: 10px">Edit</button>`);
            },
        error: function (data) {
            console.log(data);
        }
    });
});

$(document).on("click", ".remove", function () {
    $(this).parents(".control-group").remove();
    var id = $(this).data('id');
    deleteIdsTreatmentReportDrug.push(id);
    console.log(deleteIdsTreatmentReportDrug);
}); 

$(document).on("click", "#editTreatment", function () {
    var treatmentId = $(this).data('id');
    var shiftId = $('#span-id').text();
    if (!checkDrug()) {
    } else {
        var drugs = createDrugObj();
        $.ajax({
            url: EBSMSLocal + '/api/PostOp/EditTreatmentReport',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                id : treatmentId,
                progressiveDisease: $("#progressiveDisease").val(),
                treatmentReportDrugs: drugs,
                deleteTreatmentReportId: deleteIdsTreatmentReportDrug
            }),
            method: 'post'
        })
            .done(rs => {
                if (rs === true) {
                    $('#treatmentModal').modal('toggle');
                    loadTreatmentReport(shiftId);
                }
            })
            .fail(er => console.log(er));
    }

})

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
                    + '<th>Event Content</th><th>Care Content</th><th>Nurse</th></tr></thead>';
                for (var i = 0; i < data.length; i++) {
                    var eventContent = data[i].eventContent.replace(/\n/g, "<br />");
                    var careContent = data[i].careContent.replace(/\n/g, "<br />");
                    var badgeWoundCondition;
                    switch (data[i].woundCondition) {
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
                        + '<td>' + eventContent + '</td>'
                        + '<td>' + careContent + '</td>'
                        + '<td>' + data[i].nurseName + '</td></tr>';
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
        })
    };
    reader.readAsBinaryString(input.files[0]);
};

function saveDrug() {
    var drug = JSON.parse(sessionStorage.getItem('drugObj'));
    var drugInfo = [];
    for (var sh in drug) {
        drugInfo.push({
            'name': drug[sh]['Name'],
            'unit': (drug[sh]['Unit'])
        })
    }
    $.ajax({
        url: EBSMSLocal + '/api/Drug/ImportDrug',
        method: 'post',
        data: JSON.stringify(drugInfo),
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

$(document).on("click", "#btn-new-treatment", function () {
    $("#treatmentModal").empty();
    $("#treatmentModal").append(` <div class="modal-dialog modal-lg" style="max-width: max-content;" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Treatment</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col px-0">
                                 <ul class="nav nav-tabs" id="myTab" role="tablist">
                                    <!-- <li class="nav-item">
                                        <a class="nav-link active" id="treatment-tab" data-toggle="tab"
                                            href="#treatment" role="tab" aria-controls="treatment"
                                            aria-selected="true">New Treatment Report</a>
                                    </li>  -->
                                </ul>
                                <div class="tab-content" id="myTabContent">
                                    <div class="tab-pane fade show active" id="treatment" role="tabpanel"
                                        aria-labelledby="treatment-tab">
                                        <div class="container-fluid">
                                            <div class="row">
                                                <div id="edit-form-treatement-report" class="col py-3"
                                                    style="border-left: 1px solid #dee2e6;border-bottom: 1px solid #dee2e6;border-right: 1px solid #dee2e6;">
                                                    <div class="form-group">
                                                        <label for="progressiveDisease">Progressive Disease</label>
                                                        <textarea class="form-control" rows="5"
                                                            id="progressiveDisease"></textarea>
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="medicalRequirement">Medical Requirement</label>
                                                        <button class="btn btn-success add-more float-right" type="button"><i class="fa fa-plus"></i>Add more</button>
                                                        <div class="mt-4 row">
                                                            <div class="col-5"></div>
                                                            <div class="col-1" style="text-align: center;"> Unit</div>
                                                            <div class="col-1" style="text-align: center;"> Morning</div>
                                                            <div class="col-1" style="text-align: center;"> Noon</div>
                                                            <div class="col-1" style="text-align: center;"> Evening</div>
                                                            <div class="col-1" style="text-align: center;"> Night</div>
                                                        </div>
                                                        <datalist id="drugs"></datalist>
                                                        <div class="row row-drug after-add-more" style="padding-inline-start: 15px;">
                                                            <input type="number" class="d-none" name="drug-id" value="" />
                                                            <div class="easyautocomplete-wraper form-group col-5" style="margin-bottom: 0px">
                                                                <input type="text" list="drugs" class="drug form-control has-error" name="drug-name" placeholder="Enter drug name" onchange="updateUnit.call(this, this.value)"/>
                                                            </div>
                                                            <input type="text" class="drug-quantity col-1 form-control  drug-used-time" readonly/>
                                                            <input type="number" min="0" class="col-1 drug-used-time form-control" name="isMorning">
                                                            <input type="number" min="0" class="col-1 drug-used-time form-control" name="isAfternoon">
                                                            <input type="number" min="0" class="col-1 drug-used-time form-control" name="isEvening">
                                                            <input type="number" min="0" class="col-1 drug-used-time form-control" name="isNight">
                                                        </div>
                                                    </div>
                                                    <button id="createTreatment" type="button"
                                                        class="btn btn-success float-right">Create</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <!-- <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>  -->
                </div>
            </div>
        </div>`);
})

$(document).on("click", ".add-more", function () {
                $(".after-add-more").last().after(`<div class="row row-drug control-group after-add-more" style="padding-inline-start: 15px; margin-top: 10px">
                <input type="number" class="d-none" name="drug-id" value="" />
                                                                    <div class="easyautocomplete-wraper col-5">
                                                                    <input type="text" list="drugs" class="drug form-control " name="drug-name"  placeholder="Enter drug name"  onchange="updateUnit.call(this, this.value)"/>
                                                                </div>
                                                                <input type="text" class="drug-quantity col-1 form-control  drug-used-time" readonly/>
                                                                <input type="number" min="0" class="col-1 drug-used-time form-control" name="isMorning">
                                                                <input type="number" min="0" class="col-1 drug-used-time form-control" name="isAfternoon">
                                                                <input type="number" min="0" class="col-1 drug-used-time form-control" name="isEvening">
                                                                <input type="number" min="0" class="col-1 drug-used-time form-control" name="isNight">
                                                                <div class="input-group-btn  col-1">
                                                                    <button class="btn btn-danger remove" type="button"><i class="fa fa-times"></i></button>
                                                                </div>
                                                            </div>`);
    // autocompleteDrug();
});

$(document).on("click", "#createTreatment", function () {
    // var shiftId = $(this).data('shift-id');
    var shiftId = $('#span-id').text();
    var progressiveDisease = $('#progressiveDisease').val();
    createTreatmentReport(shiftId, progressiveDisease);

});

$(document).on("click", "#assignNurse", function () {
    var nurseId =  $('#select-nurse').children("option:selected").attr('id');
    var capacity =  $('#select-nurse').children("option:selected").data('capacity');
    if (capacity >= 7) {
        alert("This nurse has taken care max patient");
    } else {
        $.ajax({
            url : EBSMSLocal + `/api/PostOp/AssignNurse?shiftId=${shiftId}&nurseId=${nurseId}`,
            method: 'get',
        }).done(rs => {
            if (rs === true) {
                $('#assignNurseModal').modal('toggle');
            }
        })
        .fail(er => console.log(er));
    }
});



function updateUnit(name){
    var id = $("#drugs").find('option[value="' + name + '"]').data('unit');
    console.log(id);
    console.log($(this).parent().siblings('.drug-quantity'));
    $(this).parent().siblings('.drug-quantity').val(id);
}

function getNurse(){
    var select = $("#select-nurse");
    select.empty();
    var nurseName = $("#assigned-nurse-name");
    nurseName.empty();
    $.ajax({
        url: EBSMSLocal + '/api/PostOp/GetNurseByShiftId?shiftId=' + shiftId,
        method: 'get',
        success: function (data) {
            nurseName.append(data.fullName);
        }
    });

    $.ajax({
        url: EBSMSLocal + '/api/PostOp/GetAllNurse',
        method: 'get',
        success: function (data) {

            $(data).each(function () {
                var options = `<option id='${this.id}' value='${this.fullName}' data-capacity='${this.capacity}' >${this.fullName}</option>`;
                select.append(options);
            });
        }
    });
}

function completeStatus(surgeryShiftId, actualEndTime) {   
    const roomPost = $('#roomPost').val();
    const bedPost = $('#bedPost').val();
    $.ajax({
        url: EBSMSLocal + '/api/Schedule/SetPostoperativeStatus?shiftId=' + surgeryShiftId + 
        '&roomPost=' + roomPost + '&bedPost=' + bedPost + '&actualEndDateTime=' + actualEndTime,
        method: 'post',
        success: function(data) {
            window.location.reload();
        }
    })
}