const menuIconButton = document.getElementById('menu-icon-button');
const navLinksMenu = document.getElementById('nav-links-menu');

if (menuIconButton && navLinksMenu) {
  menuIconButton.addEventListener('click', () => {
    const isActive = navLinksMenu.classList.toggle('active');
    menuIconButton.setAttribute('aria-expanded', isActive ? 'true' : 'false');
  });
} else {
  console.warn('Menu toggle script did not find expected elements.');
}

document.addEventListener('DOMContentLoaded', () => {
  const getStartedBtn = document.querySelector('#get-started-button');
  const welcomeMessage = document.querySelector('#welcome-message');
  const personalButtons = document.getElementById('personal-buttons');

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const activeUsername = localStorage.getItem('activeUsername');

  if (isLoggedIn && activeUsername) {

    if (getStartedBtn) {
      getStartedBtn.style.display = 'none';
    }

    if (welcomeMessage){
      welcomeMessage.textContent = `Welcome back, ${activeUsername} 🌱`;
      welcomeMessage.style.display = 'block';
    }

    if(personalButtons) {
      personalButtons.style.display = 'flex';
    }
  } else{
    if (getStartedBtn) {
      getStartedBtn.style.display = 'inline-block';
    }

    if (welcomeMessage) {
      welcomeMessage.textContent = '';
      welcomeMessage.style.display = 'none';
    }
    
    if (personalButtons) {
      personalButtons.style.display = 'none';
    }
  }
});  

const UsernameInput = document.getElementById('signupUsername');
const EmailInput = document.getElementById('signupEmail');
const PasswordInput = document.getElementById('signupPassword');

function autoSaveProfile() {

  const profile = {
    name: UsernameInput ? UsernameInput.value : '',
    email: EmailInput ? EmailInput.value : '',
    password: PasswordInput ? PasswordInput.value : ''
  };

  localStorage.setItem('createAccount', JSON.stringify(profile));
}


if (UsernameInput && EmailInput && PasswordInput) {
  UsernameInput.addEventListener('input', autoSaveProfile);
  EmailInput.addEventListener('input', autoSaveProfile);
  PasswordInput.addEventListener('input', autoSaveProfile);
}

window.addEventListener('DOMContentLoaded', () => {
  const savedData = localStorage.getItem('createAccount');

  if (savedData && UsernameInput && EmailInput && PasswordInput) {
    const profile = JSON.parse(savedData);

    UsernameInput.value = profile.name || '';
    EmailInput.value = profile.email || '';
    PasswordInput.value = profile.password || '';
  }
});

function getActiveUsername() {
  const activeUsername = localStorage.getItem('activeUsername');
  const savedUsers = JSON.parse(localStorage.getItem('users')) || [];

  const user = savedUsers.find(
    user => user.username === activeUsername
  );

  if (!user) {
    return null;
  }

  user.quizResults = user.quizResults || [];
  user.savedCareers = user.savedCareers || [];
  user.exploredCareers = user.exploredCareers || [];

  return user;
}

function updateUserInLocalStorage(updatedUser) {
  const savedUsers = JSON.parse(localStorage.getItem('users')) || [];

  const userIndex = savedUsers.findIndex(
    user => user.username === updatedUser.username
  );
  
  if (userIndex === -1) {
    return;
  }

  savedUsers[userIndex] = updatedUser;

  localStorage.setItem('users', JSON.stringify(savedUsers));
}

function saveExploredCareer(career) {
  const activeUser = getActiveUsername();

  if (!activeUser) {
    console.warn('No active user found. Cannot save explored career.');
    return;
  }

  if (!activeUser.exploredCareers.includes(career)) {
    activeUser.exploredCareers.push(career);
    updateUserInLocalStorage(activeUser);
  }
}

document.querySelectorAll('.card-link[data-career]').forEach(link => {
  link.addEventListener('click', () => {
    saveExploredCareer(link.dataset.career);
  });
});

