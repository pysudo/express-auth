document.addEventListener('readystatechange', () => {
    let toggleStatusList = document.getElementsByClassName('toggleStatus');

    for (let toggleStatus of toggleStatusList) {
        toggleStatus.addEventListener('click', function () {
            console.log("hello");

            let isChecked = toggleStatus.checked;

            if (isChecked) {
                isChecked = "on";
            }
            else {
                isChecked = "off";
            }
            const path = `/purchase/statuschange/${isChecked}/${toggleStatus.value}`
            const config = {
                method: 'PATCH'
            };
            fetch(path, config);
        })
    }
});
