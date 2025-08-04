// Import Leaflet library
const L = window.L

const siteData = {
  A: {
    coords: [29.9792, 31.1342], // Pyramids of Giza, Egypt
    title: "Pyramids of Giza",
    country: "Egypt",
    fact: "The Pyramids of Giza are over 4,500 years old and were built without modern machines. They're one of the last surviving wonders of the ancient world!",
    audio: "audio/pyramids.mp3",
    emoji: "🏺",
    animationClass: "pyramids",
    discovered: false,
  },
  B: {
    coords: [16.7666, -3.0026], // Timbuktu, Mali
    title: "Timbuktu",
    country: "Mali",
    fact: "Timbuktu was once a great centre of Islamic learning and trade in gold and salt. It had one of the world's oldest libraries!",
    audio: "audio/timbuktu.mp3",
    emoji: "📚",
    animationClass: "library",
    discovered: false,
  },
  C: {
    coords: [-20.2675, 30.9333], // Great Zimbabwe, Zimbabwe
    title: "Great Zimbabwe Ruins",
    country: "Zimbabwe",
    fact: "This city was built entirely from stone—without any mortar! It shows the architectural skills of early African civilizations.",
    audio: "audio/zimbabwe.mp3",
    emoji: "🏛️",
    animationClass: "ruins",
    discovered: false,
  },
  D: {
    coords: [-2.3333, 34.8333], // Serengeti, Tanzania
    title: "Serengeti National Park",
    country: "Tanzania",
    fact: "Home to the world's largest animal migration, the Serengeti is a natural wonder teeming with wildlife!",
    audio: "audio/serengeti.mp3",
    emoji: "🦁",
    animationClass: "wildlife",
    discovered: false,
  },
  E: {
    coords: [-33.8066, 18.3662], // Robben Island, South Africa
    title: "Robben Island",
    country: "South Africa",
    fact: "This was the prison where Nelson Mandela was held for 18 years. Today, it stands as a powerful symbol of freedom and resilience.",
    audio: "audio/robben-island.mp3",
    emoji: "🏝️",
    animationClass: "island",
    discovered: false,
  },
  F: {
    coords: [-17.9243, 25.8572], // Victoria Falls, Zambia/Zimbabwe
    title: "Victoria Falls",
    country: "Zambia/Zimbabwe",
    fact: "Known as 'The Smoke That Thunders,' it's one of the world's biggest waterfalls! The mist can be seen from 20 miles away!",
    audio: "audio/victoria-falls.mp3",
    emoji: "💧",
    animationClass: "waterfall",
    discovered: false,
  },
  G: {
    coords: [-4.3333, 55.7333], // Vallée de Mai, Seychelles
    title: "Vallée de Mai Nature Reserve",
    country: "Seychelles",
    fact: "This tropical forest is home to the giant Coco de Mer palm and many rare animals—you can only find them here!",
    audio: "audio/seychelles.mp3",
    emoji: "🌴",
    animationClass: "tropical",
    discovered: false,
  },
  H: {
    coords: [12.0333, 39.0333], // Lalibela, Ethiopia
    title: "Rock-Hewn Churches of Lalibela",
    country: "Ethiopia",
    fact: "These rock-hewn churches were carved straight into the ground in the 12th century—some say by angels! It's a true engineering marvel.",
    audio: "audio/ethiopia.mp3",
    emoji: "⛪",
    animationClass: "churches",
    discovered: false,
  },
}

let map
const markers = {}
let discoveredCount = 0
let currentAudio = null

// Initialize the map
function initMap() {
  if (!document.getElementById("map")) {
    console.error("Map container not found")
    return
  }

  try {
    // Create map with proper configuration centered on Africa
    map = L.map("map", {
      center: [0, 20], // Centered on Africa
      zoom: 3,
      maxBounds: [
        [-40, -25], // Southwest bounds
        [40, 60], // Northeast bounds
      ],
      maxBoundsViscosity: 1.0,
      zoomControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      boxZoom: true,
      keyboard: true,
    })

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
      minZoom: 2,
    }).addTo(map)

    // Force map to invalidate size after a short delay
    setTimeout(() => {
      map.invalidateSize()
    }, 100)

    // Add glowing markers for each heritage site
    Object.entries(siteData).forEach(([id, data]) => {
      // Create simpler custom icon HTML
      const iconHtml = `
        <div class="marker-glow ${data.discovered ? "discovered" : ""}">
          <div class="marker-inner">
            <span class="marker-emoji">${data.emoji}</span>
          </div>
        </div>
      `

      const customIcon = L.divIcon({
        className: "custom-heritage-marker",
        html: iconHtml,
        iconSize: [50, 50],
        iconAnchor: [25, 25],
      })

      const marker = L.marker(data.coords, {
        icon: customIcon,
        title: data.title,
      }).addTo(map)

      // FIXED: More robust click event binding
      marker.on("click", (e) => {
        // console.log("Marker clicked:", id, data.title)
        discoverSite(id, data)
        // Prevent event bubbling
        L.DomEvent.stopPropagation(e)
      })

      markers[id] = marker
    })

    // Add custom CSS for markers
    addMarkerStyles()
    updateProgress()
    // console.log("Map initialized successfully")
  } catch (error) {
    console.error("Error initializing map:", error)
  }
}