function saveQuizResult(profession, score, percentage, result) {
  const activeUser = getActiveUsername();

  if (!activeUser) {
    console.warn('No active user found. Cannot save quiz result.');
    return;
  }

  activeUser.quizResults.push({
    profession: profession,
    score: score,
    percentage: percentage,
    result: result,
    date: new Date().toISOString()
  });
  
  updateUserInLocalStorage(activeUser);
}

function updateSaveCareerButton(button){
  const career = button.dataset.career;
  const activeUser = getActiveUsername(); 

  if (!activeUser || !career) {
    return;
  }

  if (activeUser.savedCareers.includes(career)){
    button.textContent = 'Unsave Career';
    button.classList.add('career-saved');
  } else{
    button.textContent = 'Save Career';
    button.classList.remove('career-saved');
  }
}

function toggleSavedCareer(career) {
  const activeUser = getActiveUsername();

  if (!activeUser) {
    console.warn('No active user found. Cannot save career.');
    return;
  }

  const savedCareerIndex = activeUser.savedCareers.indexOf(career);

  if (savedCareerIndex === -1) {
    activeUser.savedCareers.push(career);
    if (!activeUser.exploredCareers.includes(career)) {
      activeUser.exploredCareers.push(career);
    }
  } else {
    activeUser.savedCareers.splice(savedCareerIndex, 1);
  }

  updateUserInLocalStorage(activeUser);
  displaySavedCareers();
}

document.querySelectorAll('.save-career').forEach(button => {
  updateSaveCareerButton(button);

  button.addEventListener('click', (event) =>{
    event.preventDefault();
    event.stopPropagation();

    const career = button.dataset.career;

    if(!career) {
      console.error('Save Career button is missing data-career.');
      return;
    }
    toggleSavedCareer(career);

    updateSaveCareerButton(button);
  });
});

function displaySavedCareers(){
  const savedCareerList = document.getElementById('saved-careers-list');

  if(!savedCareerList){
    return;
  }

  const activeUser = getActiveUsername();
  
  if(!activeUser || activeUser.savedCareers.length === 0) {
    savedCareerList.innerHTML = '<p>No saved careers yet.</p>';
    return;
  }

  savedCareerList.innerHTML = '';

  activeUser.savedCareers.forEach(career => {
    const careerItem = document.createElement('div');

    careerItem.className = 'saved-career-item';
    careerItem.textContent = career;

    savedCareerList.appendChild(careerItem);
  });
}

document.addEventListener('DOMContentLoaded', displaySavedCareers);

function displayExploredCareers(){
  const exploredCareersList = document.getElementById('explored-careers-list');

  if (!exploredCareersList) {
    return;
  }

  const activeUser = getActiveUsername();

  if (!activeUser || activeUser.exploredCareers.length === 0) {
    exploredCareersList.innerHTML = '<p>No explored careers yet.</p>';
    return;
  }

  exploredCareersList.innerHTML = '';

  activeUser.exploredCareers.forEach(career => {
    const careerItem = document.createElement('div');
    
    careerItem.className = 'explored-career-item';
    careerItem.textContent = career;

    exploredCareersList.appendChild(careerItem);
  });
}

document.addEventListener('DOMContentLoaded', displayExploredCareers);


let userQuestsAnswer = {};
let lastSelected = {};

function saveAnswer(questionId, value) {
  userQuestsAnswer[questionId] = value;
  saveToBrowser();
}

function saveToBrowser() {
  localStorage.setItem("pathloom-quests-answer", JSON.stringify(userQuestsAnswer));
  console.log("Current progress saved:", userQuestsAnswer);
}

