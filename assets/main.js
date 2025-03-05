//Traer los componentes del DOM a modificar
//Componentes relacionados al slider del hero
const sliderImg = document.querySelector(".sliderImg");
const slider = document.querySelector(".slider");
const dotsDisplay = document.querySelector(".dotsDisplay");
//Media query relacionado al slider para cambiar a las imagenes cuadradas
const mediaQuerySlider = window.matchMedia("(max-width:550px)");
//Componentes relacionados al menu
const menuIcon = document.querySelector("#menuIcon");
const navList = document.querySelector(".navbarList");
const blurDiv = document.querySelector(".blur");
//Componentes relacionados al carrito
const cartIcon = document.querySelector("#cartIcon");
const cart = document.querySelector(".cart");

//appState para control de estados
let appState = {
  heroSlider: {
    desktop: {
      imgs: [
        "./assets/img/slider/desktop/first.webp",
        "./assets/img/slider/desktop/second.webp",
        "./assets/img/slider/desktop/third.webp",
      ],
      currentImgIndex: 0,
      currentTimer: null,
    },
    mobile: {
      imgs: ["./assets/img/slider/mobile/first.webp"],
      currentImgIndex: 0,
      currentTimer: null,
    },
    transitionTime: 5000,
    btnsAreBlocked: false,
    isMobile: false,
  },
};

//Funcionalidad del SLIDER DEL HERO
//marcado de puntos selectores para indicar los activados y desactivados
const markDots = (selectedDotIndex) => {
  for (let dot of dotsDisplay.childNodes) {
    if (Number(dot.dataset.imgIndex) === selectedDotIndex)
      dot.classList.remove("unselectedDot");
    else dot.classList.add("unselectedDot");
  }
};

//calculo dinamico de puntos selectores en base al array de imagenes corespondiente
const spawnDots = () => {
  let sliderState;
  if (!appState.heroSlider.isMobile) sliderState = appState.heroSlider.desktop;
  else sliderState = appState.heroSlider.mobile;
  dotsDisplay.innerHTML = "";

  for (let x = 0; x < sliderState.imgs.length; x++) {
    let dot = document.createElement("div");
    dot.dataset.imgIndex = x;
    dot.classList.add("dot");
    dotsDisplay.appendChild(dot);
  }
  markDots(sliderState.currentImgIndex);
};

//cambio de slide al anterior y reanudacion del bucle de slides
const showPrevSlide = () => {
  let sliderState;
  if (!appState.heroSlider.isMobile) sliderState = appState.heroSlider.desktop;
  else sliderState = appState.heroSlider.mobile;

  sliderState.currentImgIndex =
    (sliderState.currentImgIndex - 1 + sliderState.imgs.length) %
    sliderState.imgs.length;

  sliderImg.classList.add("sliderImgMoveLeft");

  setTimeout(() => {
    sliderImg.classList.remove("sliderImgMoveLeft");
    sliderImg.src = sliderState.imgs[sliderState.currentImgIndex];
  }, 125);

  markDots(sliderState.currentImgIndex);

  sliderState.currentTimer = setTimeout(
    showNextSlide,
    appState.heroSlider.transitionTime
  );
};

//cambio de slide al siguiente y reanudacion de bucle de slides
const showNextSlide = () => {
  let sliderState;
  let currentMobileState = appState.heroSlider.isMobile;
  if (!appState.heroSlider.isMobile) sliderState = appState.heroSlider.desktop;
  else sliderState = appState.heroSlider.mobile;
  sliderState.currentImgIndex =
    (sliderState.currentImgIndex + 1 + sliderState.imgs.length) %
    sliderState.imgs.length;
  sliderImg.classList.add("sliderImgMoveRight");
  setTimeout(() => {
    sliderImg.classList.remove("sliderImgMoveRight");
    if (currentMobileState === appState.heroSlider.isMobile)
      sliderImg.src = sliderState.imgs[sliderState.currentImgIndex];
  }, 125);
  markDots(sliderState.currentImgIndex);
  sliderState.currentTimer = setTimeout(
    showNextSlide,
    appState.heroSlider.transitionTime
  );
};

//cambio al slide dado por imgIndex con la animacion dada por animation
const showThisIndexSlide = (index, animation) => {
  let sliderState;

  if (!appState.heroSlider.isMobile) {
    sliderState = appState.heroSlider.desktop;
  } else sliderState = appState.heroSlider.mobile;

  sliderState.currentImgIndex = index;

  sliderImg.classList.add(animation);
  setTimeout(() => {
    sliderImg.classList.remove(animation);
    sliderImg.src = sliderState.imgs[sliderState.currentImgIndex];
  }, 125);

  markDots(index);

  sliderState.currentTimer = setTimeout(
    showNextSlide,
    appState.heroSlider.transitionTime
  );
};

