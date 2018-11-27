window.onload = function(){
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

// $(".login-form").hide();
// $(".login").css("background", "none");

// $(".login").click(function(){
//   $(".signup-form").hide();
//   $(".login-form").show();
//   $(".signup").css("background", "none");
//   $(".login").css("background", "#fff");
// });

// $(".signup").click(function(){
//   $(".signup-form").show();
//   $(".login-form").hide();
//   $(".login").css("background", "none");
//   $(".signup").css("background", "#fff");
// });

// $(".btn").click(function(){
//   $(".input").val("");
// });