function addMarkerStyles() {
  const style = document.createElement("style")
  style.textContent = `
    .marker-glow {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: radial-gradient(circle, #ffff00 20%, #fbb03b 60%, transparent 80%);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: markerPulse 2s ease-in-out infinite;
      box-shadow: 0 0 30px rgba(255, 255, 0, 0.8);
      position: relative;
      cursor: pointer;
    }
    
    .marker-glow.discovered {
      background: radial-gradient(circle, #4CAF50 20%, #45a049 60%, transparent 80%);
      animation: none;
      box-shadow: 0 0 25px rgba(76, 175, 80, 0.8);
    }
    
    .marker-inner {
      width: 35px;
      height: 35px;
      background: #59379b;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid white;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
      pointer-events: none;
    }
    
    .marker-emoji {
      font-size: 18px;
      filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.5));
      pointer-events: none;
    }
    
    @keyframes markerPulse {
      0%, 100% { 
        transform: scale(1); 
        box-shadow: 0 0 30px rgba(255, 255, 0, 0.8);
      }
      50% { 
        transform: scale(1.15); 
        box-shadow: 0 0 40px rgba(255, 255, 0, 1);
      }
    }
    
    .custom-heritage-marker {
      background: transparent !important;
      border: none !important;
    }
  `
  document.head.appendChild(style)
}

function discoverSite(id, data) {
  // console.log("Discovering site:", id, data.title) // Debug log

  if (data.discovered) {
    // console.log("Site already discovered, showing popup again")
    showPopup(data)
    return
  }

  // Mark as discovered
  data.discovered = true
  discoveredCount++

  // Update marker appearance
  const markerElement = markers[id].getElement()
  const glowElement = markerElement.querySelector(".marker-glow")
  if (glowElement) {
    glowElement.classList.add("discovered")
  }

  // Show popup with audio
  showPopup(data)

  // Update progress
  updateProgress()

  // Check if all sites discovered
  if (discoveredCount === Object.keys(siteData).length) {
    setTimeout(() => {
      showCompletionModal()
    }, 10000) // Give time to listen to the audio
  }
}

function showPopup(data) {
  // console.log("Showing popup for:", data.title) // Debug log

  // Stop any currently playing audio
  if (currentAudio) {
    currentAudio.pause()
    currentAudio.currentTime = 0
  }

  // Update popup content
  document.getElementById("site-title").innerText = data.title
  document.getElementById("site-country").innerText = `Country: ${data.country}`
  document.getElementById("site-fact").innerText = data.fact

  // Update visual factoid with placeholder
  const factoidImage = document.getElementById("factoidImage")
  const factoidAnimation = document.getElementById("factoidAnimation")

  if (factoidImage) {
    factoidImage.innerHTML = '<div class="placeholder-text">Heritage Site Image</div>'
  }

  if (factoidAnimation) {
    factoidAnimation.className = `factoid-animation ${data.animationClass}`
  }

  // Setup and auto-play audio
  const audioElement = document.getElementById("site-audio")
  if (audioElement) {
    audioElement.src = data.audio
    currentAudio = audioElement
  }

  // FIXED: Show popup overlay with better display handling
  const popupOverlay = document.getElementById("popupOverlay")
  if (popupOverlay) {
    // Remove hidden class first
    popupOverlay.classList.remove("hidden")
    // Force display style
    popupOverlay.style.display = "flex"
    popupOverlay.style.visibility = "visible"
    popupOverlay.style.opacity = "1"
  }

  // Auto-play audio after a short delay
  setTimeout(() => {
    if (audioElement) {
      audioElement.play().catch((e) => {
        console.log("Audio autoplay failed:", e)
      })
    }
  }, 500)

  // Show celebration badge after audio starts
  setTimeout(() => {
    const discoveryBadge = document.getElementById("discoveryBadge")
    if (discoveryBadge) {
      discoveryBadge.style.display = "block"
    }
  }, 800)

  // Audio ended event
  if (audioElement) {
    audioElement.addEventListener("ended", () => {
      currentAudio = null
    })
  }
}

