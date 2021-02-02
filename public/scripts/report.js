let reportButton = document.getElementById('reportButton');

reportButton.addEventListener('click', function () {
    let vendorTable = document.getElementById('vendorTable');

    let doc = new jsPDF({
        orientation: "landscape",
    })
    doc.autoTable({
        html: `#${vendorTable.id}`,
        styles: {
            fillColor: [109, 104, 117],
            font: 'helvetica',
            fontSize: number = 7,
            halign: 'center',
            valign: 'middle',
        }
    })
    doc.save('table.pdf')

})