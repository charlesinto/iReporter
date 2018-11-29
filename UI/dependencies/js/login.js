window.onload = function(){
    setUpEvents();
}

const setUpEvents = () => {
    document.getElementById('login').addEventListener('click', () => {
        window.location = window.origin + '/pages/user_home.html'
    })
    document.getElementsByClassName('login-form')[0].style.display="none";
    document.getElementsByClassName('login')[0].style.background = "none";
    document.getElementsByClassName('login')[0].addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementsByClassName('signup-form')[0].style.display = 'none';
        document.getElementsByClassName('signup')[0].style.background = "none";
        e.target.style.background = '#fff';
        document.getElementsByClassName('login-form')[0].style.display="block";
        
    })
    document.getElementsByClassName('signup')[0].addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementsByClassName('login-form')[0].style.display = 'none';
        document.getElementsByClassName('login')[0].style.background = "none";
        e.target.style.background = '#fff';
        document.getElementsByClassName('signup-form')[0].style.display="block";
    })
}

