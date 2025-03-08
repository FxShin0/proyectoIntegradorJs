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
//Componentes relacionados al filtrado
const dynamicFiltersContainer = document.querySelector(".dynamicFilters");
const resetContainer = document.querySelector(".resetContainer");
const filtersContainer = document.querySelector(".filtersContainer");
//Componentes relacionados a los productos
const productsContainer = document.querySelector(".productsContainer");
const loadBtn = document.querySelector(".loadBtn");
const showLessBtn = document.querySelector(".showLessBtn");

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
  productState: {
    activeFilters: {
      estado: null,
      marca: null,
      almacenamiento: null,
      ram: null,
    },
    pageElemCount: 9, //controla la cantidad de productos que se muestran cargados en pantalla
    totalProducts: productData.length,
    currentPageIndex: 0,
    pagedProductVec: [],
    priceMinToMax: true,
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

//FILTROS

//funcion que agrega un valor a un array, funciona como un set, agrega si no existe el valor
// de a paso se normaliza el valor quitando espacios y poniendo como mayusculas el primer char
const addToArray = (array, value) => {
  let normalizedValue = value.trim();
  normalizedValue =
    normalizedValue.charAt(0).toUpperCase() + normalizedValue.slice(1);
  if (!array.includes(normalizedValue)) array.push(normalizedValue);
};

//funcion que carga los valores de almacenamiento de las notebook, algunas tienen
//mas de un tipo de medio de almacenamiento, vienen separado por guion asi que se los
//debe tratar de manera diferente, sino apareceria como filtro algo como "256gb ssd - 1tb hdd"
//cuando en realidad son dos medios diferentes
const loadStorageValues = (array, storages) => {
  //de tener mas de un metodo de almacenamiento vendran separados por un guion
  let allStorages = storages.split("-");
  for (let storage of allStorages) addToArray(array, storage);
};

const createFilterBtnTemplate = (filterValue, filterType) => {
  return `<button class="filterBtn btn" data-filter-value="${filterValue.toLowerCase()}" data-filter-type="${filterType}">${filterValue}</button>`;
};

//criterio de ordenamiento en caso de que querramos ordenar almacenamientos
const storageSort = (storage1, storage2) => {
  storage1 = storage1.toLowerCase();
  storage2 = storage2.toLowerCase();
  if (storage1.includes("gb") && storage2.includes("gb")) {
    storage1 = parseFloat(storage1.split("g")[0]);
    storage2 = parseFloat(storage2.split("g")[0]);
    return storage1 - storage2;
  } else if (storage1.includes("tb") && storage2.includes("tb")) {
    storage1 = parseFloat(storage1.split("t")[0]);
    storage2 = parseFloat(storage2.split("t")[0]);
    return storage1 - storage2;
  } else if (storage1.includes("tb") && !storage2.includes("tb")) {
    return 1;
  } else {
    return -1;
  }
};

//criterio de ordenamiento para los distintos valores
const sortFilterValues = (filters, filterName) => {
  switch (filterName) {
    case "marca":
      return filters.sort(); //orden alfabetico para marcas
    case "almacenamiento":
      return filters.sort(storageSort); //criterio especial para almacenamientos
    case "ram":
      return filters.sort(storageSort);
  }
};

//creacion dinamica de filtros en base a los productos disponibles
const createFilters = () => {
  let injectHTML = "";
  let allFilterValues = { marca: [], almacenamiento: [], ram: [] };
  //cargar los posibles valores de cada filtro
  for (let product of productData) {
    let { marca, almacenamiento, ram } = product;
    addToArray(allFilterValues.marca, marca);
    //almacenamiento requiere un tratamiento especial porque puede ser que tenga tanto ssd como hdd
    loadStorageValues(allFilterValues.almacenamiento, almacenamiento);
    addToArray(allFilterValues.ram, ram);
  }

  //generar los filtros correspondientes
  for (let filterName in allFilterValues) {
    //ordenamos el array para que quede en orden alfabetico o en el caso de memoria
    //queden de menor a mayor valor
    allFilterValues[filterName] = sortFilterValues(
      allFilterValues[filterName],
      filterName
    );
    let filterOptionsHTML = allFilterValues[filterName]
      .map((filterValue) => {
        return createFilterBtnTemplate(filterValue, filterName);
      })
      .join("");
    injectHTML += `<div class="filter">
                  <p class="downIndicator">+</p>
                  <p class="upIndicator hideInd">-</p>
                  <p class="filterName">${
                    filterName.charAt(0).toUpperCase() + filterName.slice(1)
                  }</p>
                  <div class="filterOptions">
                    ${filterOptionsHTML}
                  </div>
                </div>`;
  }
  //inyectar el html en el div de filtros dinamicos
  dynamicFiltersContainer.innerHTML += injectHTML;
};

//productos

//criterio de ordenamiento para precios (menor a mayor)
const byPrice = (product1, product2) => {
  return product1.precio - product2.precio;
};

//inicializacion del vector de paginas de productos
const splitProductVector = (productVec) => {
  let { pageElemCount } = appState.productState;
  let newVec = [];
  let sortedProductData = productVec.sort(byPrice);
  for (let x = 0; x < sortedProductData.length; x += pageElemCount)
    newVec.push(productVec.slice(x, x + pageElemCount));
  appState.productState.pagedProductVec = newVec;
  appState.productState.currentPageIndex = 0;
};
const setInitialProductVec = () => {
  splitProductVector(productData);
};

//creacion de la plantilla html dado un producto
const createProductTemplate = (product) => {
  return `<div class="productCard boxShadow">
                <img
                  src="${product.imagenes[0]}"
                  alt="notebook ${product.marca + product.modelo}"
                  class="productImg"
                />
                <div class="cardText">
                  <p class="brand">${product.marca}</p>
                  <p class="model">${product.modelo}</p>
                  <p class="cpu">${product.procesador}</p>
                  <p class="os">${product.os}</p>
                  <p class="condition">${product.estado}</p>
                  <p class="ramAndStorage">
                    ${product.ram} <span class="divider">|</span> ${
    product.almacenamiento
  }
                  </p>
                  <p class="precio">${
                    "$" + product.precio.toLocaleString("es-AR")
                  }</p>
                  <button class="addToCardBtn">Agregar al Carrito</button>
                </div>
              </div>`;
};

//renderizado de productos y verificacion de paginas
const setLoadAndLessBtns = () => {
  let { currentPageIndex, pagedProductVec } = appState.productState;
  console.log("En set queda indice: " + currentPageIndex);
  //ocultar ambos botones en caso de que no haya productos que mostrar
  if (pagedProductVec.length === 0) {
    loadBtn.classList.add("hide");
    showLessBtn.classList.add("hide");
    //ocultar el boton de mostrar menos si aun no se llego a la ultima pagina
    //mostrar el boton de cargar mas
  } else if (currentPageIndex < pagedProductVec.length - 1) {
    loadBtn.classList.remove("hide");
    showLessBtn.classList.add("hide");
    //ocultar el boton de cargar mas en caso de estar en la ultima pagina
    //mostrar el boton de mostrar menos
  } else if (currentPageIndex == pagedProductVec.length - 1) {
    loadBtn.classList.add("hide");
    if (pagedProductVec.length !== 1) showLessBtn.classList.remove("hide");
    else showLessBtn.classList.add("hide");
  }
};

const renderProducts = () => {
  let { pagedProductVec, currentPageIndex } = appState.productState;
  setLoadAndLessBtns();
  console.log("recibido: ");
  console.log(pagedProductVec);
  console.log("indice actual : " + currentPageIndex);
  if (currentPageIndex === 0) productsContainer.innerHTML = "";
  if (pagedProductVec.length === 0) {
    productsContainer.innerHTML =
      "Oops! No tenemos una laptop con esas caracteristicas :/";
    setLoadAndLessBtns();
    return;
  }
  if (currentPageIndex === 0) productsContainer.innerHTML = "";
  productsContainer.innerHTML += pagedProductVec[currentPageIndex]
    .map(createProductTemplate)
    .join("");
};

//funcion que carga una nueva pagina
const loadNewPage = () => {
  appState.productState.currentPageIndex++;
  renderProducts();
};

//funcion que sube al principio de la lista de productos a la vez que
//vuelve a la pagina 0
const showLessPages = () => {
  appState.productState.currentPageIndex = 0;
  renderProducts();
  productsContainer.scrollIntoView();
};

const updateSelectedFilter = (target) => {
  for (let child of target.parentNode.children) {
    if (child.dataset.filterValue !== target.dataset.filterValue)
      child.classList.remove("filterBtnSelected");
    else child.classList.add("filterBtnSelected");
  }
};

const updateFilterBtnStatus = (target) => {
  let { activeFilters } = appState.productState;
  let { filterValue, filterType } = target.dataset;
  if (target.classList.contains("filterBtnSelected")) {
    activeFilters[filterType] = null;
    target.classList.remove("filterBtnSelected");
  } else {
    activeFilters[filterType] = filterValue.trim().toLowerCase();
    updateSelectedFilter(target);
  }
  filterAndSearch();
};

const handleFiltersClick = ({ target }) => {
  if (target.classList.contains("filterBtn")) {
    updateFilterBtnStatus(target);
  }
};

const resetActiveFilters = () => {
  for (let filter in appState.productState.activeFilters)
    appState.productState.activeFilters[filter] = null;
};

const resetFilterBtns = () => {
  let filterBtns = document.querySelectorAll(".filterBtn");
  for (let btn of filterBtns) btn.classList.remove("filterBtnSelected");
};

const generalFilterReset = () => {
  resetActiveFilters();
  resetFilterBtns();
};

const isFilterValidProduct = (product) => {
  let { activeFilters } = appState.productState;
  console.log("evaluando");
  console.log(activeFilters);
  console.log("contra");
  console.log(product);
  if (activeFilters.estado !== null) {
    console.log(
      "producto: " +
        product.estado.trim().toLowerCase() +
        " filtro: " +
        activeFilters.estado
    );
    if (product.estado.trim().toLowerCase() !== activeFilters.estado)
      return false;
    console.log("Este fue pasado");
  }
  if (activeFilters.marca !== null) {
    if (product.marca.trim().toLowerCase() !== activeFilters.marca)
      return false;
  }
  if (activeFilters.almacenamiento !== null) {
    if (
      !product.almacenamiento
        .trim()
        .toLowerCase()
        .includes(activeFilters.almacenamiento)
    )
      return false;
  }
  if (activeFilters.ram !== null) {
    if (product.ram.trim().toLowerCase() !== activeFilters.ram) return false;
  }
  return true;
};

const filterAndSearch = () => {
  let filteredProducts = productData.filter(isFilterValidProduct);
  splitProductVector(filteredProducts);
  renderProducts();
  setLoadAndLessBtns();
};

//funcion que resetea los filtros o hace una busqueda filtrando segun corresponda
const resetFilters = ({ target }) => {
  //reseteo de filtros
  if (target.classList.contains("resetFiltersBtn")) {
    generalFilterReset();
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
  //filtros
  createFilters();
  //productos
  setInitialProductVec();
  renderProducts();
  loadBtn.addEventListener("click", loadNewPage);
  showLessBtn.addEventListener("click", showLessPages);
  //filtros-productos
  filtersContainer.addEventListener("click", handleFiltersClick);
  resetContainer.addEventListener("click", resetFilters);
};
init();
