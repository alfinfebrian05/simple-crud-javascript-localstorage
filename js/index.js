const formProduct = document.getElementById("formProduct");
const formInput = document.querySelectorAll("input");
const inputProductName = document
  .getElementsByTagName("input")
  .namedItem("product-name");
const selectCategory = document.querySelector("select");
const textArea = document.getElementById("productDescription");

/**
 * @params `feedbackType` : string of type feedback
 * @params `feedbackMessage` : string of feedback message
 */
/*
  function to show feedback message to user based on feedback type
 */

const showFeedback = (feedbackType, feedbackMessage) => {
  const feedbackPlaceholder = document.getElementById("feedbackPlaceholder");

  if (feedbackType === "valid") {
    feedbackPlaceholder.classList.remove("invalid-feedback");
    feedbackPlaceholder.classList.add("valid-feedback");
    feedbackPlaceholder.classList.add("d-block");
    feedbackPlaceholder.innerHTML = feedbackMessage;
  } else {
    feedbackPlaceholder.classList.remove("valid-feedback");
    feedbackPlaceholder.classList.add("invalid-feedback");
    feedbackPlaceholder.classList.add("d-block");
    feedbackPlaceholder.innerHTML = feedbackMessage;
  }
};

var arrMsg = [];
var messageAlertObject = { alertMessage: null, alertType: null };

/**
 * @params messaage : string of allert message
 * @params type : string of allert type
 */
/*
  function to get allert message and type then add to messageAlertObject.
  after object created we push object to array message
*/
const getAllertMsgType = (message, type) => {
  messageAlertObject = { alertMessage: message, alertType: type };
  arrMsg.push(messageAlertObject);
};

/**
 * @params `alertContent` : string of alert messages
 * @params `alertType` : string of alert type
 */
/*
  function to show allert message to user based on alert type
*/

const showAllert = (alertContent, alertType) => {
  const alertPlaceHolder = document.getElementById("alertPlaceholder");
  const alertDiv = document.createElement("div");
  if (alertType === "invalid") {
    alertDiv.innerHTML = `
      <div class="alert alert-${alertType} fade show" role="alert">
        ${alertContent}
      </div>
    `;
    alertPlaceHolder.append(alertDiv);
  } else {
    alertDiv.innerHTML = `
      <div class="alert alert-${alertType} fade show" role="alert">
        ${alertContent}
      </div>
    `;
    alertPlaceHolder.append(alertDiv);
  }

  setTimeout(() => {
    alertDiv.style.position = "absolute";
    alertDiv.style.right = "-10px";
    alertDiv.style.opacity = 0;
    alertDiv.style.transition = "opacity 1s linear, right 1s linear";
  }, 3000);
};

/*
  @params `product_object` = objects of product
  function to push `product_object` to array `product_items` and stored to localStorage
*/
const addProduct = (product_object) => {
  const product_items = JSON.parse(localStorage.getItem("productJSON")) || [];

  product_items.push(product_object);

  localStorage.setItem("productJSON", JSON.stringify(product_items));
};

// function to delete product based on product id
const deleteProduct = (id) => {
  const productCollection = JSON.parse(localStorage.getItem("productJSON"));

  alert(`Produk ${productCollection[id].productName} berhasil dihapus`);

  productCollection.splice(id, 1);

  localStorage.setItem("productJSON", JSON.stringify(productCollection));

  const tableProduct = document.getElementById("items");
  const tableRow = tableProduct.deleteRow(id);

  window.location.reload();
};

// function to load all product when browser loaded or refreshed
const loadProducts = () => {
  window.onload = () => {
    const productCollection = JSON.parse(localStorage.getItem("productJSON"));
    const tableProduct = document.getElementById("items");

    console.log();

    for (let i = 0; i < productCollection.length; i++) {
      const tableRow = tableProduct.insertRow();
      tableRow.innerHTML = `
        <td>${i + 1}</td>
        <td>${productCollection[i].productName}</td>
        <td>${productCollection[i].productCategory}</td>
        <td>${productCollection[i].productImage}</td>
        <td>${productCollection[i].productFreshness}</td>
        <td>${productCollection[i].productDescription}</td>
        <td>${productCollection[i].productPrice}</td>
        <td>
          <button class="btn btn-danger" onclick="deleteProduct(${
            productCollection.length - 1
          })">
              Delete Product
          </button>
      </td>
      `;
      tableProduct.append(tableRow);
    }
    console.log(productCollection);
  };
};

