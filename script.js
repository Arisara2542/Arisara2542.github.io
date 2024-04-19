//cart open close
var cartIcon = document.querySelector("#cart-icon");
var cart = document.querySelector(".cart");
var closeCart = document.querySelector('#close-cart');
//open cart
cartIcon.onclick = () =>{
    cart.classList.add("active");
};
//close cart
closeCart.onclick = () =>{
    cart.classList.remove("active");
};

// Update total
function updateTotal() {
    var cartBoxes = document.getElementsByClassName("cart-box");
    var total = 0;
    for (var i = 0; i < cartBoxes.length; i++) {
        var cartBox = cartBoxes[i];
        var priceElement = cartBox.getElementsByClassName("cart-price")[0];
        var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
        if (priceElement && quantityElement) {
            var price = parseFloat(priceElement.innerText.replace("$", ""));
            var quantity = parseInt(quantityElement.value);
            total += price * quantity;
        }
    }
    document.getElementsByClassName("total-price")[0].innerText = '$' + total.toFixed(2);
    localStorage.setItem("cartTotal", total);
}

// Making function
function ready() {
    // Remove Item from cart
    var removeCartButton = document.getElementsByClassName("cart-remove");
    for (var i = 0; i < removeCartButton.length; i++) {
        var Removebutton = removeCartButton[i];
        Removebutton.addEventListener('click', removeCartItem);
    }
    // Quantity change
    var quantityInput = document.getElementsByClassName("cart-quantity");
    for (var i = 0; i < quantityInput.length; i++) {
        var input = quantityInput[i];
        input.addEventListener('change', quantityChange);
    }
    // Add to cart
    var addCart = document.getElementsByClassName("add-cart")
    for (var i = 0; i < addCart.length; i++) {
        var button = addCart[i];
        button.addEventListener('click', addcartClicked);
    }
    loadCartItem ();
}

// Update total when document is ready
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

function removeCartItem (event){
    var buttonClicked = event.target;
    var cartItem = buttonClicked.parentElement;
    cartItem.remove();
    updateTotal();
    saveCartItem();
    updateCartIcon();
}
//Quantity change
function quantityChange(event){
    var input = event.target;
    if(isNaN(input.value) || input.value <= 0){
        input.value =1;
    }
    updateTotal();
    saveCartItem();
    updateCartIcon();
}
//Add cart by click button cart
function addcartClicked(event){
    var button = event.target;
    var shopProducts = button.parentElement;
    var title = shopProducts.getElementsByClassName("product-title")[0].innerText;
    var price = shopProducts.getElementsByClassName("price")[0].innerText;
    var img = shopProducts.getElementsByTagName("img")[0].src;
    addProductToCart(title,price,img);
    updateTotal();
    saveCartItem();
    updateCartIcon();
}

function addProductToCart (title,price,img){
    var cartShopbox = document.createElement('div');
    cartShopbox.classList.add('cart-box');
    var cartItems = document.getElementsByClassName('cart-content')[0];
    var cartItemName = cartItems.getElementsByClassName('cart-product-title');
    for (var i =0; i<cartItemName.length; i++){
        if (cartItemName[i].innerText == title){
            alert("You already add this Item to cart")
            return;
        }
    }
    var cartBoxContent =`<img src=${img} class="cart-img"alt=""/>
                            <div class="detail-box">
                            <div class="cart-product-title">${title}</div>
                            <div class="cart-price">${price}</div>
                            <input
                                type="number"
                                name=""
                                id=""
                                value="1"
                                class="cart-quantity"
                            />
                            </div>
                            <!--Remove item-->
                            <i class='bx bx-trash-alt cart-remove' ></i>`
        cartShopbox.innerHTML = cartBoxContent;
        cartItems.append(cartShopbox);
        cartShopbox.getElementsByClassName('cart-remove')[0]
            .addEventListener('click', removeCartItem);
        cartShopbox.getElementsByClassName('cart-quantity')[0]
            .addEventListener('change', quantityChange); 
        saveCartItem();
        updateCartIcon();
}
// keep Item in cart when page refesh
function saveCartItem (){
    var cartContent = document.getElementsByClassName("cart-content")[0]
    var cartBoxes = cartContent.getElementsByClassName("cart-box");
    var cartItems = [];

    for(var i=0; i<cartBoxes.length; i++){
        var cartBox = cartBoxes[i];
        var titleElement = cartBox.getElementsByClassName("cart-product-title")[0];
        var priceElement = cartBox.getElementsByClassName("cart-price")[0];
        var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
        var imgElement = cartBox.getElementsByTagName("img")[0];
        
        // Check if all elements exist before accessing their properties
        if (titleElement && priceElement && quantityElement && imgElement){
            var item ={
                title: titleElement.innerText,
                price : priceElement.innerText,
                quantity : quantityElement.value,
                productImg :imgElement.src
    
            };
            cartItems.push(item);
        }  
    }
    localStorage.setItem('cartItems' , JSON.stringify(cartItems));
}
// Load In cart
function loadCartItem (){
    var cartItems = localStorage.getItem('cartItems')
    if (cartItems){
        cartItems = JSON.parse(cartItems)
        for(var i=0; i<cartItems.length; i++){
            var item = cartItems[i]
            addProductToCart(item.title , item.price , item.productImg);

            var cartBoxes = document.getElementsByClassName("cart-box");
            var cartBox = cartBoxes[cartBoxes.length -1 ];
            var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
            quantityElement.value = item.quantity;
        }
    }
    var cartTotal = localStorage.getItem('cartTotal');
    if(cartTotal){
        document.getElementsByClassName('total-price')[0].innerText = '$' +cartTotal;
    }
    updateCartIcon();
}
//Quatity in cartIcon
function updateCartIcon(){
    var cartBoxes = document.getElementsByClassName("cart-box");
    var quantity =0;
    for (var i =0; i < cartBoxes.length; i++){
        var cartBox = cartBoxes[i];
        var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
        if (quantityElement){
            quantity+= parseInt(quantityElement.value);
        }
        
    }
    var cartIcon = document.querySelector("#cart-icon");
    cartIcon.setAttribute('data-quantity' , quantity);
}
// Clear cart item after success payment
function clearCart(){
    var cartContent = document.getElementsByClassName("cart-content")[0]
    cartContent.innerHTML = '';
    updateTotal();
    localStorage.removeItem('cartItems');

}
// Search bar
function search() {
    var filter = document.getElementById('text_search').value.toUpperCase();
    var items = document.querySelectorAll('.box');

    items.forEach(item => {
        var title = item.querySelector('h2');
        var value = title.textContent || title.innerText;
        if (value.toUpperCase().indexOf(filter) > -1) {
            item.style.display = "";
        } else {
            item.style.display = "none";
        }
    });
}




