function setFormMessage(formElement, type, message) {
    const messageElement = formElement.querySelector('.form__message');

    if (!messageElement) return;

    messageElement.textContent = message;
    messageElement.classList.remove('form__message--success', 'form__message--error');
    messageElement.classList.add(`form__message--${type}`);
}

function setInputError(inputElement, message) {
    inputElement.classList.add('form__input--error');
    inputElement.parentElement.querySelector('.form__input-error-message').textContent = message;
}

function clearInputError(inputElement) {
    inputElement.classList.remove('form__input--error');
    inputElement.parentElement.querySelector('.form__input-error-message').textContent = '';
}

function getActiveUser() {
    const username = localStorage.getItem('activeUsername');
    const savedUsers = JSON.parse(localStorage.getItem('users')) || [];
    return savedUsers.find(user => user.username === username);
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#login');
    const createAccountForm = document.querySelector('#createAccount');

    if (loginForm && document.querySelector('#linkCreateAccount')) {
        document.querySelector('#linkCreateAccount').addEventListener('click', e => {
            e.preventDefault();
            loginForm.classList.add('form__hidden');
            createAccountForm.classList.remove('form__hidden');
        });
    }

    if (createAccountForm && document.querySelector('#linkLogin')) {
        document.querySelector('#linkLogin').addEventListener('click', e => {
            e.preventDefault();
            loginForm.classList.remove('form__hidden');
            createAccountForm.classList.add('form__hidden');
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', e => {
            e.preventDefault();

            const usernameOrEmail = loginForm.querySelector('input[type="text"]').value.trim();
            const password = loginForm.querySelector('input[type="password"]').value;

            const savedUsers = JSON.parse(localStorage.getItem('users')) || [];

            savedUsers.forEach(user => {
                if (!user.quizResults) {
                    user.quizResults = [];
                }
                if (!user.savedCareers) {
                    user.savedCareers = [];
                }
                if (!user.exploredCareers) {
                    user.exploredCareers = [];
                }
                if (!user.achievements) {
                    user.achievements = [];
                }
            });

            const user = savedUsers.find(user => (user.username === usernameOrEmail || user.email === usernameOrEmail) && user.password === password);
            
              
            if (!user) {
                setFormMessage(loginForm, 'error', 'Invalid username/email or password.');
                return;
            }

            localStorage.setItem('users', JSON.stringify(savedUsers));
            localStorage.setItem('activeUsername', user.username);
            localStorage.setItem('isLoggedIn', 'true');

            window.location.href = 'index.html';
        });
    }

    if (createAccountForm) {
        createAccountForm.addEventListener('submit', e => {
            e.preventDefault();

            const username = document.querySelector('#signupUsername').value.trim();
            const email = document.querySelector('#signupEmail').value.trim();
            const password = document.querySelector('#signupPassword').value;

            if (!username || !email || !password) {
                setFormMessage(createAccountForm, 'error', 'Please fill in all required fields.');
                return;
            }

            if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
                setFormMessage(
                    createAccountForm, 
                    'error',
                'Username must be 3-20 characters long and contain only letters, numbers, or underscores.'
                ); 
            ]
                return;
            }

            const savedUsers = JSON.parse(localStorage.getItem('users')) || [];

            const existingUser = savedUsers.find(
                user => 
                    user.username.toLowerCase() === username.toLowerCase() || 
                    user.email.toLowerCase() === email.toLowerCase()
                    );

            if (existingUser) {
                setFormMessage(createAccountForm, 'error', 'An account with this username or email already exists.');
                return;
            }

            savedUsers.push({
                username: username,
                email: email,
                password: password,
                quizResults: [],
                savedCareers: [],
                exploredCareers: [],
                achievements: []
            });

            localStorage.setItem('users', JSON.stringify(savedUsers));
            localStorage.setItem('activeUsername', username);
            localStorage.setItem('isLoggedIn', 'true');

            window.location.href = 'index.html';
        });
    }

    document.querySelectorAll('.form__input').forEach(inputElement => {
        inputElement.addEventListener('blur', e => {
            if (e.target.id === 'signupUsername' && e.target.value.length > 0) {
                const username = e.target.value.trim();

                if(!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
                    setInputError(
                        inputElement,
                        'Username must be 3-20 characters long and contain only letters, numbers, or underscores.'
                    );
            }
        }

            
        });

        inputElement.addEventListener('input', () => {
            clearInputError(inputElement);
        });
    });
});


