document.addEventListener("DOMContentLoaded", () => {
  const shopList = document.getElementById("shop-list");

  if (!shopList || !window.shopProducts) {
    return;
  }

  shopList.innerHTML = window.shopProducts
    .map(
      (product) => `
        <article class="shop-card">
          <p class="eyebrow">QR-ready</p>
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="shop-card__meta">
            <span>${product.price}</span>
            <span>${product.tag}</span>
          </div>
        </article>
      `
    )
    .join("");
});
