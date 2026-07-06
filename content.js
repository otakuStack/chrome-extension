// Function to replace a single image element with a cat image
function replaceImage(img) {
  // Prevent infinite loops by marking images we've already processed
  if (img.dataset.catReplaced === "true") return;
  img.dataset.catReplaced = "true";

  // We add a timestamp to the URL to bypass browser caching so every image is unique
  const uniqueId = Math.random().toString(36).substring(2, 9);
  const catImageUrl = `https://cataas.com/cat?nocache=${uniqueId}`;

  // Preserve the original dimensions so the website layout doesn't break
  const width = img.clientWidth || img.width;
  const height = img.clientHeight || img.height;

  if (width > 0) img.style.width = `${width}px`;
  if (height > 0) img.style.height = `${height}px`;

  // Swap the source to the cat API
  img.src = catImageUrl;
  if (img.srcset) {
    img.srcset = ""; // Clear responsive sources to force our new source
  }
}

// Function to scan the entire DOM for images
function replaceAllImages() {
  const images = document.querySelectorAll("img");
  images.forEach(replaceImage);
}

// 1. Run immediately when the script loads
replaceAllImages();

// 2. Continually watch for lazy-loaded images or infinite scrolling elements
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName === "IMG") {
          replaceImage(node);
        }
        // Check if the added node contains images inside it
        const nestedImages = node.querySelectorAll("img");
        nestedImages.forEach(replaceImage);
      }
    });
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});