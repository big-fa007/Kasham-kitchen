import {foods} from './food.js'

const cart = JSON.parse(localStorage.getItem('kashamCart')) || []

let foodHtml = ""

foods.forEach((food) => {
  foodHtml += `
   <div class="food-container">
    <img src="${food.image}">
    <div>
    <div class="food-details">
    <p class="food-name truncate"><span>${food.name}</span></p>
    <p class="food-price"><span>₦${(food.price / 100).toFixed(2)}</span></p>
    </div>
        
    <div class="btn-container">
    <button class="add-food addBtn" data-food-id="${food.id}">Add to cart</button>
  </div>
  </div>
  </div>
  `
})
document.getElementById("foods-container").innerHTML = foodHtml

const checkoutEl = document.getElementById("checkout")
checkoutEl.style.display = "none"


let initialQuantity = 0
cart.forEach(item => initialQuantity += item.quantity)
document.getElementById("cart-count").innerText = initialQuantity
if (cart.length > 0){
      checkoutEl.style.display = "flex"
} else {
  checkoutEl.style.display = "none"
}

document.querySelectorAll(".addBtn").forEach((button)=>{
  button.addEventListener("click", ()=> {
    const foodId = button.dataset.foodId
    
    const matchingItem = cart.find(cartItem=>foodId === cartItem.foodId)
    
    if (matchingItem) {
      matchingItem.quantity += 1
    } else {
      cart.push({
      foodId,
      quantity: 1
    })
    }
    localStorage.setItem('kashamCart', JSON.stringify(cart))
    
    
    let cartQuantity = 0
    cart.forEach((cartItem)=>{
      cartQuantity += cartItem.quantity
    })
    
  document.getElementById("cart-count").innerText =
     cartQuantity
    
    if (cart.length > 0){
      checkoutEl.style.display = "flex"
    }
  })
})


checkoutEl.addEventListener('click', ()=>{
  checkOut()
})

function checkOut(){
  if (cart.length === 0) return;
  let message = "Hello Kasham Kitchen, I want to order:\n\n";
  
  let total = 0
  cart.forEach((cartItem) =>{
    console.log('looking for id:',cartItem.foodId,'type:', typeof cartItem)
    console.log('Availabe food ids', foods.map(f =>f.id))
    
    let product = foods.find(food=>food.id === Number(cartItem.foodId))
    console.log('found product', product)
  if (product){
    const itemTotal = (product.price / 100) * cartItem.quantity
    message +=`- ${product.name} x${cartItem.quantity} plate(s) = ₦${itemTotal.toFixed(2)}\n`
    total += itemTotal
  }
  })
  message += `\nTotal: ₦${total.toFixed(2)}`
  
  window.open(`https://wa.me/2349130417725?text=${encodeURIComponent(message)}`, '_blank')
  
  cart.length = 0
  document.getElementById("cart-count").innerText = 0
  checkoutEl.style.display = "none"
  localStorage.removeItem('kashamCart')
}