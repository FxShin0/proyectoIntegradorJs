//Traer los componentes del DOM a modificar
//Hero - Slider
const sliderImg = document.querySelector(".sliderImg");
const slider = document.querySelector(".slider");
const dotsDisplay = document.querySelector(".dotsDisplay");
//Media query relacionado al slider para cambiar a las imagenes cuadradas
const mediaQuerySlider = window.matchMedia("(max-width:550px)");
//Menu principal
const menuIcon = document.querySelector("#menuIcon");
const navList = document.querySelector(".navbarList");
const blurDiv = document.querySelector(".blur");
//Carrito
const cartIcon = document.querySelector("#cartIcon");
const cart = document.querySelector(".cart");
const cartProductsContainer = document.querySelector(".cartProductsContainer");
const cartMainBtns = document.querySelector(".cartMainBtns");
const emptyCartMsg = document.querySelector(".emptyCartMsg");
const totalPriceInd = document.querySelector(".totalMoney");
//Filtrado
const dynamicFiltersContainer = document.querySelector(".dynamicFilters");
const resetContainer = document.querySelector(".resetContainer");
const filtersContainer = document.querySelector(".filtersContainer");
//Productos
const productsContainer = document.querySelector(".productsContainer");
const loadBtn = document.querySelector(".loadBtn");
const showLessBtn = document.querySelector(".showLessBtn");
const noNetbookFound = document.querySelector(".noNetbookFoundCard");
const cartBubble = document.querySelector(".cartBubble");
const modalMsg = document.querySelector(".modalMsg");
//Contactanos
const submitBtn = document.querySelector(".submitBtn");

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
    pageElemCount: 6, //controla la cantidad de productos que se muestran cargados en pantalla
    totalProducts: productData.length,
    currentPageIndex: 0,
    pagedProductVec: [],
  },
  cart: null,
  prodSliderInfoVec: [], //un vector con informacion relevante para el manejo de cada slider de producto
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
    dot.classList.add("borderRadiusCircle");
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

