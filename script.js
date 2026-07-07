document.addEventListener("DOMContentLoaded", () => {
  const shop = window.shop;

  if (!shop) {
    return;
  }

  // Populate the review page from the shop data object.
  const shopNameEl = document.getElementById("shop-name");
  const shopLogoEl = document.getElementById("shop-logo");
  const ratingStarsEl = document.getElementById("shop-rating-stars");
  const ratingSummaryEl = document.getElementById("shop-rating-summary");
  const reviewHeadingEl = document.getElementById("review-heading");
  const reviewDescriptionEl = document.getElementById("review-description");
  const reviewTextEl = document.getElementById("review-text");
  const copyReviewBtn = document.getElementById("copy-review");
  const copyStatusEl = document.getElementById("copy-status");
  const starRatingEl = document.getElementById("star-rating");
  const googleReviewLinkEl = document.getElementById("google-review-link");

  if (shopNameEl) shopNameEl.textContent = shop.name;
  if (shopLogoEl) {
    shopLogoEl.src = shop.logo;
    shopLogoEl.alt = `${shop.name} logo`;
  }
  if (ratingSummaryEl) {
    ratingSummaryEl.textContent = `${shop.rating.toFixed(1)} based on ${shop.reviewCount} Google Reviews`;
  }

  if (ratingStarsEl) {
    const fullStars = Math.round(shop.rating);
    ratingStarsEl.innerHTML = "★".repeat(fullStars) + "☆".repeat(5 - fullStars);
  }

  if (reviewHeadingEl) reviewHeadingEl.textContent = shop.welcomeTitle || "Enjoyed your visit?";
  if (reviewDescriptionEl) {
    reviewDescriptionEl.textContent =
      shop.welcomeMessage || "Your review helps our small business grow and helps future customers make informed decisions.";
  }

  const reviewTemplates = Array.isArray(shop.reviews) && shop.reviews.length > 0 ? shop.reviews : [shop.review];
  if (reviewTextEl) {
    const randomReview = reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)];
    reviewTextEl.value = randomReview;
  }

  if (googleReviewLinkEl) {
    googleReviewLinkEl.href = shop.googleReview;
  }

  // Render interactive visual stars for the experience rating.
  const renderStars = () => {
    if (!starRatingEl) return;

    starRatingEl.innerHTML = "";
    const buttons = [];
    let selectedRating = 0;

    const setPreviewState = (value) => {
      buttons.forEach((button, index) => {
        const buttonValue = index + 1;
        button.classList.toggle("is-hovered", buttonValue <= value);
      });
    };

    const applySelectedState = (value) => {
      buttons.forEach((button, index) => {
        const buttonValue = index + 1;
        button.classList.toggle("is-active", buttonValue <= value);
        button.classList.remove("is-hovered");
      });
    };

    for (let index = 1; index <= 5; index += 1) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "star-btn";
      button.setAttribute("aria-label", `Rate ${index} out of 5`);
      button.textContent = "★";

      button.addEventListener("mouseenter", () => setPreviewState(index));
      button.addEventListener("focus", () => setPreviewState(index));
      button.addEventListener("mouseleave", () => {
        if (selectedRating > 0) {
          applySelectedState(selectedRating);
        } else {
          buttons.forEach((starButton) => starButton.classList.remove("is-hovered"));
        }
      });
      button.addEventListener("blur", () => {
        if (selectedRating > 0) {
          applySelectedState(selectedRating);
        } else {
          buttons.forEach((starButton) => starButton.classList.remove("is-hovered"));
        }
      });
      button.addEventListener("click", () => {
        selectedRating = index;
        applySelectedState(selectedRating);
      });

      buttons.push(button);
      starRatingEl.appendChild(button);
    }
  };

  renderStars();

  // Copy the suggested review with a short success state.
  if (copyReviewBtn && reviewTextEl && copyStatusEl) {
    const buttonLabel = copyReviewBtn.querySelector(".btn__label");
    let resetTimer;

    copyReviewBtn.addEventListener("click", async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(reviewTextEl.value);
        } else {
          reviewTextEl.select();
          document.execCommand("copy");
        }

        copyReviewBtn.classList.add("is-copied");
        if (buttonLabel) buttonLabel.textContent = "✓ Review Copied";
        copyStatusEl.textContent = "✓ Review Copied";
        copyStatusEl.classList.add("is-visible");

        window.clearTimeout(resetTimer);
        resetTimer = window.setTimeout(() => {
          copyReviewBtn.classList.remove("is-copied");
          if (buttonLabel) buttonLabel.textContent = "Copy Review";
          copyStatusEl.textContent = "";
          copyStatusEl.classList.remove("is-visible");
        }, 2000);
      } catch (error) {
        copyStatusEl.textContent = "Unable to copy right now";
        copyStatusEl.classList.add("is-visible");
      }
    });
  }
});
