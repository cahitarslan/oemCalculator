// ! Storage Controller
const StorageController = (function () {
    return {
        storeProduct: function (product) {
            let products;

            if (localStorage.getItem("products") === null) {
                products = [];
                products.push(product);
            } else {
                products = JSON.parse(localStorage.getItem("products"));
                products.push(product);
            }
            localStorage.setItem("products", JSON.stringify(products));
        },

        getProducts: function () {
            let products;
            if (localStorage.getItem("products") === null) {
                products = [];
            } else {
                products = JSON.parse(localStorage.getItem("products"));
            }
            return products;
        },

        updateProduct: function (product) {
            let products = JSON.parse(localStorage.getItem("products"));

            products.forEach(function (prd, index) {
                if (product.id == prd.id) {
                    products.splice(index, 1, product);
                }
            });
            localStorage.setItem("products", JSON.stringify(products));
        },
        deleteProduct: function (id) {
            let products = JSON.parse(localStorage.getItem("products"));

            products.forEach(function (prd, index) {
                if (id == prd.id) {
                    products.splice(index, 1);
                }
            });
            localStorage.setItem("products", JSON.stringify(products));
        },
    };
})();

// ! Product Controller
const ProductController = (function () {
    const Product = function (id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    };

    const data = {
        products: StorageController.getProducts(),
        selectedProduct: null,
        totalPrice: 0,
    };

    return {
        getProducts: function () {
            return data.products;
        },
        getData: function () {
            return data;
        },
        addProduct: function (name, price) {
            let id;

            if (data.products.length > 0) {
                id = data.products[data.products.length - 1].id + 1;
            } else {
                id = 1;
            }

            const newProduct = new Product(id, name, parseFloat(price));
            data.products.push(newProduct);
            return newProduct;
        },

        updateProduct: function (name, price) {
            let product = null;

            data.products.forEach(function (prd) {
                if (prd.id == data.selectedProduct.id) {
                    prd.name = name;
                    prd.price = parseFloat(price);
                    product = prd;
                }
            });

            return product;
        },

        deleteProduct: function (product) {
            data.products.forEach(function (prd, index) {
                if (prd.id == product.id) {
                    data.products.splice(index, 1);
                }
            });
        },

        getProductById: function (id) {
            let product = null;
            data.products.forEach(function (prd) {
                if (prd.id == id) {
                    product = prd;
                }
            });
            return product;
        },

        setCurrentProduct: function (product) {
            data.selectedProduct = product;
        },

        getCurrentProduct: function (product) {
            return data.selectedProduct;
        },

        getTotal: function () {
            let total = 0;

            data.products.forEach(function (item) {
                total += item.price;
            });

            data.totalPrice = total;
            return data.totalPrice;
        },
    };
})();

// ! UI Controller
const UIController = (function () {
    const Selectors = {
        productList: "#item-list",
        productListItems: "#item-list tr",
        addButton: "#addBtn",
        updateButton: "#updateBtn",
        deleteButton: "#deleteBtn",
        cancelButton: "#cancelBtn",
        addButton: "#addBtn",
        productName: "#productName",
        productPrice: "#productPrice",
        productCard: "#productCard",
        totalTl: "#totalTl",
        totalDolar: "#totalDolar",
    };
    return {
        createProductList: function (products) {
            let html = "";

            products.forEach((product) => {
                html += `
                    <tr>
                        <td>${product.id}</td>
                        <td>${product.name}</td>
                        <td>${product.price} $</td>
                        <td class="text-right">
                            <i class="fas fa-edit edit-product"> </i>
                        </td>
                    </tr>`;
            });

            document.querySelector(Selectors.productList).innerHTML = html;
        },
        getSelectors: function () {
            return Selectors;
        },

        addProduct: function (product) {
            document.querySelector(Selectors.productCard).style.display = "block";
            var item = `
                    <tr>
                        <td>${product.id}</td>
                        <td>${product.name}</td>
                        <td>${product.price} $</td>
                        <td class="text-right">
                            <i class="fas fa-edit edit-product"> </i>
                        </td>
                    </tr>`;

            document.querySelector(Selectors.productList).innerHTML += item;
        },
        deleteProduct: function () {
            let items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(function (item) {
                if (item.classList.contains("bg-primary")) {
                    item.remove();
                }
            });
        },
        updateProduct: function (prd) {
            let updatedItem = null;

            let items = document.querySelectorAll(Selectors.productListItems);

            items.forEach(function (item) {
                if (item.classList.contains("bg-primary")) {
                    item.children[1].textContent = prd.name;
                    item.children[2].textContent = prd.price + " $";
                    updatedItem = item;
                }
            });

            return updatedItem;
        },

        clearInputs: function () {
            document.querySelector(Selectors.productName).value = "";
            document.querySelector(Selectors.productPrice).value = "";
        },

        clearPrimary: function () {
            const items = document.querySelectorAll(Selectors.productListItems);

            items.forEach(function (item) {
                if (item.classList.contains("bg-primary")) {
                    item.classList.remove("bg-primary");
                    item.classList.remove("text-white");
                }
            });
        },

        hideCard: function () {
            document.querySelector(Selectors.productCard).style.display = "none";
        },
        showTotal: function (total) {
            document.querySelector(Selectors.totalDolar).textContent = total + " $";
            document.querySelector(Selectors.totalTl).textContent = total * 13.09 + " TL";
        },
        addProductToForm: function () {
            const selectedProduct = ProductController.getCurrentProduct();
            document.querySelector(Selectors.productName).value = selectedProduct.name;
            document.querySelector(Selectors.productPrice).value = selectedProduct.price;
        },

        addingState: function (item) {
            UIController.clearPrimary();
            UIController.clearInputs();
            document.querySelector(Selectors.addButton).style.display = "inline";
            document.querySelector(Selectors.updateButton).style.display = "none";
            document.querySelector(Selectors.deleteButton).style.display = "none";
            document.querySelector(Selectors.cancelButton).style.display = "none";
        },
        editingState: function (tr) {
            UIController.clearPrimary();

            tr.classList.add("bg-primary");
            tr.classList.add("text-white");
            document.querySelector(Selectors.addButton).style.display = "none";
            document.querySelector(Selectors.updateButton).style.display = "inline";
            document.querySelector(Selectors.deleteButton).style.display = "inline";
            document.querySelector(Selectors.cancelButton).style.display = "inline";
        },
    };
})();

