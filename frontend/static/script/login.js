function Login(email, password) {
    return new Promise((resolve, reject) => {
        const data = {
            'email': email,
            'password': password
        };
        const headers = { 
            'Content-Type': 'application/json',
            'accept': 'application/json'
        };
        
        fetch('/auth/login', {
            headers: headers,
            body: JSON.stringify(data),
            method: 'post'
        })
        .then(response => response.json())
        .then(json => {
            resolve(json);
        })
        .catch(err => reject(err));
    });
}