function closePopup() {
  const popupOverlay = document.getElementById("popupOverlay")
  const discoveryBadge = document.getElementById("discoveryBadge")

  if (popupOverlay) {
    // FIXED: Better hiding mechanism
    popupOverlay.classList.add("hidden")
    popupOverlay.style.display = "none"
    popupOverlay.style.visibility = "hidden"
    popupOverlay.style.opacity = "0"
  }

  if (discoveryBadge) {
    discoveryBadge.style.display = "none"
  }

  // Stop any playing audio
  if (currentAudio) {
    currentAudio.pause()
    currentAudio.currentTime = 0
    currentAudio = null
  }
}

function updateProgress() {
  const totalSites = Object.keys(siteData).length
  const percentage = (discoveredCount / totalSites) * 100

  document.getElementById("progressFill").style.width = `${percentage}%`
  document.getElementById("progressText").innerText = `${discoveredCount}/${totalSites} Sites`

  // Add badges
  const badgeContainer = document.getElementById("badgeContainer")
  badgeContainer.innerHTML = ""

  if (discoveredCount >= 3) {
    badgeContainer.innerHTML += '<span class="badge bronze">🥉</span>'
  }
  if (discoveredCount >= 5) {
    badgeContainer.innerHTML += '<span class="badge silver">🥈</span>'
  }
  if (discoveredCount >= 7) {
    badgeContainer.innerHTML += '<span class="badge gold">🥇</span>'
  }
  if (discoveredCount === totalSites) {
    badgeContainer.innerHTML += '<span class="badge master">🏆</span>'
  }
}

function showCompletionModal() {
  document.getElementById("completionModal").classList.remove("hidden")
  createConfetti()

  // Play completion audio
  const completionAudio = document.getElementById("completionAudio")
  completionAudio.play().catch((e) => console.log("Completion audio play failed:", e))
}

function closeCompletionModal() {
  document.getElementById("completionModal").classList.add("hidden")
  setTimeout(() => {
    window.location.href = "../ACTIVITY2/index.html"
  }, 500)
}

function restartActivity() {
  // Reset all sites
  Object.values(siteData).forEach((site) => {
    site.discovered = false
  })

  discoveredCount = 0

  // Reset markers
  Object.entries(siteData).forEach(([id, data]) => {
    const markerElement = markers[id].getElement()
    const glowElement = markerElement.querySelector(".marker-glow")
    if (glowElement) {
      glowElement.classList.remove("discovered")
    }
  })

  updateProgress()
  closeCompletionModal()
}

function createConfetti() {
  const confettiContainer = document.getElementById("confetti")
  confettiContainer.innerHTML = ""

  for (let i = 0; i < 60; i++) {
    const confettiPiece = document.createElement("div")
    confettiPiece.className = "confetti-piece"
    confettiPiece.style.left = Math.random() * 100 + "%"
    confettiPiece.style.animationDelay = Math.random() * 3 + "s"
    confettiPiece.style.animationDuration = Math.random() * 3 + 2 + "s"
    confettiContainer.appendChild(confettiPiece)
  }
}

// Audio control functions
document.addEventListener("DOMContentLoaded", () => {
  // console.log("DOM loaded, initializing map...")

  // Initialize map if we're on the map page
  if (document.getElementById("map")) {
    // Wait a bit for CSS to load
    setTimeout(initMap, 200)
  }
})

// Window resize handler for map
window.addEventListener("resize", () => {
  if (map) {
    setTimeout(() => {
      map.invalidateSize()
    }, 100)
  }
})

// FIXED: Close popup when clicking outside the popup card (more specific targeting)
document.addEventListener("click", (event) => {
  const popupOverlay = document.getElementById("popupOverlay")
  const popupCard = document.getElementById("popup")

  if (
    popupOverlay &&
    !popupOverlay.classList.contains("hidden") &&
    popupCard &&
    !popupCard.contains(event.target) &&
    event.target === popupOverlay
  ) {
    closePopup()
  }
})

// Keyboard navigation
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    const popupOverlay = document.getElementById("popupOverlay")
    const modal = document.getElementById("completionModal")

    if (popupOverlay && !popupOverlay.classList.contains("hidden")) {
      closePopup()
    } else if (modal && !modal.classList.contains("hidden")) {
      closeCompletionModal()
    }
  }
})