// ! App Controller
const App = (function (ProductCtrl, UICtrl, StorageCtrl) {
    const UISelectors = UICtrl.getSelectors();

    // Load Event Listeners
    const loadEventListeners = function () {
        // *** Add product event
        document.querySelector(UISelectors.addButton).addEventListener("click", productAddSubmit);

        // *** Edit product click
        document.querySelector(UISelectors.productList).addEventListener("click", productEditClick);

        // *** Edit product submit
        document.querySelector(UISelectors.updateButton).addEventListener("click", editProductSubmit);

        // *** Cancel button click
        document.querySelector(UISelectors.cancelButton).addEventListener("click", cancelUpdate);

        document.querySelector(UISelectors.deleteButton).addEventListener("click", deleteProductSubmit);
    };

    const productAddSubmit = function (event) {
        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;

        if (productName !== "" && productPrice !== "") {
            //* Add product
            const newProduct = ProductCtrl.addProduct(productName, productPrice);

            //* Add item to list
            UICtrl.addProduct(newProduct);

            //* Add product to LS
            StorageCtrl.storeProduct(newProduct);

            //* Get total
            const total = ProductCtrl.getTotal();

            //* Show total
            UICtrl.showTotal(total);

            //* Clear inputs
            UICtrl.clearInputs();
        }

        console.log(productName, productPrice);

        event.preventDefault();
    };

    const productEditClick = function (event) {
        if (event.target.classList.contains("edit-product")) {
            const id = event.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent;

            // Get selected product
            const product = ProductCtrl.getProductById(id);

            // Set current product
            ProductCtrl.setCurrentProduct(product);

            // Add product UI
            UICtrl.addProductToForm();

            UICtrl.editingState(event.target.parentNode.parentNode);
        }

        event.preventDefault();
    };

    const editProductSubmit = function (event) {
        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;

        if (productName !== "" && productPrice !== "") {
            // ** update product
            const updatedProduct = ProductCtrl.updateProduct(productName, productPrice);

            // ** update ui
            UICtrl.updateProduct(updatedProduct);

            //* update storage
            StorageCtrl.updateProduct(updatedProduct);

            //* Get total
            const total = ProductCtrl.getTotal();

            //* Show total
            UICtrl.showTotal(total);

            UICtrl.addingState();
        }

        event.preventDefault();
    };

    const cancelUpdate = function (event) {
        UICtrl.addingState();
        UICtrl.clearPrimary();

        event.preventDefault();
    };

    const deleteProductSubmit = function (event) {
        // get selected product
        const selectedProduct = ProductCtrl.getCurrentProduct();

        // delete product
        ProductCtrl.deleteProduct(selectedProduct);

        //* delete from storage
        StorageCtrl.deleteProduct(selectedProduct.id);

        // delete ui
        UICtrl.deleteProduct(selectedProduct);

        //* Get total
        const total = ProductCtrl.getTotal();

        //* Show total
        UICtrl.showTotal(total);

        UICtrl.addingState();

        if (total == 0) {
            UICtrl.hideCard();
        }

        event.preventDefault();
    };

    return {
        init: function () {
            UICtrl.addingState();

            const products = ProductCtrl.getProducts();

            if (products.length == 0) {
                UICtrl.hideCard();
            } else {
                UICtrl.createProductList(products);
            }

            //* Get total
            const total = ProductCtrl.getTotal();

            //* Show total
            UICtrl.showTotal(total);

            // Load Event Listeners
            loadEventListeners();
        },
    };
})(ProductController, UIController, StorageController);

App.init();
