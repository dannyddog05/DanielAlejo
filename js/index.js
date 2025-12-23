document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("floatingBtn");

  // Smooth transition
  btn.style.transition = "opacity 0.4s ease, transform 0.4s ease";

  let isFloating = false;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 510 && !isFloating) {
      // Fade out briefly before floating
      btn.style.opacity = "0";
      btn.style.transform = "translateY(10px)";

      setTimeout(() => {
        // Make button float
        btn.style.position = "fixed";
        btn.style.bottom = "40px";
        btn.style.right = "80px";
        btn.style.zIndex = "1000";

        // Fade back in
        btn.style.opacity = "1";
        btn.style.transform = "translateY(0)";
      }, 150);

      isFloating = true;
    }

    if (window.scrollY <= 510 && isFloating) {
      // Fade out briefly before returning
      btn.style.opacity = "0";
      btn.style.transform = "translateY(10px)";

      setTimeout(() => {
        // Restore normal position
        btn.style.position = "";
        btn.style.bottom = "";
        btn.style.right = "";
        btn.style.zIndex = "";

        // Fade back in
        btn.style.opacity = "1";
        btn.style.transform = "translateY(0)";
      }, 150);

      isFloating = false;
    }
  });
});
