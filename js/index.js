document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("floatingBtn");
  const menuItems = document.querySelectorAll(".h-right ul li");
  const searchInput = document.querySelector(".searchbar");
  const suggestionBox = document.querySelector(".search-suggestions");
  const searchableElements = document.querySelectorAll("p, span, li");

  /* ============================
     FLOATING BUTTON (yours)
  ============================ */
  btn.style.transition = "opacity 0.5s ease, transform 0.5s ease";
  let isFloating = false;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 510 && !isFloating) {
      btn.style.opacity = "0";
      btn.style.transform = "translateY(20px)";

      setTimeout(() => {
        btn.style.position = "fixed";
        btn.style.bottom = "40px";
        btn.style.right = "80px";
        btn.style.zIndex = "1000";
        btn.style.opacity = "1";
        btn.style.transform = "translateY(0)";
      }, 150);

      isFloating = true;
    }

    if (window.scrollY <= 510 && isFloating) {
      btn.style.opacity = "0";
      btn.style.transform = "translateY(20px)";

      setTimeout(() => {
        btn.style.position = "";
        btn.style.bottom = "";
        btn.style.right = "";
        btn.style.zIndex = "";
        btn.style.opacity = "1";
        btn.style.transform = "translateY(0)";
      }, 150);

      isFloating = false;
    }
  });

  /* ============================
     HEADER MENU SCROLL
  ============================ */
  menuItems.forEach(item => {
    item.addEventListener("click", () => {
      const targetId = item.getAttribute("data-target");
      const section = document.getElementById(targetId);

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });

  /* ============================
     SEARCH FUNCTIONALITY
  ============================ */

  // Function to clear previous highlights
  function clearHighlights() {
    document.querySelectorAll(".search-highlight").forEach(el => {
      el.classList.remove("search-highlight");
    });
  }

  // Function to highlight matched elements
  function highlightMatches(query) {
    clearHighlights();  // Clear previous highlights

    // Skip highlighting if query is empty
    if (!query) return;

    const matches = [];

    // Go through all elements and check if they match the query
    searchableElements.forEach(el => {
      if (el.textContent.toLowerCase().includes(query)) {
        el.classList.add("search-highlight");  // Add highlight class
        matches.push(el);
      }
    });

    return matches;
  }

  // Function to show search suggestions
  function showSuggestions(query) {
    suggestionBox.innerHTML = "";  // Clear previous suggestions

    if (!query) {
      suggestionBox.style.display = "none";  // Hide suggestions if no query
      return;
    }

    const results = [];

    // Find matching elements for suggestions
    searchableElements.forEach(el => {
      const text = el.textContent.trim();
      if (text.toLowerCase().includes(query) && !results.includes(text)) {
        results.push(text);
      }
    });

    if (results.length === 0) {
      suggestionBox.style.display = "none";  // Hide if no matches
      return;
    }

    // Show suggestions for the matches
    results.slice(0, 8).forEach(text => {
      const div = document.createElement("div");
      div.textContent = text;

      div.addEventListener("click", () => {
        searchInput.value = text;  // Set search input to clicked suggestion
        suggestionBox.style.display = "none";  // Hide suggestions

        // Find the element that matches the clicked suggestion
        const target = [...searchableElements].find(el =>
          el.textContent.trim() === text
        );

        if (target) {
          clearHighlights();
          target.classList.add("search-highlight");
          target.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }
      });

      suggestionBox.appendChild(div);
    });

    suggestionBox.style.display = "block";  // Show suggestions
  }

  // Event listener for live search input
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();
    highlightMatches(query);  // Highlight matching text
    showSuggestions(query);   // Show suggestions as you type
  });

  // Event listener for Enter key to scroll to the first match
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const query = searchInput.value.toLowerCase().trim();
      const matches = highlightMatches(query);

      if (matches.length > 0) {
        matches[0].scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }

      suggestionBox.style.display = "none";  // Hide suggestions after Enter
    }
  });

  // Event listener to close suggestions when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".searchbar") && !e.target.closest(".search-suggestions")) {
      suggestionBox.style.display = "none";  // Close suggestions when clicking outside
    }
  });


});
