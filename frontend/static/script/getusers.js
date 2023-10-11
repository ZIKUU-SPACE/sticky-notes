function GetUsers() {
    return new Promise((resolve, reject) => {
        fetch('/api/users', {
            method: 'get',
            headers: { "accept": "application/json", "authorization": `bearer ${localStorage.getItem('token')}` }
        })
            .then(response => response.json())
            .then(json => {
                resolve(json.users);
            })
            .catch(err => {
                reject(err);
            });
    });
}