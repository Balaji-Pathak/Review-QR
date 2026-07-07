document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("qr-form");
  const urlInput = document.getElementById("review-url");
  const errorEl = document.getElementById("form-error");
  const resultPanel = document.getElementById("result-panel");
  const qrCodeEl = document.getElementById("qr-code");
  const resultUrlEl = document.getElementById("result-url");
  const downloadBtn = document.getElementById("download-btn");
  const clearBtn = document.getElementById("clear-btn");

  let qrCodeInstance = null;
  let currentUrl = "";

  // Validate the URL before generating the QR code.
  const isValidUrl = (value) => {
    try {
      const parsed = new URL(value);
      return ["http:", "https:"].includes(parsed.protocol);
    } catch {
      return false;
    }
  };

  // Render the QR code into the preview container.
  const generateQr = (url) => {
    if (!qrCodeEl) return;

    qrCodeEl.innerHTML = "";
    qrCodeInstance = new QRCode(qrCodeEl, {
      text: url,
      width: 220,
      height: 220,
      colorDark: "#111827",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.M,
    });
  };

  // Clear the current output and reset the form.
  const resetView = () => {
    if (resultPanel) resultPanel.hidden = true;
    if (errorEl) errorEl.textContent = "";
    if (urlInput) urlInput.value = "";
    currentUrl = "";
    if (qrCodeEl) qrCodeEl.innerHTML = "";
  };

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const rawUrl = urlInput?.value.trim() || "";

      if (!rawUrl) {
        if (errorEl) errorEl.textContent = "Please enter a valid URL.";
        return;
      }

      if (!isValidUrl(rawUrl)) {
        if (errorEl) errorEl.textContent = "Please enter a valid URL.";
        return;
      }

      if (errorEl) errorEl.textContent = "";
      currentUrl = rawUrl;
      generateQr(currentUrl);

      if (resultPanel) resultPanel.hidden = false;
      if (resultUrlEl) resultUrlEl.textContent = currentUrl;
    });
  }

  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      if (!currentUrl) return;

      const canvas = qrCodeEl?.querySelector("canvas");
      if (!canvas) return;

      const link = document.createElement("a");
      link.download = "review-qr.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", resetView);
  }
});
