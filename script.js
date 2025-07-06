// Navigation and Interactive Features JavaScript

class NavigationManager {
  constructor() {
    this.navbar = document.getElementById("navbar")
    this.navMenu = document.getElementById("nav-menu")
    this.hamburger = document.getElementById("hamburger")
    this.navLinks = document.querySelectorAll(".nav-link")
    this.sections = document.querySelectorAll(".section-content")
    this.scrollProgress = document.getElementById("scroll-progress")
    this.backToTop = document.getElementById("back-to-top")
    this.themeToggle = document.getElementById("theme-toggle")
    this.searchBtn = document.getElementById("search-btn")
    this.searchInput = document.getElementById("search-input")
    this.searchResults = document.getElementById("search-results")
    this.toast = document.getElementById("toast")

    this.currentTheme = localStorage.getItem("theme") || "light"
    this.searchData = this.buildSearchData()

    this.init()
  }

  init() {
    this.setupEventListeners()
    this.setupTheme()
    this.setupIntersectionObserver()
    this.setupPortfolioFilters()
    this.setupContactForm()
    this.setupAnimations()
  }

  setupEventListeners() {
    // Scroll events
    window.addEventListener("scroll", () => {
      this.handleScroll()
      this.updateScrollProgress()
      this.updateActiveNavLink()
    })

    // Mobile menu toggle
    this.hamburger.addEventListener("click", () => {
      this.toggleMobileMenu()
    })

    // Close mobile menu when clicking on links
    this.navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        this.closeMobileMenu()
      })
    })

    // Theme toggle
    this.themeToggle.addEventListener("click", () => {
      this.toggleTheme()
    })

    // Search functionality
    this.searchBtn.addEventListener("click", () => {
      this.toggleSearch()
    })

    this.searchInput.addEventListener("input", (e) => {
      this.handleSearch(e.target.value)
    })

    // Close search when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".search-container") && !e.target.closest(".search-results")) {
        this.closeSearch()
      }
    })

    // Back to top button
    this.backToTop.addEventListener("click", () => {
      this.scrollToTop()
    })

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault()
        const target = document.querySelector(anchor.getAttribute("href"))
        if (target) {
          this.smoothScrollTo(target)
        }
      })
    })

    // CTA button interaction
    const ctaButton = document.getElementById("cta-button")
    if (ctaButton) {
      ctaButton.addEventListener("click", () => {
        this.showToast("Welcome! Let's get started!", "success")
        this.smoothScrollTo(document.getElementById("about"))
      })
    }

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      this.handleKeyboardNavigation(e)
    })
  }

  handleScroll() {
    const scrolled = window.pageYOffset

    // Update navbar appearance
    if (scrolled > 100) {
      this.navbar.classList.add("scrolled")
    } else {
      this.navbar.classList.remove("scrolled")
    }

    // Show/hide back to top button
    if (scrolled > 500) {
      this.backToTop.classList.add("visible")
    } else {
      this.backToTop.classList.remove("visible")
    }
  }

  updateScrollProgress() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
    const scrolled = (winScroll / height) * 100
    this.scrollProgress.style.width = scrolled + "%"
  }

  updateActiveNavLink() {
    let current = ""

    this.sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.clientHeight
      if (window.pageYOffset >= sectionTop - 200) {
        current = section.getAttribute("id")
      }
    })

    this.navLinks.forEach((link) => {
      link.classList.remove("active")
      if (link.getAttribute("data-section") === current) {
        link.classList.add("active")
      }
    })
  }

  toggleMobileMenu() {
    this.hamburger.classList.toggle("active")
    this.navMenu.classList.toggle("active")
    document.body.style.overflow = this.navMenu.classList.contains("active") ? "hidden" : ""
  }

  closeMobileMenu() {
    this.hamburger.classList.remove("active")
    this.navMenu.classList.remove("active")
    document.body.style.overflow = ""
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === "light" ? "dark" : "light"
    this.applyTheme()
    localStorage.setItem("theme", this.currentTheme)
    this.showToast(`Switched to ${this.currentTheme} mode`, "success")
  }

  setupTheme() {
    this.applyTheme()
  }

  applyTheme() {
    document.documentElement.setAttribute("data-theme", this.currentTheme)
  }

  toggleSearch() {
    this.searchInput.classList.toggle("active")
    if (this.searchInput.classList.contains("active")) {
      this.searchInput.focus()
    } else {
      this.closeSearch()
    }
  }

  closeSearch() {
    this.searchInput.classList.remove("active")
    this.searchResults.classList.remove("active")
    this.searchInput.value = ""
  }

  buildSearchData() {
    const searchableContent = []

    // Add sections
    this.sections.forEach((section) => {
      const title = section.querySelector("h2")?.textContent || ""
      const content = section.querySelector("p")?.textContent || ""
      const id = section.id

      if (title && id) {
        searchableContent.push({
          title,
          content,
          id,
          type: "section",
        })
      }
    })

    // Add services
    document.querySelectorAll(".service-item").forEach((service) => {
      const title = service.querySelector("h3")?.textContent || ""
      const content = service.querySelector("p")?.textContent || ""
      const id = service.id

      if (title) {
        searchableContent.push({
          title,
          content,
          id: id || "services",
          type: "service",
        })
      }
    })

    return searchableContent
  }

  handleSearch(query) {
    if (!query.trim()) {
      this.searchResults.classList.remove("active")
      return
    }

    const results = this.searchData.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.content.toLowerCase().includes(query.toLowerCase()),
    )

    this.displaySearchResults(results)
  }

  displaySearchResults(results) {
    if (results.length === 0) {
      this.searchResults.innerHTML = '<div class="search-result-item">No results found</div>'
    } else {
      this.searchResults.innerHTML = results
        .map(
          (result) =>
            `<div class="search-result-item" data-target="${result.id}">
                    <strong>${result.title}</strong>
                    <p>${result.content.substring(0, 100)}...</p>
                </div>`,
        )
        .join("")

      // Add click handlers to results
      this.searchResults.querySelectorAll(".search-result-item").forEach((item) => {
        item.addEventListener("click", () => {
          const targetId = item.getAttribute("data-target")
          const target = document.getElementById(targetId)
          if (target) {
            this.smoothScrollTo(target)
            this.closeSearch()
          }
        })
      })
    }

    this.searchResults.classList.add("active")
  }

  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("aos-animate")
        }
      })
    }, observerOptions)

    document.querySelectorAll("[data-aos]").forEach((el) => {
      observer.observe(el)
    })
  }

  setupPortfolioFilters() {
    const filterBtns = document.querySelectorAll(".filter-btn")
    const portfolioItems = document.querySelectorAll(".portfolio-item")

    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-filter")

        // Update active button
        filterBtns.forEach((b) => b.classList.remove("active"))
        btn.classList.add("active")

        // Filter items
        portfolioItems.forEach((item) => {
          const category = item.getAttribute("data-category")
          if (filter === "all" || category === filter) {
            item.classList.remove("hidden")
            item.style.display = "flex"
          } else {
            item.classList.add("hidden")
            item.style.display = "none"
          }
        })

        this.showToast(`Filtered by: ${filter === "all" ? "All Items" : filter}`, "success")
      })
    })
  }

  setupContactForm() {
    const form = document.getElementById("contact-form")
    const submitBtn = form.querySelector(".submit-btn")

    form.addEventListener("submit", async (e) => {
      e.preventDefault()

      if (this.validateForm(form)) {
        submitBtn.classList.add("loading")

        // Simulate form submission
        await new Promise((resolve) => setTimeout(resolve, 2000))

        submitBtn.classList.remove("loading")
        this.showToast("Message sent successfully!", "success")
        form.reset()
      }
    })

    // Real-time validation
    const inputs = form.querySelectorAll("input, textarea")
    inputs.forEach((input) => {
      input.addEventListener("blur", () => {
        this.validateField(input)
      })
    })
  }

  validateForm(form) {
    const inputs = form.querySelectorAll("input[required], textarea[required]")
    let isValid = true

    inputs.forEach((input) => {
      if (!this.validateField(input)) {
        isValid = false
      }
    })

    return isValid
  }

  validateField(field) {
    const value = field.value.trim()
    const errorElement = document.getElementById(field.name + "-error")
    let isValid = true
    let errorMessage = ""

    if (!value) {
      errorMessage = "This field is required"
      isValid = false
    } else if (field.type === "email" && !this.isValidEmail(value)) {
      errorMessage = "Please enter a valid email address"
      isValid = false
    }

    if (errorElement) {
      errorElement.textContent = errorMessage
    }

    field.style.borderColor = isValid ? "" : "var(--accent-color)"
    return isValid
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  setupAnimations() {
    // Add hover animations to cards
    document.querySelectorAll(".content-card, .service-item").forEach((card) => {
      card.addEventListener("mouseenter", () => {
        card.style.animation = "pulse 0.6s ease-in-out"
      })

      card.addEventListener("animationend", () => {
        card.style.animation = ""
      })
    })

    // Parallax effect for hero section
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset
      const hero = document.querySelector(".hero")
      if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`
      }
    })
  }

  smoothScrollTo(target) {
    const targetPosition = target.offsetTop - 80 // Account for fixed navbar
    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    })
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  handleKeyboardNavigation(e) {
    // ESC key closes search and mobile menu
    if (e.key === "Escape") {
      this.closeSearch()
      this.closeMobileMenu()
    }

    // Enter key in search input
    if (e.key === "Enter" && e.target === this.searchInput) {
      const firstResult = this.searchResults.querySelector(".search-result-item")
      if (firstResult) {
        firstResult.click()
      }
    }
  }

  showToast(message, type = "info") {
    this.toast.textContent = message
    this.toast.className = `toast ${type}`
    this.toast.classList.add("show")

    setTimeout(() => {
      this.toast.classList.remove("show")
    }, 3000)
  }
}

// Initialize the navigation manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new NavigationManager()
})

// Additional utility functions
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Performance optimization for scroll events
const optimizedScrollHandler = debounce(() => {
  // Additional scroll-based animations can be added here
}, 10)

window.addEventListener("scroll", optimizedScrollHandler)

// Service Worker registration for offline functionality (optional)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration)
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError)
      })
  })
}