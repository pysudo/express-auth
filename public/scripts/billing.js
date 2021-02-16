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

const calcGrandPrice = (quantityId, gstId, priceId, grandPriceId) => {

    const quantity = document.getElementById('1-quantity').value;
    const gst = document.getElementById('1-gst').value;
    const price = document.getElementById('1-price').value;

    if (quantity || gst || price) {
        const grandPrice = quantity * price * ((gst / 100) + 1);
        document.getElementById('1-grandPrice').value = grandPrice.toFixed(2);
    }
}
const tempcalcGrandPrice = (quantityId, gstId, priceId, grandPriceId) => {

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
        grandTotal += parseFloat(b);
    }

    return parseFloat(grandTotal);
}


document.addEventListener('DOMContentLoaded', () => {

    let addItem = document.getElementById('add-item');
    addItem.addEventListener('click', () => {

        addRow();
        let invoice = document.getElementById('invoice');
        let newRow = invoice.lastElementChild.previousElementSibling;

        for (let i = 1; i < newRow.children.length; i++) {
            let newData = newRow.children[i].firstElementChild;
            oldDataIndex = parseInt(newData.id);
            newDataIndex = parseInt(newData.id) + 1;

            newData.id = newData.id.replace(oldDataIndex, newDataIndex);
        }

        newDataIds = [];
        for (let i = 1; i < newRow.children.length; i++) {
            let newDataId = newRow.children[i].firstElementChild.id;
            newDataIds.push(newDataId)

        }

        for (let i = 1; i < newRow.children.length; i++) {
            newRow.children[i].addEventListener('keyup', () => {

                tempcalcGrandPrice(newDataIds[0], newDataIds[1], newDataIds[2], newDataIds[3]);
                document.getElementById('grandTotal').lastElementChild.firstElementChild.value = calcGrandTotal();
            })
        }
    })

    '1-quantity 1-gst 1-price'.split(' ').forEach(function (e) {
        document.getElementById(e).addEventListener('keyup', () => {

            calcGrandPrice();
            document.getElementById('grandTotal').lastElementChild.firstElementChild.value = calcGrandTotal();
        })
    })
});