function loadFromBrowser() {
  let savedData = localStorage.getItem("pathloom-quests-answer");

  if (savedData) {
    userQuestsAnswer = JSON.parse(savedData);

    for(let qId in userQuestsAnswer){
      let savedValue = userQuestsAnswer[qId];
      let radioToSelect = document.querySelector(`input[name="${qId}"][value="${savedValue}"]`);

      if (radioToSelect) {
        radioToSelect.checked = true;
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const career = document.body.dataset.career;

  if (career) {
    saveExploredCareer(career);
  }
});

function handleQuizSubmit(event, profession) {
  event.preventDefault();

  let totalScore = 0;

  for (let i = 1; i <= 10; i++) {
    const selectedAnswer = document.querySelector(
      `input[name="q${i}"]:checked`
    );

    if (selectedAnswer) {
      totalScore += Number(selectedAnswer.value);
    }
  }

  const percentage = Math.round((totalScore / 50) * 100);

  let resultMessage;

  if (totalScore >= 40) {
    resultMessage = "Excellent Match!";
  } else if (totalScore >= 30) {
    resultMessage = "Strong Match!";
  } else if (totalScore >= 20) {
    resultMessage = "Moderate Match!";
  } else {
    resultMessage = "Low Match!";
  }

  localStorage.setItem('quizScore', totalScore);
  localStorage.setItem('quizPercentage', percentage);
  localStorage.setItem('quizResult', resultMessage);
  localStorage.setItem('quizProffession', profession);

  saveQuizResult(
    profession,
    totalScore,
    percentage,
    resultMessage
  );

  console.log(totalScore);
  console.log(percentage);

  window.location.href = 'quizresult.html';
}

const softwareDevForm = document.querySelector('#relatabilityForm');

if (softwareDevForm) {
  softwareDevForm.addEventListener('submit', (event) => {
    handleQuizSubmit(event, 'Software Developer');
  });
}

const resultRole = document.querySelector('#result-role');
const resultScore = document.querySelector('#result-score');
const resultLevel = document.querySelector('#result-level');
const resultMessage = document.querySelector('#result-message');
const backToQuestsButton = document.querySelector('#back-to-quests');

if (resultRole && resultScore && resultLevel && resultMessage) {
  
  const score = localStorage.getItem('quizScore');
  const percentage = localStorage.getItem('quizPercentage');
  const result = localStorage.getItem('quizResult');
  const profession = localStorage.getItem('quizProffession');
   
  if (score && percentage && result) {
    resultRole.textContent = `${profession.toUpperCase()} RESULT`;
    resultScore.textContent = `${score} / 50 (${percentage}%)`;
    resultLevel.textContent = 'result';

    if (result === 'Excellent Match!') {
      resultMessage.textContent = 'Your answers shows a very strong alignment with skills commonly associated with software developemnt.';
    } else if (result === 'Strong Match!') {
      resultMessage.textContent = 'Your answers shows a strong alignment with several skils commonly associated with software developemnt.';
    } else if (result === 'Moderate Match!') {
      resultMessage.textContent = 'Your answers shows some alignment with software development, but there may be others areas you would enjoy exploring too.';
    } else {
      resultMessage.textContent = 'Your answers suggest that software development may not currenlty be one of your strongest career matches.';
    }

  }
}

if (backToQuestsButton) {
  backToQuestsButton.addEventListener('click', () => {
    window.location.href = 'questsworld.html';
  });
}

const singerForm = document.querySelector('#relatabilityForm');

if (singerForm && document.querySelector('#selectedRoleHeading')?.textContent.includes('SINGER')) {
  singerForm.addEventListener('submit', (event) => {
    handleQuizSubmit(event, 'Singer');
  });
}


const neurosurgeonForm = document.querySelector('#relatabilityForm');

if (neurosurgeonForm && document.querySelector('#selectedRoleHeading') ?.textContent.includes('NEUROSURGEON')) {
  neurosurgeonForm.addEventListener('submit', (event) => {
    event.preventDefault();

    let totalScore = 0;

    for (let i = 1; i <= 10; i++) {
      const selectedAnswer = document.querySelector(
        `input[name="q${i}"]:checked`
      );
      if (selectedAnswer) {
        totalScore += Number(selectedAnswer.value);
      }
    }
    const percentage = Math.round((totalScore / 50) * 100);

    let resultMessage;

    if (totalScore >= 40) {
      resultMessage = "Excellent Match!";
    } else if (totalScore >= 30) {
      resultMessage = "Strong Match!";
    } else if (totalScore >= 20) {
      resultMessage = "Moderate Match!";
    } else {
      resultMessage = "Low Match!";
    }

    localStorage.setItem('quizScore', totalScore);
    localStorage.setItem('quizPercentage', percentage);
    localStorage.setItem('quizResult', resultMessage);
    localStorage.setItem('quizProffession', 'Neurosurgeon');

    saveQuizResult(
      'Neurosurgeon',
      totalScore,
      percentage,
      resultMessage
    );
    
    console.log(totalScore);
    console.log(percentage);

    window.location.href = 'quizresult.html';
  });
}


const tattooArtistForm = document.querySelector('#relatabilityForm');

if (tattooArtistForm && document.querySelector('#selectedRoleHeading') ?.textContent.includes('TATTOO ARTIST')) {
  tattooArtistForm.addEventListener('submit', (event) => {
    event.preventDefault();

    let totalScore = 0;

    for (let i = 1; i <= 10; i++) {
      const selectedAnswer = document.querySelector(
        `input[name="q${i}"]:checked`
      );
      if (selectedAnswer) {
        totalScore += Number(selectedAnswer.value);
      }
    }
    const percentage = Math.round((totalScore / 50) * 100);

    let resultMessage;

    if (totalScore >= 40) {
      resultMessage = "Excellent Match!";
    } else if (totalScore >= 30) {
      resultMessage = "Strong Match!";
    } else if (totalScore >= 20) {
      resultMessage = "Moderate Match!";
    } else {
      resultMessage = "Low Match!";
    }

    localStorage.setItem('quizScore', totalScore);
    localStorage.setItem('quizPercentage', percentage);
    localStorage.setItem('quizResult', resultMessage);
    localStorage.setItem('quizProffession', 'Tattoo Artist');

    saveQuizResult(
      'Tattoo Artist',
      totalScore,
      percentage,
      resultMessage
    );
    
    console.log(totalScore);
    console.log(percentage);

    window.location.href = 'quizresult.html';
  });
}

document.addEventListener ('DOMContentLoaded', async () => {
  const settingsUsername = document.getElementById('settings-username');
  const settingsPassword = document.getElementById('settings-password');
  const saveProfileButton = document.getElementById('save-profile-button');
  const settingsMessage = document.getElementById('settings-message');

  if (!settingsUsername || !settingsPassword || !saveProfileButton || !settingsMessage) {
    return;
  }

  const supabase = window.supabaseClient;
  
  if(!supabase) {
    settingsMessage.textContent = 'Unable to connect to the database.';
    return;
  }

  const { data: { user }, error: userError } =
  await supabase.auth.getUser();

  if (userError || !user) {
    settingsMessage.textContent = 'Please log in to view your profile.';
    saveProfileButton.disabled = true;
    return;
  }

  const { data: profile, error: profileError } =  await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .maybeSingle();

    if (profileError) {
      settingsMessage.textContent = 'Could not load your profile.';
      return;
    }

    const currentUsername = 
    profile?.username || user.user_metadata?.username || '';

    settingsUsername.value = currentUsername;

  saveProfileButton.addEventListener('click', async() => {
    const newUsername = settingsUsername.value.trim();
    const newPassword = settingsPassword.value;

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(newUsername)) {
      settingsMessage.textContent = 'Username must be 3-20 characters long and can only contain letters, numbers, and underscores.';
      return;
    }

    if (newPassword && newPassword.length < 6) {
      settingsMessage.textContent = 'Password must be at least 6 characters long.';
      return;
    }

    saveProfileButton.disabled = true;

    if (newUsername !== currentUsername) {
      const {error: usernameError} = await supabase
        .from('profiles')
        .update({ username: newUsername })
        .eq('id', user.id);
        
      if (usernameError) {
        settingsMessage.textContent = 'Could not update username. It might already be taken.';
        saveProfileButton.disabled = false;
        return;
      }

      await supabase.auth.updateUser({ 
        data: { username: newUsername }
      });

      localStorage.setItem('activeUsername', newUsername);
    }

    if (newPassword) {
      const { error: passwordError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (passwordError) {
        settingsMessage.textContent = 'Could not update password.' +  passwordError.message;
        saveProfileButton.disabled = false;
        return;
      }

      settingsPassword.value = '';
    }

    settingsMessage.textContent = 'Profile updated successfully!';

    saveProfileButton.disabled = false;
  });
});

    