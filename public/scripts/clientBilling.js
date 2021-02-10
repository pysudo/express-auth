document.addEventListener('readystatechange', () => {
    let clientDetails = document.getElementById('clientDetails').children;
    for (let clientDetail of clientDetails) {

        for (let data = 0; data < clientDetail.children.length - 2; data++)
        clientDetail.children[data].addEventListener('click', () => {
                window.location = `/client/billing/${clientDetail.id}`;
            })
    }
})