const handleCartIconClick = () => {
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
  return `<button class="filterBtn btn borderRadius5 transition2s" data-filter-value="${filterValue.toLowerCase()}" data-filter-type="${filterType}">${filterValue}</button>`;
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
                <p class="filterName filterNameMobile">${
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

//muestra el mensaje recibido y lo quita luego de 2s
const showModal = (message) => {
  clearTimeout(appState.currentModalTimer);
  modalMsg.textContent = message;
  modalMsg.classList.remove("hideModal");
  appState.currentModalTimer = setTimeout(() => {
    modalMsg.classList.add("hideModal");
  }, 2000);
};

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

//genera la cantidad de puntos indicadores necesarios para cubrir las imagenes del producto
//en el slider
const createProductSliderDots = (amountOfDots) => {
  let dots = `<div class="productSliderDot dot borderRadiusCircle" data-index="0"></div>`;
  for (let x = 1; x < amountOfDots; x++)
    dots += `<div class="productSliderDot dot borderRadiusCircle unselectedDot" data-index="${x}"></div>`;
  return dots;
};

//creacion de la plantilla html dado un producto
const createProductTemplate = (product) => {
  return `<div class="productCard flexCenter borderRadius10 boxShadow">
                <div class="productSlider borderRadius10" data-product-id="${
                  product.id
                }">
                  <img
                    src="${product.imagenes[0]}"
                    alt="notebook ${product.marca + product.modelo}"
                    class="productImg"
                  />
                  <button class="productSliderBtn nextProductImg">&gt</button>
                  <button class="productSliderBtn prevProductImg">&lt</button>
                  <div class="productSliderDots">
                    ${createProductSliderDots(product.imagenes.length)}
                  </div>
                </div>
                <div class="cardText flexCenter">
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
                </div>
                <button class="addToCartBtn borderRadius15" data-product-id="${
                  product.id
                }">Agregar al Carrito</button>
              </div>`;
};

//renderizado de productos y verificacion de paginas
const setLoadAndLessBtns = () => {
  let { currentPageIndex, pagedProductVec } = appState.productState;
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
  if (currentPageIndex === 0) productsContainer.innerHTML = "";
  //en este caso no renderizamos, solo mostramos la card que indica que no se encontraron notebooks
  //y hacemos return
  if (pagedProductVec.length === 0) {
    noNetbookFound.classList.remove("hide");
    productsContainer.classList.add("hide");
    setLoadAndLessBtns();
    return;
  } else {
    noNetbookFound.classList.add("hide");
    productsContainer.classList.remove("hide");
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

//marca si un filtro esta seleccionado y sino le quita la marca
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

//maneja la apertura y cierre del menu de filtros en moviles
const updateFilterMenuStatus = (target) => {
  let downInd, upInd, filterOptions;
  for (let child of target.parentNode.children) {
    if (child.classList.contains("downIndicator")) downInd = child;
    else if (child.classList.contains("upIndicator")) upInd = child;
    else if (child.classList.contains("filterOptions")) filterOptions = child;
  }
  downInd.classList.toggle("hideInd");
  upInd.classList.toggle("hideInd");
  filterOptions.classList.toggle("showOptions");
};

//manejador de clicks en la caja de filtros
const handleFiltersClick = ({ target }) => {
  if (target.classList.contains("filterBtn")) {
    updateFilterBtnStatus(target);
  }
  if (
    target.classList.contains("downIndicator") ||
    target.classList.contains("upIndicator") ||
    target.classList.contains("filterNameMobile")
  ) {
    updateFilterMenuStatus(target);
  }
};

//funciones complementarias del reseteo de filtros
const resetActiveFilters = () => {
  for (let filter in appState.productState.activeFilters)
    appState.productState.activeFilters[filter] = null;
};

const resetFilterBtns = () => {
  let filterBtns = document.querySelectorAll(".filterBtn");
  for (let btn of filterBtns) btn.classList.remove("filterBtnSelected");
};

//reseteo de filtros
const generalFilterReset = () => {
  resetActiveFilters();
  resetFilterBtns();
};

//criterio de filtrado, devuelve true si se cumplen con los filtros activos
const isFilterValidProduct = (product) => {
  let { activeFilters } = appState.productState;
  if (activeFilters.estado !== null) {
    if (product.estado.trim().toLowerCase() !== activeFilters.estado)
      return false;
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

//filtra los productos y los renderiza (usando funciones)
const filterAndSearch = () => {
  let filteredProducts = productData.filter(isFilterValidProduct);
  splitProductVector(filteredProducts);
  renderProducts();
  setLoadAndLessBtns();
};

//funcion que resetea los filtros o hace una busqueda filtrando segun corresponda
const resetFilters = ({ target }) => {
  //reseteo de filtros
  if (
    target.classList.contains("resetFiltersBtn") ||
    target.classList.contains("fullCatalog")
  ) {
    generalFilterReset();
    filterAndSearch();
  }
};

//SLIDER DE PRODUCTOS

//CONTACTANOS

//marca el campo conflictivo
const markInput = (input) => {
  let baseTime = 250;
  input.classList.add("markedInput");
  setTimeout(() => {
    input.classList.remove("markedInput");
  }, baseTime);
  setTimeout(() => {
    input.classList.add("markedInput");
  }, baseTime * 2);
  setTimeout(() => {
    input.classList.remove("markedInput");
  }, baseTime * 3);
};

//verificacion de email, nos fijamos que contenga @ y un . luego del @
//ej: hola@hola no es valido, hola.com tampoco, hola@chau.com si.
const isValidEmail = (input) => {
  let email = input.value;
  if (email.indexOf("@") === -1 || email.split("@")[1].indexOf(".") === -1) {
    alert("El correo ingresado no es valido.");
    markInput(input);
    return false;
  }
  return true;
};

//verificacion de los contenidos del formulario
const sendForm = (e) => {
  e.preventDefault();
  let inputs = document.querySelectorAll(".input");
  for (let input of inputs) {
    if (input.dataset.type === "Correo") {
      if (!isValidEmail(input)) return;
    }
    if (input.value === "") {
      alert("El campo " + input.dataset.type + " no puede estar vacio.");
      markInput(input);
      return;
    }
  }
  alert("Mensaje Enviado!");
  for (let input of inputs) {
    input.value = "";
  }
};

//CARRITO
const loadCart = () => {
  let savedCart = localStorage.getItem("cart");
  if (savedCart === null) {
    appState.cart = [];
  } else {
    appState.cart = JSON.parse(savedCart);
  }
};

const saveCart = () => {
  localStorage.setItem("cart", JSON.stringify(appState.cart));
};

//incrementa la cantidad de un producto en el carrito
const incrementProductQuantity = (productId) => {
  let product = appState.cart.find((item) => {
    return item.id === productId;
  });
  if (product) {
    product.quantity++;
    return true;
  }
  return false;
};

//decrementa la cantidad de un producot en el carrito
const decrementProductQuantity = (id) => {
  let product = appState.cart.find((elem) => {
    return elem.id === id;
  });
  product.quantity--;
  if (product.quantity === 0) {
    if (window.confirm("Seguro que quieres remover el producto del carrito?")) {
      removeFromCart(id);
      window.alert("Producto quitado!");
      updateCartState();
      return true;
    } else {
      product.quantity++;
      return false;
    }
  }
  showModal("Quitado una unidad del carrito!");
  updateCartState();
  return true;
};

//si el nombre del producto supera cierto largo remplaza los 3 ultimos caracteres por
//puntos suspensivos (asi nos evitamos problemas con que se salga el contenido del div)
const normalizeName = (productName) => {
  if (productName.length > 35) return productName.slice(0, 33) + "...";
  return productName;
};

//genera la plantilla html del producto en carrito
const generateCartProTemp = (cartProduct) => {
  let { id, quantity, indPrice } = cartProduct;
  let product = productData.find((item) => {
    return item.id === id;
  });
  let { nombre, imagenes } = product;
  return `<div class="cartProCard boxShadow borderRadius5">
              <button class="removeProductBtn" data-product-id="${id}">X</button>
              <div class="cartProductImgContainer flexCenter">
                <img
                  src="${imagenes[0]}"
                  alt="notebook ${normalizeName(nombre)}"
                />
              </div>
              <div class="cartProTextContainer flexCenter">
                <div class="nameAndModel">${nombre}</div>
                <div class="proQuantity flexCenter" data-product-id="${id}">
                  <button class="quantityBtn qDown borderRadius15">-</button>
                  <p class="qIndicator">
                    Cantidad: <span class="quantity">${quantity}</span>
                  </p>
                  <button class="quantityBtn qUp borderRadius15">+</button>
                </div>
                <div class="priceContainer">
                  <p>
                    Precio: <span class="orangeSpan">$</span
                    ><span class="cPrice">${(
                      indPrice * quantity
                    ).toLocaleString()}</span>
                  </p>
                </div>
              </div>
            </div>`;
};

//renderiza el precio total del carrito
const renderTotalPrice = () => {
  let priceSpan = document.querySelector("#cartTotal");
  let total = appState.cart.reduce((acum, curItem) => {
    return acum + curItem.indPrice * curItem.quantity;
  }, 0);
  priceSpan.textContent = "$" + total.toLocaleString();
};

//quita los elementos del carrito que no deben estar disponibles si no hay productos cargados
const showEmptyCartState = () => {
  emptyCartMsg.classList.remove("hide");
  for (let btn of cartMainBtns.children) btn.classList.add("hide");
  totalPriceInd.classList.add("hide");
};

//vuelve a mostrar los elementos del carrito que deben estar disponibles al haber productos
const showNonEmptyCartState = () => {
  emptyCartMsg.classList.add("hide");
  for (let btn of cartMainBtns.children) btn.classList.remove("hide");
  totalPriceInd.classList.remove("hide");
};

//renderiza el carrito
const renderCart = () => {
  if (appState.cart.length === 0) {
    cartProductsContainer.innerHTML = "";
    showEmptyCartState();
    return;
  } else showNonEmptyCartState();
  cartProductsContainer.innerHTML = appState.cart
    .map(generateCartProTemp)
    .join("");
  renderTotalPrice();
};

const updateCartBubble = () => {
  cartBubble.textContent = String(
    appState.cart.reduce((acum, actItem) => {
      return acum + actItem.quantity;
    }, 0)
  );
};

const updateCartState = () => {
  renderCart();
  saveCart();
  updateCartBubble();
};

//agrega al carrito un producto elegido desde la seccion de productos
const addToCart = (target) => {
  let id = Number(target.dataset.productId);
  let indPrice = productData.find((elem) => {
    return elem.id === id;
  }).precio;
  if (!incrementProductQuantity(id)) {
    let newProduct = {
      id: id,
      quantity: 1,
      indPrice: indPrice,
    };
    appState.cart.push(newProduct);
    showModal("Agregado producto al carrito!");
    updateCartState();
    return;
  }
  showModal("Agregado una unidad mas al carrito!");
  updateCartState();
};

//inicializa un vector que se usara para controlar cada slider individual de los productos
//consta del id del producto, su vector de imagenes y el indice actual del mismo.
const initiateProdSliders = () => {
  appState.prodSliderInfoVec = productData.map((product) => {
    return { id: product.id, currentIndex: 0, productImgs: product.imagenes };
  });
};

//marca el punto seleccionado y desmarca los no seleccionados
const markProdSliderDots = (markIndex, dotsContainer) => {
  for (let dot of dotsContainer.children) {
    if (Number(dot.dataset.index) === markIndex)
      dot.classList.remove("unselectedDot");
    else dot.classList.add("unselectedDot");
  }
};

//cambia la imagen del slider del producto al cual se haya click
const productSliderHandle = (target) => {
  let productId = Number(target.parentNode.dataset.productId);
  let imgNode = target.parentNode.querySelector(".productImg");
  let dotsContainer = target.parentNode.querySelector(".productSliderDots");
  let productSliderInfo = appState.prodSliderInfoVec.find((prod) => {
    return prod.id === productId;
  });
  let { currentIndex, productImgs } = productSliderInfo;
  if (target.classList.contains("nextProductImg")) {
    //incrementamos el puntero y asignamos la imagen
    productSliderInfo.currentIndex =
      (currentIndex + 1 + productImgs.length) % productImgs.length;
    imgNode.src = productImgs[productSliderInfo.currentIndex];
  } else {
    //decrementamos el puntero y asignamos la imagen
    productSliderInfo.currentIndex =
      (currentIndex - 1 + productImgs.length) % productImgs.length;
    imgNode.src = productImgs[productSliderInfo.currentIndex];
  }
  markProdSliderDots(productSliderInfo.currentIndex, dotsContainer);
};

//realiza el cambio de la imagen del slider usando los puntos como input
const dotChangesProdSlider = (dot) => {
  console.log(dot);
  let dotsContainer = dot.parentNode;
  let sliderContainer = dotsContainer.parentNode;
  let productId = Number(sliderContainer.dataset.productId);
  let dotIndex = Number(dot.dataset.index);
  let imgNode = sliderContainer.querySelector(".productImg");
  let sliderInfo = appState.prodSliderInfoVec.find((prod) => {
    return prod.id === productId;
  });

  sliderInfo.currentIndex = dotIndex;
  console.log(sliderInfo);
  console.log(dotIndex);
  imgNode.src = sliderInfo.productImgs[dotIndex];
  markProdSliderDots(dotIndex, dotsContainer);
};

//maneja el click a product cards sea para agregar un producto al carrito
//o manejar el slider de la card especifica de producto
const handleProductClick = ({ target }) => {
  if (target.classList.contains("addToCartBtn")) addToCart(target);
  else if (
    target.classList.contains("nextProductImg") ||
    target.classList.contains("prevProductImg")
  )
    productSliderHandle(target);
  else if (target.classList.contains("productSliderDot"))
    dotChangesProdSlider(target);
};

//quita un producto del carrito usando su id
const removeFromCart = (id) => {
  appState.cart = appState.cart.filter((elem) => {
    return elem.id !== Number(id);
  });
  updateCartState();
};

//maneja el click de un producto en el carrito, sea para quitarlo o aumentar/disminuir su cantidad
const handleCartProductClick = ({ target }) => {
  if (target.classList.contains("removeProductBtn"))
    removeFromCart(target.dataset.productId);
  else if (target.classList.contains("qUp")) {
    incrementProductQuantity(Number(target.parentNode.dataset.productId));
    updateCartState();
    showModal("Agregado una unidad mas al carrito!");
  } else if (target.classList.contains("qDown"))
    decrementProductQuantity(Number(target.parentNode.dataset.productId));
};

//resetea el carro (normalmente luego de comprar o vaciar el mismo)
const resetCart = (confirmMsg, successMsg) => {
  if (window.confirm(confirmMsg)) {
    appState.cart = [];
    updateCartState();
    alert(successMsg);
  }
};

//resetea el carrito en ambos casos pero da los mensajes correspondientes en caso de vaciar o comprar
const handleCartBtnClick = ({ target }) => {
  if (target.classList.contains("emptyCartBtn"))
    resetCart("Seguro que quiere vaciar el carrito?", "Carrito vaciado!");
  else if (target.classList.contains("buyBtn"))
    resetCart("Desea completar su compra?", "Compra realizada!");
};

//iniciaciones generales de la pagina
const init = () => {
  //Slider
  document.addEventListener("DOMContentLoaded", initialSliderCall);
  slider.addEventListener("click", userChangesSlide);
  indicateMobile(mediaQuerySlider);
  //menus-carrito
  menuIcon.addEventListener("click", handleMenuClick);
  cartIcon.addEventListener("click", handleCartIconClick);
  mediaQuerySlider.addEventListener("change", indicateMobile);
  blurDiv.addEventListener("click", closeMenus);
  //carga-carrito
  loadCart();
  renderCart();
  updateCartBubble();
  //filtros
  createFilters();
  //productos
  initiateProdSliders();
  setInitialProductVec();
  renderProducts();
  loadBtn.addEventListener("click", loadNewPage);
  showLessBtn.addEventListener("click", showLessPages);
  noNetbookFound.addEventListener("click", resetFilters);
  //filtros-productos
  filtersContainer.addEventListener("click", handleFiltersClick);
  resetContainer.addEventListener("click", resetFilters);
  //contactanos formulario
  submitBtn.addEventListener("click", sendForm);
  //carrito-compra de productos
  productsContainer.addEventListener("click", handleProductClick);
  cartProductsContainer.addEventListener("click", handleCartProductClick);
  cartMainBtns.addEventListener("click", handleCartBtnClick);
  window.addEventListener("scroll", closeMenus);
};
init();
