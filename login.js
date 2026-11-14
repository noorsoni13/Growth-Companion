function setFormMessage(formElement, typo, message) {
    const messageElement = formElement.querySelector('.form__message');

    if(!messageElement) return;

    messageElement.textContent = message;
    messageElement.classList.remove(
        'form__message--success',
        'form__message--error'
    );
    messageElement.classList.add(`form__message--${typo}`);
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#login');
    const createAccountForm = document.querySelector('#createAccount');
    const createAccountLink = document.querySelector('#linkCreateAccount');
    const loginLink = document.querySelector('#linkLogin');
    const supabase = window.supabaseClient; 

    if (loginForm && createAccountLink && createAccountForm) {
        createAccountLink.addEventListener('click', event => {
            event.preventDefault();
            loginForm.classList.add('form__hidden');
            createAccountForm.classList.remove('form__hidden');
        });
    }

    if (createAccountForm && loginLink && loginForm) {
        loginLink.addEventListener('click', event => {
            event.preventDefault();
            loginForm.classList.remove('form__hidden');
            createAccountForm.classList.add('form__hidden');
        });
    }

    if (createAccountForm) {
        createAccountForm.addEventListener('submit', async event => {
            event.preventDefault();

            const username = document.querySelector('#signupUsername').value.trim();
            const email = document.querySelector('#signupEmail').value.trim();
            const password = document.querySelector('#signupPassword').value;
            const confirmPassword = document.querySelector('#signupConfirmPW').value;

            if (!username || !email || !password || !confirmPassword) {
                setFormMessage(
                    createAccountForm,
                    'error',
                    'Please fill in all fields.'
                );
                return;
            }

            if (password !== confirmPassword) {
                setFormMessage(createAccountForm, 'error', 'Passwords do not match.');
                return;
            }

            if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
                setFormMessage(
                    createAccountForm, 
                    'error',
                    'Username must be 3-30 characters long and can only contain letters, numbers, and underscores.'
                );
                return;
            }

            if (!supabase) {
                console.error('Supabase client was not found.');
                setFormMessage(createAccountForm, 'error', 'Account service is unavailable. Please try again later.');
                return;
            }

            setFormMessage(createAccountForm, 'success', 'Creating your account...');
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        username: username,
                    }
                }
            });

            if (error) {
                setFormMessage(createAccountForm, 'error', error.message);
                return;
            }

            if (!data.session) {
                setFormMessage(
                    createAccountForm, 'success', 
                    'Account created successfully. Check your email to verify your account before logging in.'
                );
                return;
            }

            const {error: profileError } = await supabase
            .from('profiles')
            .insert({
                id: data.user.id,
                username: username
            });

            if (profileError) {
                setFormMessage(
                    createAccountForm, 
                    'error',
                    'Your account was created, but your profile could not be saved: ' + profileError.message
                );
                return;
            }

            window.location.href = 'index.html';

        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async event => {
            event.preventDefault();

            const email = loginForm.querySelector('input[type="text"]').value.trim();
            const password = loginForm.querySelector('input[type="password"]').value;

            if (!email || !password) {
                setFormMessage(
                    loginForm,
                    'error',
                    'Please enter your email and password.'
                );
                return;
            }

            if (!supabase) {
                console.error('Supabase client was not found.');
                setFormMessage(loginForm, 'error', 'Account service is unavailable. Please try again later.');
                return;
            }

            setFormMessage(loginForm, 'success', 'Logging in...');
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                setFormMessage( loginForm, 'error', error.message);
                return;
            }

            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('username')
                .eq('id', data.user.id)
                .maybeSingle();

                if (profileError) {
                    setFormMessage(
                        loginForm,
                        'error',
                        'Your account was logged in, but your profile could not be loaded: ' + profileError.message
                    );
                    return;
                }

                let username;

                if(profile) {
                    username = profile.username;
                } else{
                    username = data.user.user_metadata?.username;

                    if (!username) {
                        setFormMessage(
                            loginForm, 
                            'error',
                            'Your account was logged in, but your username could not be found.'
                        );
                        return;
                    }

                    const { error: insertError } = await supabase
                        .from('profiles')
                        .insert({
                            id: data.user.id,
                            username: username 
                        });

                        if (insertError) {
                            setFormMessage(loginForm, 'error', insertError.message);
                            return;
                        }
                }

                localStorage.setItem('activeUsername', username);
                localStorage.setItem('isLoggedIn', 'true');

                window.location.href = 'index.html';
        });
    }       
                });
