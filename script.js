// scroll animation

const faders=document.querySelectorAll(".fade");

window.addEventListener("scroll",()=>{

faders.forEach(el=>{

const top=el.getBoundingClientRect().top;

if(top<window.innerHeight-80){

el.classList.add("show");

}

});

});

// form validation

function validateForm(){

let email=document.getElementById("email").value;

if(email==""){

alert("Please enter email");

return false;

}

alert("Message sent successfully!");

return true;

}