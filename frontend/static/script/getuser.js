function GetUser() {
    return new Promise((resolve, reject) => {
        fetch('/api/user', {
            method: 'get',
            headers: { "accept": "application/json", "authorization": `bearer ${localStorage.getItem('token')}` }
        })
            .then(response => response.json())
            .then(json => {
                resolve(json.user);
            })
            .catch(err => {
                reject(err);
            });
    });
}