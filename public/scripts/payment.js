let sortBillingForm = document.getElementById('sortBillingForm');
document.addEventListener("DOMContentLoaded", function () {

    let sortBillingOptions = document.getElementsByClassName('sortBillingOptions');
    [...sortBillingOptions].forEach(sortBillingOption => {
        sortBillingOption.addEventListener('click', () => {
            sortBillingForm.submit();
        })
    })
})


let paymentInfo = document.getElementsByClassName('clientWiseSort');
for (let client of paymentInfo) {
    client.nextElementSibling.firstElementChild.style.display = 'none';
}
document.addEventListener("DOMContentLoaded", function () {

    let clients = document.getElementsByClassName('clientWiseSort');
    [...clients].forEach(item => {
        item.addEventListener('click', (e) => {
            let paymentInfo = document.getElementsByClassName('clientWiseSort');
            let visiblePaymentInfo = document.getElementsByClassName(e.srcElement.parentElement.id);

            if (visiblePaymentInfo[0].firstElementChild.className === 'active') {
                visiblePaymentInfo[0].firstElementChild.style.display = 'none';
                visiblePaymentInfo[0].firstElementChild.className = '';
            }
            else {
                for (let client of paymentInfo) {
                    client.nextElementSibling.firstElementChild.style.display = 'none';
                    client.nextElementSibling.firstElementChild.className = '';
                }

                visiblePaymentInfo[0].firstElementChild.style.display = '';
                visiblePaymentInfo[0].firstElementChild.className = 'active';
            }
        })
    })
})