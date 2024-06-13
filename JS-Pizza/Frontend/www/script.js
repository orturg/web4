

document.addEventListener("DOMContentLoaded", function() {

    let placeholder = document.querySelector(".pizza-list");
    let pizzas = JSON.parse(getJSON());
    let out = "";

    for (let pizza of pizzas) {

        let categories = [];
        if (pizza.content.meat) categories.push('meat');
        if (pizza.content.pineapple) categories.push('pineapple');
        if (pizza.content.mushroom) categories.push('mushroom');
        if (pizza.content.ocean) categories.push('seafood');
        if (pizza.type.toLowerCase().includes('вега')) categories.push('vega');

        let categoriesData = categories.join(' ');

        let isNewBadge = pizza.is_new ? '<a class="new-badge">Нова</a>' : '';
        let isPopularBadge = pizza.is_popular ? '<a class="popular-badge">Популярна</a>' : '';

        if (pizza.is_new && pizza.is_popular) {
            isPopularBadge = '';
        }

        let smallSizeDiameterLable = pizza.small_size ? ` <a class="size first-size" style="${!pizza.big_size ? 'margin-left: 105px;' : ''}">
                            <img src="assets/images/size-icon.svg" class="size-icon">
                            30
                        </a>` : '';

        let smallSizeWeightLable = pizza.small_size ? `<a class="size second-line-first small-size" style="${!pizza.big_size ? 'margin-left: 100px;' : ''}">
                            <img src="assets/images/weight.svg" class="size-icon">
                            370
                        </a>` : '';             
        let smallSizeWeight = pizza.small_size ? `<a class="price small-price">${pizza.small_size.weight}</a>` : '';


        let bigSizeDiameterLable = pizza.big_size ? `<a class="size second-size" style="${!pizza.small_size ? 'margin-left: 110px;' : ''}">
                            <img src="assets/images/size-icon.svg" class="size-icon">
                            40
                        </a>` : '';
        let bigSizeWeightLable = pizza.big_size ? `<a class="size second-line-first big-size" style="${!pizza.small_size ? 'margin-left: 106px;' : ''}">
                            <img src="assets/images/weight.svg" class="size-icon">
                            660
                        </a>` : '';                

        let bigSizeWeight = pizza.big_size ? `<a class="price second-price big-price">${pizza.big_size.weight}</a>` : '';



                        
        let smallSizePrice = pizza.small_size ? `<a class="price small-price ${pizza.title === 'Імпреза' ? '' : 'bbq'}" style="${!pizza.big_size ? 'margin-right: 90px; margin-left: 109px;' : ''}">${pizza.small_size.price}</a>` : '';
        let smallSizeCurrency = pizza.small_size ? `<a class="currency" style="${!pizza.big_size ? 'margin-left: 112px;' : ''}">грн.</a>` : '';
        let bigSizePrice = pizza.big_size ? `<a class="price second-price big-price">${pizza.big_size.price}</a>` : '';
        let bigSizeCurrency = pizza.big_size ? `<a class="currency second-currency" style="${!pizza.small_size ? 'margin-left: 112px;' : ''}">грн.</a>` : '';

        let smallSizeBuyButton = pizza.small_size ? `<button type="button" class="buy-button small-pizza" id="buy-button-small" style="${!pizza.big_size ? 'margin-left: 90px;' : ''}">Купити</button>` : '';
        let bigSizeBuyButton = pizza.big_size ? `<button type="button" class="buy-button second-buy-button big-pizza" id="buy-button" style="${!pizza.small_size ? 'margin-left: 90px;' : ''}">Купити</button>` : '';
        

        let ingredients = [];
        if (pizza.content.meat) ingredients.push(...pizza.content.meat);
        if (pizza.content.chicken) ingredients.push(...pizza.content.chicken);
        if (pizza.content.cheese) ingredients.push(...pizza.content.cheese);
        if (pizza.content.pineapple) ingredients.push(...pizza.content.pineapple);
        if (pizza.content.mushroom) ingredients.push(...pizza.content.mushroom);
        if (pizza.content.ocean) ingredients.push(...pizza.content.ocean);
        if (pizza.content.additional) ingredients.push(...pizza.content.additional);

        let ingredientsList = ingredients.map(ingredient => `<span class="ingredient">${ingredient}</span>`).join(', ');

        if (pizza.title === "Россо Густо") {
            ingredientsList += '<a style="visibility: hidden"> eaass</a>';
        }

        out += `
            <div class="pizza-card" data-category="${categoriesData}">
                <img src="${pizza.icon}" class="image">
                <div class="caption">
                    <h3 class="pizza-name">${pizza.title}</h3>
                    <p class="description">
                        <a class="second-title">${pizza.type}</a>
                        <a>${ingredientsList}</a>
                    </p>
                    <p>
                        ${smallSizeDiameterLable}
                        ${bigSizeDiameterLable}
                        ${smallSizeWeightLable}
                        ${bigSizeWeightLable}
                    </p>
                    <p>
                        ${smallSizePrice}
                        ${bigSizePrice}
                        ${smallSizeCurrency}
                        ${bigSizeCurrency}
                    </p>
                    <p>
                        ${smallSizeBuyButton}
                        ${bigSizeBuyButton}
                    </p>
                </div>
                ${isNewBadge}
                ${isPopularBadge}
            </div>
        `;
    }

    placeholder.innerHTML = out;


    const orderList = document.querySelector('.order-list');
    const buyButtonsSmall = document.querySelectorAll(".small-pizza");
    const buyButtonsBig = document.querySelectorAll(".big-pizza");
    const clearOrderButton = document.querySelector('.clear-order');
    const categoryButtons = document.querySelectorAll(".type-button");
    const pizzaCards = document.querySelectorAll(".pizza-card");

    buyButtonsSmall.forEach(button => {
        button.addEventListener('click', handleBuyButtonClickSmall);
    });

    buyButtonsBig.forEach(button => {
        button.addEventListener('click', handleBuyButtonClickBig);
    });

    clearOrderButton.addEventListener('click', handleClearOrderClick);

    categoryButtons.forEach(button => {
        button.addEventListener('click', handleCategoryButtonClick);
    });

    loadBasketFromLocalStorage();
    updatePizzaCount();

    function handleBuyButtonClickSmall(event) {
        const buyButton = event.target;
        const pizzaCard = buyButton.closest('.pizza-card');
        const pizzaNameText = pizzaCard.querySelector('.pizza-name');
        const priceText = pizzaCard.querySelector('.small-price');
        const pizzaName = `${pizzaNameText.textContent} (Мала)`;
        let price = parseInt(priceText.textContent);
        let weight = pizzaCard.querySelector('.small-size').textContent;
        let imageUrl = pizzaCard.querySelector('.image').src;
        updateBasket(pizzaName, "small", price, weight, imageUrl);
    }

    function handleBuyButtonClickBig(event) {
        const buyButton = event.target;
        const pizzaCard = buyButton.closest('.pizza-card');
        const pizzaNameText = pizzaCard.querySelector('.pizza-name');
        const priceText = pizzaCard.querySelector('.big-price');
        const pizzaName = `${pizzaNameText.textContent} (Велика)`;
        let price = parseInt(priceText.textContent);
        let weight = pizzaCard.querySelector('.big-size').textContent;
        let imageUrl = pizzaCard.querySelector('.image').src;
        updateBasket(pizzaName, "big", price, weight, imageUrl);
    }

    function updateBasket(pizzaName, size, price, weight, imageUrl) {
        const existingItem = Array.from(orderList.children).find(item => {
            return item.querySelector('.item-title').textContent === pizzaName;
        });

        let diameter = size === "small" ? "30" : "40";

        if (existingItem) {
            let pizzaAmount = existingItem.querySelector(".item-amount");
            let amount = parseInt(pizzaAmount.textContent);
            amount += 1;
            pizzaAmount.textContent = amount;
        } else {
            addProductToBasket(pizzaName, size, price, diameter, weight, imageUrl);
        }

        updateOrderSummary();
        saveBasketToLocalStorage();
    }

    function addProductToBasket(pizzaName, size, price, diameter, weight, imageUrl) {
        const orderItem = document.createElement('div');
        orderItem.classList.add('order-item');
        orderItem.innerHTML = `
            <a class="item-title">${pizzaName}</a>
            <p class="item-size">
                <a>
                    <img src="assets/images/size-icon.svg" class="basket-icon">
                    ${diameter}
                </a>
                <a class="second-item-size">
                    <img src="assets/images/weight.svg" class="basket-icon">
                    ${weight}
                </a>
            </p>
            <div class="item-control-buttons">
                <a class="item-price">${price}грн</a>
                <button type="button" class="minus-button">-</button>
                <a class="item-amount">1</a>
                <button type="button" class="plus-button">+</button>
                <button type="button" class="delete-button">x</button>
            </div>
            <img src="${imageUrl}" class="item-image">
            <hr class="basket-line">
        `;

        orderList.appendChild(orderItem);

        orderItem.querySelector(".plus-button").addEventListener('click', handlePlusButtonClick);
        orderItem.querySelector(".minus-button").addEventListener('click', handleMinusButtonClick);
        orderItem.querySelector(".delete-button").addEventListener('click', handleDeleteButtonClick);
    }

    function handlePlusButtonClick(event) {
        const orderItem = event.target.closest('.order-item');
        let pizzaAmount = orderItem.querySelector(".item-amount");
        let amount = parseInt(pizzaAmount.textContent);
        amount += 1;
        pizzaAmount.textContent = amount;
        updateOrderSummary();
        saveBasketToLocalStorage();
    }

    function handleMinusButtonClick(event) {
        const orderItem = event.target.closest('.order-item');
        let pizzaAmount = orderItem.querySelector(".item-amount");
        let amount = parseInt(pizzaAmount.textContent);
        if (amount > 1) {
            amount -= 1;
            pizzaAmount.textContent = amount;
        } else {
            orderItem.remove();
        }
        updateOrderSummary();
        saveBasketToLocalStorage();
    }

    function handleDeleteButtonClick(event) {
        const orderItem = event.target.closest('.order-item');
        orderItem.remove();
        updateOrderSummary();
        saveBasketToLocalStorage();
    }

    function handleClearOrderClick() {
        orderList.innerHTML = '';
        updateOrderSummary();
        saveBasketToLocalStorage();
    }

    function handleCategoryButtonClick(event) {
        const category = event.target.dataset.category;

        categoryButtons.forEach(button => button.classList.remove('selected'));
        event.target.classList.add('selected');

        pizzaCards.forEach(card => {
            const cardCategories = card.dataset.category.split(' ');

            if (category === 'all' || cardCategories.includes(category)) {
                card.style.display = 'inline-block';
            } else {
                card.style.display = 'none';
            }
        });

        updatePizzaCount();
    }

    function updateOrderSummary() {
        const orderItems = orderList.querySelectorAll('.order-item');
        let totalAmount = 0;
        let totalItems = orderItems.length;
        orderItems.forEach(item => {
            const itemPrice = parseInt(item.querySelector('.item-price').textContent);
            const itemAmount = parseInt(item.querySelector('.item-amount').textContent);
            totalAmount += itemPrice * itemAmount;
        });
        document.querySelector('.order-price').textContent = `${totalAmount} грн`;
        document.querySelector('.order-amount').textContent = `${totalItems}`;
    }

    function saveBasketToLocalStorage() {
        const orderItems = orderList.querySelectorAll('.order-item');
        const basket = [];

        orderItems.forEach(item => {
            const pizzaName = item.querySelector('.item-title').textContent;
            const diameter = item.querySelector('.item-size a').textContent.trim();
            const weight = item.querySelector('.second-item-size').textContent.trim();
            const price = parseInt(item.querySelector('.item-price').textContent);
            const amount = parseInt(item.querySelector('.item-amount').textContent);
            const imageUrl = item.querySelector('.item-image').src;

            basket.push({ pizzaName, diameter, weight, price, amount, imageUrl });
        });

        localStorage.setItem('basket', JSON.stringify(basket));
    }

    function loadBasketFromLocalStorage() {
        const basket = JSON.parse(localStorage.getItem('basket')) || [];

        basket.forEach(item => {
            const { pizzaName, diameter, weight, price, amount, imageUrl } = item;

            const orderItem = document.createElement('div');
            orderItem.classList.add('order-item');
            orderItem.innerHTML = `
                <a class="item-title">${pizzaName}</a>
                <p class="item-size">
                    <a>
                        <img src="assets/images/size-icon.svg" class="basket-icon">
                        ${diameter}
                    </a>
                    <a class="second-item-size">
                        <img src="assets/images/weight.svg" class="basket-icon">
                        ${weight}
                    </a>
                </p>
                <div class="item-control-buttons">
                    <a class="item-price">${price}грн</a>
                    <button type="button" class="minus-button">-</button>
                    <a class="item-amount">${amount}</a>
                    <button type="button" class="plus-button">+</button>
                    <button type="button" class="delete-button">x</button>
                </div>
                <img src="${imageUrl}" class="item-image">
                <hr class="basket-line">
            `;

            orderList.appendChild(orderItem);

            orderItem.querySelector(".plus-button").addEventListener('click', handlePlusButtonClick);
            orderItem.querySelector(".minus-button").addEventListener('click', handleMinusButtonClick);
            orderItem.querySelector(".delete-button").addEventListener('click', handleDeleteButtonClick);
        });

        updateOrderSummary();
    }

    function updatePizzaCount() {
    const pizzaList = document.querySelectorAll('.pizza-card');
    const visiblePizzas = Array.from(pizzaList).filter(pizza => pizza.style.display !== 'none');
    document.querySelector('.main-title-amount').textContent = visiblePizzas.length;
}

});
