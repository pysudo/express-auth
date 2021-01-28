function changeActiveStatus(id, activeStatus, activeStatusID, rowRecords) {
    const data = document.createElement('td');
    const div = document.createElement('div');
    const input = document.createElement('input');

    div.className = "form-check form-switch";
    input.className = "form-check-input px-4 toggleStatus";
    input.id = `${activeStatusID}`;
    input.type = "checkbox";
    input.value = `${id}`;
    if (activeStatus == "on") {
        input.checked = true;
    }
    else {
        input.checked = false;
    }

    div.appendChild(input);
    data.appendChild(div);
    rowRecords.appendChild(data)
}


function createEditButton(id, rowRecords) {

    const data = document.createElement('td');
    const form = document.createElement('form');
    const button = document.createElement('button');

    button.type = "submit";
    button.className = "btn btn-primary";
    button.innerHTML = "Edit";
    form.action = `/purchase/edit/${id}`;

    form.appendChild(button);
    data.appendChild(form);
    rowRecords.appendChild(data);
}


function createDeleteMarker(id, rowRecords) {

    const data = document.createElement('td');
    const form = document.createElement('form');
    const button = document.createElement('button');

    button.type = "submit";
    button.className = "btn-close";
    form.action = `/purchase/edit/${id}/?_method=PATCH`;
    form.method = "POST";

    form.appendChild(button);
    data.appendChild(form);
    rowRecords.appendChild(data);
}


// Dynamically updates the sorted purchase details to the table accordingly  
function loadPurchaseDetails(json) {

    let tBody = document.querySelector('tBody');
    
    // Clears static purchase detail entries
    while (tBody.firstChild) {
        tBody.removeChild(tBody.firstChild);
    }

    activeStatusID = 0;
    json.forEach((entry) => {

        let rowRecords = document.createElement('tr');

        if (entry["delRec"] === true) {
            return;
        }

        for (let i in entry) {

            let data = document.createElement('td');
            if (i === "modified" || i === "activeStatus" || i === "_id" || i === "delRec") {
                continue;
            }
            let text = document.createTextNode(entry[i]);
            data.appendChild(text);
            rowRecords.appendChild(data);
        }

        let data = document.createElement('td');
        let text = document.createTextNode(entry.modified.by);
        data.appendChild(text);
        rowRecords.appendChild(data);

        changeActiveStatus(entry._id, entry.activeStatus, activeStatusID, rowRecords);
        createEditButton(entry._id, rowRecords);
        createDeleteMarker(entry._id, rowRecords);

        tBody.appendChild(rowRecords);
        activeStatusID ++;
    })
}


// Makes an AJAX request to sort purchase details either ascending or descending

let tableHeader = document.querySelectorAll('thead tr th');

for (let i = 0; i < tableHeader.length - 3; i++) {

    // Listens for user clicks on the table headers
    tableHeader[i].addEventListener('click', function () {


        if (!this.className) {
            this.className = "asc";
        }
        else if (this.className == "asc") {
            this.className = "dsc";
        }
        else if (this.className == "dsc") {
            this.className = "asc";
        }

        // Table header id and the sort order sent with the request
        let name = this.id;
        let order = this.className

        const request = new XMLHttpRequest();

        request.open("get", `/purchase/sort/${name}/${order}`);
        request.onload = () => {

            const json = JSON.parse(request.responseText);
            // Passes the sorted purchase details to be displayed
            loadPurchaseDetails(json);
        }
        request.send();

    })
}
