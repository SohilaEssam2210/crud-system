// Toggle light & dark mode
const toggle = document.getElementById("toggleDark");
const body = document.querySelector("body");
const inputs = document.querySelectorAll("input");
toggle.addEventListener("click", function () {
  this.classList.toggle("bi-moon");
  if (this.classList.toggle("bi-brightness-high-fill")) {
    body.style.background = "#222";
    body.style.color = "white";
    body.style.transition = "2s";
    inputs.forEach((input) => {
      input.style.backgroundColor = "";
    });
  } else {
    body.style.background = "#fff";
    body.style.color = "#333";
    body.style.transition = "2s";
    inputs.forEach((input) => {
      input.style.backgroundColor = "#e7e2e95e";
      input.style.color = "#000";
    });
  }
});

// variable
const price = document.getElementById("price");
const taxes = document.getElementById("taxes");
const ads = document.getElementById("ads");
const discount = document.getElementById("discount");
const total = document.getElementById("total");
const count = document.getElementById("count");
const category = document.getElementById("category");
const title = document.getElementById("title");
//btn
const create = document.getElementById("create");

let mood = "create";
let tmp;

//get total
const getTotal = () => {
  if (price.value != "") {
    const result = +price.value + +taxes.value + +ads.value - +discount.value;
    total.innerHTML = Math.round(result);
    total.style.background = "#040";
  } else {
    total.innerHTML = "";
    total.style.background = "#ac2929b3";
  }
};

//create product

let product;
if (localStorage.data != null) {
  product = JSON.parse(localStorage.data);
} else {
  product = [];
}
create.onclick = () => {
  let newProduct = {
    title: title.value.toLowerCase(),
    price: price.value,
    taxes: taxes.value,
    ads: ads.value,
    discount: discount.value,
    total: total.innerHTML,
    count: count.value,
    category: category.value.toLowerCase(),
  };

  if (mood === "create") {
    // Validate inputs only in "create" mode
    if (
      title.value !== "" &&
      category.value !== "" &&
      price.value !== "" &&
      newProduct.count <= 100
    ) {
      // Add the new product to the `product` array
      if (newProduct.count > 1) {
        for (let i = 0; i < newProduct.count; i++) {
          product.push(newProduct);
        }
      } else {
        product.push(newProduct);
      }
    } else {
      validateInputs(); // Validate inputs only when creating a new product
      return; // Exit the function if validation fails
    }
  } else {
    // Update mode: directly update the product without validation
    product[tmp] = newProduct;
    mood = "create";
    count.style.display = "block";
    create.innerHTML = "Create";
    create.style.background = "#551aa8f0";
  }

  // Save data to Local Storage
  localStorage.setItem("data", JSON.stringify(product));

  showProduct(); // Display the products
  clearData(); // Clear inputs after creation or update
};

//? Validation inputs
function validateInputs() {
  const inputs = document.querySelectorAll(".inputs input");
  console.log(inputs);
  inputs.forEach((input) => {
    if (input.value.trim() === "") {
      input.classList.add("invalid");
      create.classList.add("disabled");
      input.addEventListener("input", () => {
        if (input.value.trim() !== "") {
          input.classList.remove("invalid");
          create.classList.remove("disabled");
        }
      });
    } else {
      input.classList.remove("invalid");
      create.classList.remove("disabled");
    }
  });
}
//? clear Validation
function clearValidation() {
  const inputs = document.querySelectorAll(".inputs input");
  inputs.forEach((input) => {
    input.classList.remove("invalid");
  });
  create.classList.remove("disabled");
}

function clearData() {
  title.value = "";
  price.value = "";
  taxes.value = "";
  ads.value = "";
  discount.value = "";
  total.innerHTML = "";
  count.value = "";
  category.value = "";
}

function showProduct() {
  getTotal();
  let table = "";
  for (let i = 0; i < product.length; i++) {
    table += `
    <tr>
      <td>${i + 1}</td>
      <td>${product[i].title}</td>
      <td>${product[i].price}</td>
      <td>${product[i].taxes}</td>
      <td>${product[i].ads}</td>
      <td>${product[i].discount}</td>
      <td>${product[i].total}</td>
      <td>${product[i].category}</td>
      <td><button onclick = "updateData(${i})" id="update">Update</button></td>
      <td><button onclick = "deleteProduct(${i});" id="delete"> <i class="fa-solid fa-trash-can"></i></button></td>
    </tr>
    `;
  }
  document.getElementById("tbody").innerHTML = table;

  const deleteAllBtn = document.getElementById("deleteAll");
  clearValidation();
  if (product.length > 0) {
    deleteAllBtn.innerHTML = `<button onclick = "deleteAll()"> Delete All (${product.length}) </button>`;
  } else {
    deleteAllBtn.innerHTML = "";
  }
}
showProduct();

// delete product

function deleteProduct(i) {
  product.splice(i, 1);
  localStorage.data = JSON.stringify(product);
  showProduct();
}

function deleteAll() {
  localStorage.clear();
  product.splice(0);
  showProduct();
}

// update product

function updateData(i) {
  clearValidation();
  title.value = product[i].title;
  price.value = product[i].price;
  taxes.value = product[i].taxes;
  ads.value = product[i].ads;
  discount.value = product[i].discount;
  getTotal();
  count.style.display = "none";
  category.value = product[i].category;
  create.innerHTML = "Updated";
  create.style.background = "#369572cf";

  mood = "update";
  tmp = i;

  scroll({
    top: 0,
    behavior: "smooth",
  });
}

// search

let searchMood = "title";

function getSearchMood(id) {
  let search = document.getElementById("search");
  if (id === "searchTitle") {
    searchMood = "title";
  } else {
    searchMood = "category";
  }
  search.focus();
  search.placeholder = `Search By ${searchMood}`;
  search.value = "";
  showProduct();
  console.log(searchMood);
}

function searchData(value) {
  let table = "";
  for (let i = 0; i < product.length; i++) {
    if (searchMood == "title") {
      if (product[i].title.includes(value.toLowerCase())) {
        table += `
          <tr>
            <td>${i + 1}</td>
            <td>${product[i].title}</td>
            <td>${product[i].price}</td>
            <td>${product[i].taxes}</td>
            <td>${product[i].ads}</td>
            <td>${product[i].discount}</td>
            <td>${product[i].total}</td>
            <td>${product[i].category}</td>
            <td><button onclick = "updateData(${i})" id="update">Update</button></td>
            <td><button onclick = "deleteProduct(${i});" id="delete">delete</button></td>
          </tr>
          `;
      }
    } else {
      if (product[i].category.includes(value.toLowerCase())) {
        table += `
          <tr>
            <td>${i}</td>
            <td>${product[i].title}</td>
            <td>${product[i].price}</td>
            <td>${product[i].taxes}</td>
            <td>${product[i].ads}</td>
            <td>${product[i].discount}</td>
            <td>${product[i].total}</td>
            <td>${product[i].category}</td>
            <td><button onclick = "updateData(${i})" id="update">Update</button></td>
            <td><button onclick = "deleteProduct(${i});" id="delete">delete</button></td>
          </tr>
          `;
      }
    }
  }
  document.getElementById("tbody").innerHTML = table;
}
