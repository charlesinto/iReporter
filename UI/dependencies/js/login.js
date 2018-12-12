window.onload = function(){
    setUpEvents();
}

const setUpEvents = () => {
    document.getElementById('login').addEventListener('click', () => {
        window.location = window.origin + '/pages/user_home.html'
    })
    document.getElementsByClassName('signup-form')[0].style.display="none";
    document.getElementsByClassName('signup')[0].style.background = "none";
    document.getElementsByClassName('signup')[0].addEventListener('click', (e) => {
        e.stopPropagation();
        e.target.classList.toggle('active');
        document.getElementsByClassName('login-form')[0].style.display = 'none';
       document.getElementsByClassName('login')[0].classList.toggle('active');
        e.target.style.background = '#fff';
        document.getElementsByClassName('signup-form')[0].style.display="block";
        
    })
    document.getElementsByClassName('login')[0].addEventListener('click', (e) => {
        e.stopPropagation();
        e.target.classList.toggle('active');
        document.getElementsByClassName('signup-form')[0].style.display = 'none';
        document.getElementsByClassName('signup')[0].classList.toggle('active');
        e.target.style.background = '#fff';
        document.getElementsByClassName('login-form')[0].style.display="block";
    })
}

