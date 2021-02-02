document.addEventListener('readystatechange', () => {
    let transactions = document.getElementById('purchaseDetails').children;
    for (let transaction of transactions) {

        for (let data = 0; data < transaction.children.length - 3; data++)
            transaction.children[data].addEventListener('click', () => {
                window.location = `/purchase/purchase-transactions/${transaction.id}`;
            })
    }
})