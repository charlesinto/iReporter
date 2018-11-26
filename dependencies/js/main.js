
let slideIndex = 0;

window.onload = function(){
  closeMenuBar();
  openMenu();
}

function carousel() {
    var i;
    var x = document.getElementsByClassName("mySlides");
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none"; 
    }
    slideIndex++;
    if (slideIndex > x.length) {slideIndex = 1} 
    x[slideIndex-1].style.display = "block"; 
    
}

let closeMenuBar = () =>{
  document.getElementById('closeMenu').addEventListener('click', (e)=> {
      e.stopPropagation();
     closeNav()
  })
}
let openMenu = () => {
  document.getElementById('open-menu').addEventListener('click',(e)=>{
      e.stopPropagation();
      openNav();
  })
  document.getElementsByTagName('body')[0].addEventListener('click', ()=> {
      closeNav()
      
  })
}

let openNav = () => {
  document.getElementById("mySidenav").style.width = "250px";
}
let closeNav = () => {
  
  document.getElementById("mySidenav").style.width = "0";
      
}