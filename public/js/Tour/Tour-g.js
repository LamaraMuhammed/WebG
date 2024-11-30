const profileImg = document.getElementById("profileImg");
const nav = document.getElementById("nav");

profileImg.src = "/WebG/image/self";
nav.addEventListener('click', cl => window.location.href = "Home");

const selectors = document.querySelectorAll(".selectors");
selectors.forEach((child, index) => {
  child.addEventListener('click', cl => {
    index === 0 ? removeActiveClass(1, 2, 3, 4) :
    index === 1 ? removeActiveClass(0, 2, 3, 4) :
    index === 2 ? removeActiveClass(0, 1, 3, 4) :
    index === 3 ? removeActiveClass(0, 1, 2, 4) :
    index === 4 ? removeActiveClass(0, 1, 2, 3) : false;

    child.classList.add('active');

    function removeActiveClass(a, b, c, d) {
      selectors[a].classList.remove("active");
      selectors[b].classList.remove("active");
      selectors[c].classList.remove("active");
      selectors[d].classList.remove("active");
    }
  });
});

window.addEventListener("load", ld => boardContainer.computedStyleMap.opacity = 1);