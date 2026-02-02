//moon hover animation
const moon = document.querySelector('.moon');
moon.addEventListener('mouseenter', function() {
    this.classList.remove('moon-unHovered');
});
moon.addEventListener('mouseleave', function() {
  this.classList.add('moon-unHovered');
  setTimeout(() => {
    this.classList.remove('moon-unHovered');
  }, 1500);
});

//click on the moon => menu pop-up
document.addEventListener('click', function(clicked) {
    if (clicked.target.id === "div-texture") alert("vi-iser la luuuuune");
});