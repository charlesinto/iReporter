window.onload = function(){
    closeMenuBar();
    openMenu();
}

let closeMenuBar = () =>{
    document.getElementById('closeMenu').addEventListener('click', (e)=> {
        e.stopPropagation();
       closeNav();
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
    document.getElementById("mySidenav").style.width = "300px";
  }
  let closeNav = () => {
    
    document.getElementById("mySidenav").style.width = "0";
        
  }