const addRow = () => {

    let invoice = document.getElementById('invoice');
    let newRow = invoice.lastElementChild.previousElementSibling.cloneNode(true);

    newRowIndex = parseInt(newRow.id) + 1;
    newRow.id = `${newRowIndex}-item`;
    for (let i = 0; i < newRow.children.length; i++) {
        newRow.children[i].firstElementChild.value = "";
    }
    invoice.lastElementChild.previousElementSibling.after(newRow);
}

// Calculates the grand price for first row only
const calcGrandPrice = (quantityId, priceId, gstId, grandPriceId) => {

    const quantity = document.getElementById(quantityId).value;
    const price = document.getElementById(priceId).value;
    const gst = document.getElementById(gstId).value;

    if (quantity || gst || price) {
        const grandPrice = quantity * price * ((gst / 100) + 1);
        document.getElementById(grandPriceId).value = grandPrice.toFixed(2);
    }
}

// Calculates the grand price for rest of the row
const tempcalcGrandPrice = (quantityId, priceId, gstId, grandPriceId) => {

    const quantity = document.getElementById(quantityId).value;
    const gst = document.getElementById(gstId).value;
    const price = document.getElementById(priceId).value;

    if (quantity || gst || price) {

        const grandPrice = quantity * price * ((gst / 100) + 1);
        document.getElementById(grandPriceId).value = grandPrice.toFixed(2);
    }
}

const calcGrandTotal = () => {

    a = document.getElementById('invoice');
    let grandTotal = 0.0;
    for (let ele = 0; ele < a.children.length - 1; ele++) {
        b = a.children[ele].lastElementChild.firstElementChild.value;

        // If any single 'Grand Prices' field is left empty, NaN can't be parsed
        // Parses 0 instead of empty string ('')
        if (b === "") {
            b = 0;
        }
        grandTotal += parseFloat(b);
    }

    return parseFloat(grandTotal).toFixed(2);
}


document.addEventListener('DOMContentLoaded', () => {

    let addItem = document.getElementById('add-item');
    addItem.addEventListener('click', () => {

        addRow();
        let invoice = document.getElementById('invoice');
        let newRow = invoice.lastElementChild.previousElementSibling;

        for (let i = 2; i < newRow.children.length; i++) {
            let newData = newRow.children[i].firstElementChild;

            oldDataIndex = parseInt(newData.id);
            newDataIndex = parseInt(newData.id) + 1;

            newData.id = newData.id.replace(oldDataIndex, newDataIndex);
        }

        newDataIds = [];
        for (let i = 2; i < newRow.children.length; i++) {
            let newDataId = newRow.children[i].firstElementChild.id;

            newDataIds.push(newDataId)

        }

        let quantityID = newRow.children[2].firstElementChild.id
        let priceID = newRow.children[3].firstElementChild.id
        let gsID = newRow.children[4].firstElementChild.id
        let grandPriceID = newRow.children[5].firstElementChild.id
        for (let i = 2; i < newRow.children.length; i++) {

            `${quantityID} ${priceID} ${gsID}`.split(' ').forEach(function (e) {
                document.getElementById(e).addEventListener('keyup', () => {

                    tempcalcGrandPrice(quantityID, priceID, gsID, grandPriceID);
                    document.getElementById('grandTotal').lastElementChild.firstElementChild.value = calcGrandTotal();
                })
            })
        }
    })

    a = document.getElementById('invoice');
    for (let i = 0; i < a.children.length - 1; i++) {

        let quantityID = a.children[i].children[2].firstElementChild.id;
        let priceID = a.children[i].children[3].firstElementChild.id;
        let gsID = a.children[i].children[4].firstElementChild.id;
        let grandPriceID = a.children[i].children[5].firstElementChild.id;
        
        `${quantityID} ${priceID} ${gsID}`.split(' ').forEach(function (e) {
            document.getElementById(e).addEventListener('keyup', () => {

                calcGrandPrice(quantityID, priceID, gsID, grandPriceID);
                document.getElementById('grandTotal').lastElementChild.firstElementChild.value = calcGrandTotal();
            })
        })
    }
});
