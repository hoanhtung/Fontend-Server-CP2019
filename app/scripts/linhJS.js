var EBSMSLocal = 'https://localhost:44372';

var infoJON, suppyJSON;
function getJSONfromSeesion() {
    infoJON = JSON.parse(sessionStorage.getItem("infoObj"));
    suppyJSON = JSON.parse(sessionStorage.getItem("supplyObj"));
    parseInfo(infoJON);
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
                case "SurgeryProfile":
                    parseInfo(rowObj);
                    infoJON = rowObj;
                    sessionStorage.setItem('infoObj', JSON.stringify(rowObj));
                    break;
                case "MedicalSupply":
                    suppyJSON = rowObj;
                    sessionStorage.setItem('supplyObj', JSON.stringify(rowObj));
                    break;
            }
        })
    };
    reader.readAsBinaryString(input.files[0]);
};
function parseInfo(jsonObj) {
    console.log(jsonObj);
    var table = document.getElementById('profile').getElementsByTagName('tbody')[0];
    for (var i = 0; i < jsonObj.length; i++) {
        var newRow = table.insertRow(table.rows.length);
        var newColumn;

        newColumn = newRow.insertCell(0);
        var a = document.createElement('a');
        a.appendChild(document.createTextNode(jsonObj[i]["Patient Name"]));
        a.href = "importDetail.html?no=" + jsonObj[i]["Surgery Shift Code"];
        newColumn.appendChild(a);


        newColumn = newRow.insertCell(1);
        newColumn.appendChild(document.createTextNode(jsonObj[i]["Gender"]));
        newColumn = newRow.insertCell(2);
        newColumn.appendChild(document.createTextNode(jsonObj[i]["Medical Record"]));
        newColumn = newRow.insertCell(3);
        newColumn.appendChild(document.createTextNode(jsonObj[i]["Surgery Name"]));
        newColumn = newRow.insertCell(4);
        newColumn.appendChild(document.createTextNode(jsonObj[i]["Surgeon Name"]));
        newColumn = newRow.insertCell(5);
        newColumn.appendChild(document.createTextNode(jsonObj[i]["Expected Date"] +
            " - " + jsonObj[i]["Expected Time"]));
        newColumn = newRow.insertCell(6);
        newColumn.appendChild(document.createTextNode(jsonObj[i]["Surgery Weight"]));
    }
}
// done


function saveSurgeryProfile() {
    alert("Surgery Profile Saved");
            //TODO: call insert API
    $.ajax({
        url: EBSMSLocal + "/api/PostOp/GetAllMedicalSupplyRequest",
        method: "get",
        success: function(data) {
            console.log(data[0].id);
        }
    })
    sessionStorage.removeItem("infoObj");
    sessionStorage.removeItem("supplyObj");
    // window.location.replace("importList.html");
};




var no;
var supplyJSON;
var infoJSON;
function deleteRecord() {
    supplyJSON = JSON.parse(sessionStorage.getItem("supplyObj"));
    infoJSON = JSON.parse(sessionStorage.getItem("infoObj"));
    for (var i = 0; i < infoJSON.length; i++) {
        if (infoJSON[i]["Surgery Shift Code"] == no) {
            delete infoJSON[i];
            break;
        }
    }
    for (var i = 0; i < supplyJSON.length; i++) {
        if (supplyJSON[i]["Surgery Shift Code"] == no) {
            delete supplyJSON[i];
            i--;
        }
    }
    sessionStorage.removeItem("infoJSON");
    sessionStorage.removeItem("supplyJSON");
    sessionStorage.setItem('infoObj', JSON.stringify(infoJSON));
    sessionStorage.setItem('supplyJSON', JSON.stringify(supplyJSON));
    javascript: window.location.href = 'importList.html';
}

function parseJSON(jsonObj) {
    var table = document.getElementById('listSupply').getElementsByTagName('tbody')[0];
    var j = 0;
    for (var i = 0; i < supplyJSON.length; i++) {
        if (supplyJSON[i]["Surgery Shift Code"] == no) {
            var newRow = table.insertRow(table.rows.length);
            var newColumn;

            newColumn = newRow.insertCell(0);
            newColumn.appendChild(document.createTextNode(++j));
            newColumn = newRow.insertCell(1);
            newColumn.appendChild(document.createTextNode(supplyJSON[i]["Code"]));
            newColumn = newRow.insertCell(2);
            newColumn.appendChild(document.createTextNode(supplyJSON[i]["Name"]));
            newColumn = newRow.insertCell(3);
            newColumn.appendChild(document.createTextNode(supplyJSON[i]["Quantity"]));
        }
    }
}

function getImportDetail() {
    //get surgery code from url
    var url_string = window.location.href;
    var url = new URL(url_string);
    no = url.searchParams.get("no");

    supplyJSON = JSON.parse(sessionStorage.getItem("supplyObj"));
    parseJSON(supplyJSON);
}

function confirmSupply() {
    //TODO: send api with surgery code = surgeryCode;

    javascript: window.location.href = 'confirmMSRequest.html';
}