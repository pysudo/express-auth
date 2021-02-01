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
