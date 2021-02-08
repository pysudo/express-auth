document.addEventListener('readystatechange', () => {
    let purchaseDetails = document.getElementById('purchaseDetails').children;
    for (let purchaseDetail of purchaseDetails) {

        for (let data = 0; data < purchaseDetail.children.length - 3; data++)
        purchaseDetail.children[data].addEventListener('click', () => {
                window.location = `/purchase/purchase-transactions/${purchaseDetail.id}`;
            })
    }
})