// listen event 'input' on product name input
inputProductName.addEventListener("input", () => {
  const inputValue = inputProductName.value;
  let countLength = 0;
  var onlyLettersRegex = /^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/;

  // count input value length
  for (let i = 0; i < inputValue.length; i++) {
    countLength += 1;
  }

  /*
    check input value length if > 25 :
      show feedback msg 'Nama produk tidak boleh lebih dari 25 huruf' and type 'invalid'
    else : 
      show feedback msg 'Nama produk tidak boleh mengandung regex dan tidak boleh kosong' and type 'invalid'
  */
  if (countLength > 25) {
    showFeedback("invalid", "Nama produk tidak boleh lebih dari 25 huruf");
  } else if (countLength < 1) {
    showFeedback("invalid", "Nama produk tidak boleh kosong");
  } else {
    inputValue.match(onlyLettersRegex)
      ? showFeedback("valid", countLength + " Karakter")
      : showFeedback(
          "invalid",
          `Nama produk tidak boleh mengandung character selain huruf, angka!`
        );
  }
});

formProduct.onsubmit = (e) => {
  e.preventDefault();
  var isInputFilled = true;

  // check each input filled or not
  formInput.forEach((input) => {
    /*
      check input type radio checked or no, 
      if type radio : 
        get input radio checked value 
      else if type beside radio : 
        check input filled or not
      else : 
        get input value
    */
    if (input.type === "radio") {
      const radioSelected = document.querySelector(
        'input[name="radio-stacked"]:checked'
      );
      const radioSelectedVal = radioSelected ? radioSelected.value : null;

      if (!radioSelected) {
        isInputFilled = false;
        getAllertMsgType(
          `Silahkan pilih product freshness : ${input.id}`,
          "danger"
        );
      }
    } else if (!input.value.trim()) {
      isInputFilled = false;
      getAllertMsgType(`Silahkan isi field ${input.name}`, "danger");
    }
  });

  // check area empty or not, if no show allert message
  if (!textArea.value) {
    getAllertMsgType(`Silahkan isi ${textArea.name}`, "danger");
    isInputFilled = false;
  }

  // check category have selected value or not, if no show allert message
  if (!selectCategory.value) {
    getAllertMsgType(`Silahkan pilih ${selectCategory.name}`, "danger");
    isInputFilled = false;
  }

  // loop array of message and displayed on top of form
  arrMsg.forEach((msg) => {
    showAllert(msg.alertMessage, msg.alertType);
  });

  // clear array of error message
  arrMsg = [];

  // check is all input filled or not
  if (isInputFilled) {
    // if filled take all value of inputs
    const productNameValue = document.querySelector(
      'input[name="product-name"]'
    ).value;

    const productCategoryValue = document.querySelector("select").value;

    const productImageValue = document
      .querySelector('input[name="image"]')
      .value.split("\\")
      .pop();

    const productFreshnessChecked = document.querySelector(
      'input[name="radio-stacked"]:checked'
    );

    const radioCheckedValue = productFreshnessChecked
      ? productFreshnessChecked.value
      : null;

    const productDescriptionValue = document.querySelector("textarea").value;

    const productPriceValue =
      "Rp " + document.querySelector('input[name="price"]').value;

    // create product object to store all input value
    const productObject = {
      productName: productNameValue,
      productCategory: productCategoryValue,
      productImage: productImageValue,
      productFreshness: radioCheckedValue,
      productDescription: productDescriptionValue,
      productPrice: productPriceValue,
    };

    // add to table and save to localStorage
    addProduct(productObject);

    alert("product submitted");
    window.location.reload();
  }
};

// load product when browser loaded / refresh
loadProducts();