//manejo de cambios de slide provocados por el usuario
const userChangesSlide = (event) => {
  let sliderState;
  let target = event.target;
  if (!appState.heroSlider.isMobile) sliderState = appState.heroSlider.desktop;
  else sliderState = appState.heroSlider.mobile;
  //cambio de slide a traves de las flechas de avance y retroceso
  if (
    target.classList.contains("sliderBtn") &&
    !appState.heroSlider.btnsAreBlocked
  ) {
    clearTimeout(sliderState.currentTimer);
    appState.heroSlider.btnsAreBlocked = true;
    if (target.classList.contains("nextHero")) {
      showNextSlide();
    } else {
      showPrevSlide();
    }
    setTimeout(() => {
      appState.heroSlider.btnsAreBlocked = false;
    }, 375);
  } //cambio de slide a traves de los puntitos selectores
  else if (
    target.classList.contains("dot") &&
    !appState.heroSlider.btnsAreBlocked
  ) {
    let imgIndex = Number(target.dataset.imgIndex);
    clearTimeout(sliderState.currentTimer);
    appState.heroSlider.btnsAreBlocked = true;
    if (imgIndex < sliderState.currentImgIndex)
      showThisIndexSlide(imgIndex, "sliderImgMoveLeft");
    else if (imgIndex > sliderState.currentImgIndex)
      showThisIndexSlide(imgIndex, "sliderImgMoveRight");
    else
      sliderState.currentTimer = setTimeout(
        showNextSlide,
        appState.heroSlider.transitionTime
      );
    setTimeout(() => {
      appState.heroSlider.btnsAreBlocked = false;
    }, 375);
  }
};

//llamada inicial que setea el bucle de slides
const initialSliderCall = () => {
  if (!appState.heroSlider.isMobile) {
    appState.heroSlider.desktop.currentTimer = setTimeout(
      showNextSlide,
      appState.heroSlider.transitionTime
    );
  } else {
    appState.heroSlider.mobile.currentTimer = setTimeout(
      showNextSlide,
      appState.heroSlider.transitionTime
    );
  }
};

//FUNCIONES RELACIONADAS AL MENU
const handleMenuClick = () => {
  if (!cart.classList.contains("showCart")) blurDiv.classList.toggle("show");
  cart.classList.remove("showCart");
  navList.classList.toggle("showMenu");
};

const handleCartClick = () => {
  if (!navList.classList.contains("showMenu")) blurDiv.classList.toggle("show");
  navList.classList.remove("showMenu");
  cart.classList.toggle("showCart");
};

const closeMenus = () => {
  navList.classList.remove("showMenu");
  cart.classList.remove("showCart");
  blurDiv.classList.remove("show");
};

//CAMBIO DE MODO A MOBILE RESPECTO AL SLIDER DEL HERO
const indicateMobile = (event) => {
  if (event.matches) {
    //ajustes para el modo mobile, de haber un timer activo lo declaramos como timer del
    //objeto manejador slider mobile, tambien actualizamos la imagen al indice actual
    appState.heroSlider.isMobile = true;
    spawnDots();
    appState.heroSlider.mobile.currentTimer =
      appState.heroSlider.desktop.currentTimer;
    sliderImg.src =
      appState.heroSlider.mobile.imgs[
        appState.heroSlider.mobile.currentImgIndex
      ];
  } else {
    //misma logica anterior pero para desktop
    appState.heroSlider.isMobile = false;
    spawnDots();
    appState.heroSlider.desktop.currentTimer =
      appState.heroSlider.mobile.currentTimer;
    sliderImg.src =
      appState.heroSlider.desktop.imgs[
        appState.heroSlider.desktop.currentImgIndex
      ];
  }
};

//iniciaciones generales de la pagina
const init = () => {
  //Slider
  document.addEventListener("DOMContentLoaded", initialSliderCall);
  slider.addEventListener("click", userChangesSlide);
  indicateMobile(mediaQuerySlider);
  //menus-carrito
  menuIcon.addEventListener("click", handleMenuClick);
  cartIcon.addEventListener("click", handleCartClick);
  mediaQuerySlider.addEventListener("change", indicateMobile);
  blurDiv.addEventListener("click", closeMenus);
  //productos
};
console.log(data);
init();
