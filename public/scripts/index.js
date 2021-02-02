window.addEventListener('load', function() {
    const logout = document.getElementById('logout');
    logout.addEventListener('click', function(e) {
        
        e.preventDefault();
    
        form = document.createElement('form');
        form.method = 'POST';
        form.action = '/user/logout';
        this.parentElement.appendChild(form);
        
        form.submit();
    });
});

document.addEventListener('readystatechange', () => {
    let transactions = document.getElementById('purchaseDetails').children;
for (let transaction of transactions) {
    transaction.addEventListener('click', () => {

        window.location = '/purchase/purchase-transactions';
    })
}
})