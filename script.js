/*
 * Script for the Wedding Vendor Directory
 *
 * This file defines a collection of sample vendors and dynamically creates
 * category cards and vendor listings. It also enables searching and
 * filtering by category.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Sample vendor data. Each vendor has a category, name, location,
  // description and contact details. In a real application this data could
  // come from a database or API.
  const vendors = [
    // Venues
    { category: 'Venues', name: 'Sunset Ballroom', location: 'San Antonio, TX', description: 'Elegant ballroom overlooking the skyline.', phone: '210‑555‑1234', email: 'info@sunsetballroom.com' },
    { category: 'Venues', name: 'Oakwood Event Center', location: 'Austin, TX', description: 'Rustic indoor/outdoor venue with lush gardens.', phone: '512‑555‑9876', email: 'contact@oakwoodevents.com' },
    { category: 'Venues', name: 'Lone Star Banquet Hall', location: 'Dallas, TX', description: 'Spacious hall with modern amenities.', phone: '214‑555‑1111', email: 'hello@lonestarhall.com' },
    { category: 'Venues', name: 'Riverwalk Terrace', location: 'San Antonio, TX', description: 'Scenic terrace along the River Walk.', phone: '210‑555‑5678', email: 'events@riverwalkterrace.com' },
    { category: 'Venues', name: 'Hillside Farm Venue', location: 'Hill Country, TX', description: 'Charming farm setting for rustic weddings.', phone: '830‑555‑2222', email: 'booking@hillsidefarm.com' },

    // Planners
    { category: 'Planners', name: 'Perfect Day Planning', location: 'San Antonio, TX', description: 'Full‑service wedding planning and coordination.', phone: '210‑555‑3333', email: 'info@perfectdayplanning.com' },
    { category: 'Planners', name: 'Elegance Weddings & Events', location: 'Austin, TX', description: 'Boutique planning for intimate and grand weddings.', phone: '512‑555‑4444', email: 'contact@eleganceweddings.com' },
    { category: 'Planners', name: 'Blissful Beginnings', location: 'Dallas, TX', description: 'Stress‑free planning from engagement to honeymoon.', phone: '214‑555‑5555', email: 'hello@blissfulbeginnings.com' },
    { category: 'Planners', name: 'Lasting Impression Planners', location: 'Houston, TX', description: 'Creative planners specializing in themed weddings.', phone: '713‑555‑1212', email: 'info@lastingimpression.com' },
    { category: 'Planners', name: 'Simple & Sweet Events', location: 'San Antonio, TX', description: 'Month‑of coordination for the DIY couple.', phone: '210‑555‑9090', email: 'events@simpleandsweet.com' },

    // Photographers & Videographers
    { category: 'Photography & Video', name: 'Forever Moments Photography', location: 'San Antonio, TX', description: 'Documentary‑style wedding photography.', phone: '210‑555‑8888', email: 'info@forevermoments.com' },
    { category: 'Photography & Video', name: 'Creative Lens Studio', location: 'Austin, TX', description: 'Artistic photos and cinematic films.', phone: '512‑555‑7777', email: 'contact@creativelensstudio.com' },
    { category: 'Photography & Video', name: 'Epic Love Films', location: 'Dallas, TX', description: 'Story‑driven videography for your love story.', phone: '214‑555‑6666', email: 'hello@epiclovefilms.com' },
    { category: 'Photography & Video', name: 'Lens of Love', location: 'Houston, TX', description: 'Fine‑art wedding photography.', phone: '713‑555‑4444', email: 'info@lensoflove.com' },
    { category: 'Photography & Video', name: 'Motion Memories Videography', location: 'San Antonio, TX', description: 'Highlight and full‑length wedding films.', phone: '210‑555‑7777', email: 'films@motionmemories.com' },

    // Florists & Decor
    { category: 'Florals & Decor', name: 'Bloom & Vine Florals', location: 'San Antonio, TX', description: 'Custom floral designs for every style.', phone: '210‑555‑2222', email: 'info@bloomandvine.com' },
    { category: 'Florals & Decor', name: 'Petals & Posies', location: 'Austin, TX', description: 'Whimsical bouquets and centerpieces.', phone: '512‑555‑2323', email: 'contact@petalsposies.com' },
    { category: 'Florals & Decor', name: 'Rustic Elegance Decor', location: 'Dallas, TX', description: 'Decor rentals and styling services.', phone: '214‑555‑2424', email: 'hello@rusticelegance.com' },
    { category: 'Florals & Decor', name: 'Garden Bloom Florist', location: 'Houston, TX', description: 'Seasonal arrangements for ceremonies and receptions.', phone: '713‑555‑2525', email: 'info@gardenbloomflorist.com' },
    { category: 'Florals & Decor', name: 'Blush Petal Design', location: 'San Antonio, TX', description: 'Luxurious florals and event design.', phone: '210‑555‑2626', email: 'events@blushpetaldesign.com' },

    // Music (DJs & Bands)
    { category: 'Music & Entertainment', name: 'Top Tier DJs', location: 'San Antonio, TX', description: 'Professional DJ services for unforgettable receptions.', phone: '210‑555‑2727', email: 'info@toptierdjs.com' },
    { category: 'Music & Entertainment', name: 'Harmony Beats Band', location: 'Austin, TX', description: 'Live band specializing in jazz and pop classics.', phone: '512‑555‑2828', email: 'contact@harmonybeatsband.com' },
    { category: 'Music & Entertainment', name: 'Rhythm & Joy DJs', location: 'Dallas, TX', description: 'Interactive DJs who keep your dance floor full.', phone: '214‑555‑2929', email: 'hello@rhythmjoydjs.com' },
    { category: 'Music & Entertainment', name: 'Party Pulse Entertainment', location: 'Houston, TX', description: 'Wedding DJs and MCs for seamless celebrations.', phone: '713‑555‑3030', email: 'info@partypulse.com' },
    { category: 'Music & Entertainment', name: 'Electric Groove Band', location: 'San Antonio, TX', description: 'High‑energy live band covering all genres.', phone: '210‑555‑3131', email: 'booking@electricgrooveband.com' },

    // Catering & Cakes
    { category: 'Catering & Cakes', name: 'Savory Delight Catering', location: 'San Antonio, TX', description: 'Custom menus and full‑service catering.', phone: '210‑555‑3232', email: 'info@savorydelight.com' },
    { category: 'Catering & Cakes', name: 'Sweet Sensations Bakery', location: 'Austin, TX', description: 'Wedding cakes and dessert bars.', phone: '512‑555‑3333', email: 'contact@sweetsensations.com' },
    { category: 'Catering & Cakes', name: 'Culinary Creations', location: 'Dallas, TX', description: 'Gourmet catering with locally sourced ingredients.', phone: '214‑555‑3434', email: 'hello@culinarycreations.com' },
    { category: 'Catering & Cakes', name: 'Golden Fork Caterers', location: 'Houston, TX', description: 'Buffets, plated dinners and cocktail receptions.', phone: '713‑555‑3535', email: 'info@goldenforkcaterers.com' },
    { category: 'Catering & Cakes', name: 'Sugar & Spice Cake Studio', location: 'San Antonio, TX', description: 'Artistic custom wedding cakes.', phone: '210‑555‑3636', email: 'cakes@sugarandspice.com' },

    // Added by user: Charcuterie catering option
    { category: 'Catering & Cakes', name: 'Alamo Fiesta Charcuterie', location: 'San Antonio, TX', description: 'Bottomless charcuterie experience that allows guests to make their own boards.', phone: '210‑900‑9990', email: 'AlamoFiestaGroup@gmail.com' },

    // Hair & Makeup
    { category: 'Hair & Makeup', name: 'Glam Beauty Artistry', location: 'San Antonio, TX', description: 'On‑site hair and makeup for brides and parties.', phone: '210‑555‑3737', email: 'info@glambeauty.com' },
    { category: 'Hair & Makeup', name: 'Bridal Glow Studio', location: 'Austin, TX', description: 'Natural glam looks tailored for each bride.', phone: '512‑555‑3838', email: 'contact@bridalglowstudio.com' },
    { category: 'Hair & Makeup', name: 'Radiant Styles Salon', location: 'Dallas, TX', description: 'Hair styling, updos and makeup services.', phone: '214‑555‑3939', email: 'hello@radiantstyles.com' },
    { category: 'Hair & Makeup', name: 'Elegant Tresses Team', location: 'Houston, TX', description: 'Mobile beauty team for weddings.', phone: '713‑555‑4040', email: 'info@eleganttresses.com' },
    { category: 'Hair & Makeup', name: 'Flawless Faces & Hair', location: 'San Antonio, TX', description: 'Full bridal beauty experience.', phone: '210‑555‑4141', email: 'beauty@flawlessfaceshair.com' },

    // Officiants
    { category: 'Officiants', name: 'Reverend John Smith', location: 'San Antonio, TX', description: 'Non‑denominational officiant with personalized ceremonies.', phone: '210‑555‑4242', email: 'revjohn@officiants.com' },
    { category: 'Officiants', name: 'United Vows Officiants', location: 'Austin, TX', description: 'Team of ordained ministers for civil and religious weddings.', phone: '512‑555‑4343', email: 'info@unitedvows.com' },
    { category: 'Officiants', name: 'Heartfelt Ceremonies', location: 'Dallas, TX', description: 'Meaningful ceremonies tailored to each couple.', phone: '214‑555‑4444', email: 'contact@heartfeltceremonies.com' },
    { category: 'Officiants', name: 'Everlasting Union Officiants', location: 'Houston, TX', description: 'Professional officiants for all styles of weddings.', phone: '713‑555‑4545', email: 'hello@everlastingunion.com' },
    { category: 'Officiants', name: 'Love Story Officiants', location: 'San Antonio, TX', description: 'Story‑focused wedding ceremonies.', phone: '210‑555‑4646', email: 'info@lovestoryofficiants.com' },

    // Transportation
    { category: 'Transportation', name: 'Classic Car Bridal Rides', location: 'San Antonio, TX', description: 'Vintage cars for stylish arrivals and exits.', phone: '210‑555‑4747', email: 'info@classiccarbridalrides.com' },
    { category: 'Transportation', name: 'Elegant Limousine Service', location: 'Austin, TX', description: 'Luxury limos and stretch SUVs.', phone: '512‑555‑4848', email: 'contact@elegantlimo.com' },
    { category: 'Transportation', name: 'Luxe Wedding Wheels', location: 'Dallas, TX', description: 'High‑end vehicles and professional chauffeurs.', phone: '214‑555‑4949', email: 'hello@luxeweddingwheels.com' },
    { category: 'Transportation', name: 'Comfort Coach Transport', location: 'Houston, TX', description: 'Shuttle buses for wedding guests.', phone: '713‑555‑5050', email: 'info@comfortcoach.com' },
    { category: 'Transportation', name: 'Royal Carriage', location: 'San Antonio, TX', description: 'Horse‑drawn carriages for fairy‑tale weddings.', phone: '210‑555‑5151', email: 'bookings@royalcarriage.com' },

    // Stationery & Attire
    { category: 'Stationery & Attire', name: 'Paper & Lace Invitations', location: 'San Antonio, TX', description: 'Custom invitations, save‑the‑dates and signage.', phone: '210‑555‑5252', email: 'info@paperandlace.com' },
    { category: 'Stationery & Attire', name: 'Tailored Elegance Bridal', location: 'Austin, TX', description: 'Designer gowns and tuxedos for purchase or rental.', phone: '512‑555‑5353', email: 'contact@tailoredelegancebridal.com' },
    { category: 'Stationery & Attire', name: 'Couture Dresses & Suits', location: 'Dallas, TX', description: 'High‑fashion wedding attire boutiques.', phone: '214‑555‑5454', email: 'hello@couturedressesandsuits.com' },
    { category: 'Stationery & Attire', name: 'Chic Bridal Boutique', location: 'Houston, TX', description: 'Bridal gowns, bridesmaid dresses and accessories.', phone: '713‑555‑5556', email: 'info@chicbridal.com' },
    { category: 'Stationery & Attire', name: 'Suit & Tie Formal Wear', location: 'San Antonio, TX', description: 'Formal attire rental for grooms and groomsmen.', phone: '210‑555‑5656', email: 'rentals@suitandtie.com' }
  ];

  // Load any user‑added vendors from localStorage and append them to the vendor list.
  try {
    const saved = JSON.parse(localStorage.getItem('userVendors') || '[]');
    if (Array.isArray(saved)) {
      saved.forEach(v => vendors.push(v));
    }
  } catch (e) {
    // If parsing fails, ignore and continue with default vendors
  }

  // Descriptions for each category shown on the category cards. These
  // descriptions summarise the importance of each type of vendor, inspired
  // by wedding planning guides.
  const categoryDescriptions = {
    'Venues': 'A great venue sets the tone for your celebration and should be booked early.',
    'Planners': 'Professional planners orchestrate every detail and keep your day on track.',
    'Photography & Video': 'Capture priceless memories with skilled photographers and filmmakers.',
    'Florals & Decor': 'Florists and decorators bring your vision to life with blooms and styling.',
    'Music & Entertainment': 'DJs and bands keep the party alive and the dance floor full.',
    'Catering & Cakes': 'Delight your guests with delicious food and stunning cakes.',
    'Hair & Makeup': 'Look and feel your best with experienced beauty professionals.',
    'Officiants': 'An officiant guides the ceremony and makes your union official.',
    'Transportation': 'Ensure safe, stylish transport for you and your guests.',
    'Stationery & Attire': 'Invitations set the tone and attire completes your wedding look.'
  };

  const searchInput = document.getElementById('search-input');
  const categoryContainer = document.getElementById('category-container');
  const vendorContainer = document.getElementById('vendor-container');

  // Additional DOM elements for filter and profile
  const filterCategorySelect = document.getElementById('filter-category');
  const filterLocationInput = document.getElementById('filter-location');
  const profileForm = document.getElementById('profile-form');
  const profileNameInput = document.getElementById('profile-name');
  const profileEmailInput = document.getElementById('profile-email');
  const profileDisplay = document.getElementById('profile-display');
  const profileGreeting = document.getElementById('profile-greeting');

  // Elements related to vendor portal functionality
  const vendorPortalLink = document.getElementById('vendor-portal-link');
  const vendorLoginModal = document.getElementById('vendor-login-modal');
  const vendorLoginClose = document.getElementById('vendor-login-close');
  const vendorLoginForm = document.getElementById('vendor-login-form');
  const vendorSignupForm = document.getElementById('vendor-signup-form');
  const vendorLoginUsername = document.getElementById('vendor-login-username');
  const vendorLoginPassword = document.getElementById('vendor-login-password');
  const vendorSignupUsername = document.getElementById('vendor-signup-username');
  const vendorSignupPassword = document.getElementById('vendor-signup-password');
  const showSignupLink = document.getElementById('show-signup');
  const showLoginLink = document.getElementById('show-login');
  const vendorPortalSection = document.getElementById('vendor-portal');
  const vendorUsernameDisplay = document.getElementById('vendor-username-display');
  const vendorLogoutBtn = document.getElementById('vendor-logout');
  const vendorAddForm = document.getElementById('vendor-add-form');
  const vendorAddCategorySelect = document.getElementById('vendor-add-category');
  const vendorAddName = document.getElementById('vendor-add-name');
  const vendorAddLocation = document.getElementById('vendor-add-location');
  const vendorAddDescription = document.getElementById('vendor-add-description');
  const vendorAddPhone = document.getElementById('vendor-add-phone');
  const vendorAddEmail = document.getElementById('vendor-add-email');

  // Populate the category dropdown filter based on categories derived from the vendor list.
  // We compute this list here instead of relying on the `categories` constant declared later
  // to avoid referencing a variable before its declaration (which would trigger a ReferenceError).
  const vendorCategories = Array.from(new Set(vendors.map(v => v.category)));
  vendorCategories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    filterCategorySelect.appendChild(option);
  });

  /**
   * Persist vendor ratings in localStorage under the key "vendorRatings".
   * The structure is an object where each key is a vendor name and the value
   * is an array of numbers representing individual star ratings. This allows
   * averaging multiple ratings.
   */
  function getRatings() {
    try {
      return JSON.parse(localStorage.getItem('vendorRatings') || '{}');
    } catch (e) {
      return {};
    }
  }

  function saveRatings(ratings) {
    localStorage.setItem('vendorRatings', JSON.stringify(ratings));
  }

  /**
   * Calculate the average rating for a vendor. Returns a floating number.
   * If no ratings exist, returns 0.
   */
  function getAverageRating(name) {
    const ratings = getRatings();
    const list = ratings[name] || [];
    if (!list.length) return 0;
    const sum = list.reduce((a, b) => a + b, 0);
    return sum / list.length;
  }

  /**
   * Create a star rating display element based on an average rating.
   * This is used in the vendor cards to show the current rating.
   */
  function createStarDisplay(avg) {
    const starContainer = document.createElement('div');
    starContainer.className = 'star-rating';
    const rounded = Math.round(avg * 2) / 2; // allow half stars if desired
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('span');
      // Use unicode stars: solid star for full, half star for 0.5, outline otherwise
      if (rounded >= i) {
        star.textContent = '★';
      } else if (rounded >= i - 0.5) {
        star.textContent = '☆'; // using same star for half to simplify styling
      } else {
        star.textContent = '☆';
      }
      starContainer.appendChild(star);
    }
    return starContainer;
  }

  /**
   * Render an interactive star rating component for a vendor inside the modal.
   * Clicking on a star records the rating in localStorage.
   */
  function renderInteractiveRating(name, container) {
    container.innerHTML = '';
    const currentAvg = getAverageRating(name);
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('span');
      star.className = 'interactive-star';
      star.textContent = i <= Math.round(currentAvg) ? '★' : '☆';
      star.dataset.value = i;
      star.style.cursor = 'pointer';
      star.addEventListener('click', () => {
        const ratings = getRatings();
        if (!ratings[name]) {
          ratings[name] = [];
        }
        ratings[name].push(parseInt(star.dataset.value));
        saveRatings(ratings);
        // Re-render the stars with updated average
        renderInteractiveRating(name, container);
        // Also update vendor listing rating displays
        filterAndRenderVendors();
      });
      container.appendChild(star);
    }
  }

  /**
   * Display the vendor details in a modal dialog. Populates fields and
   * renders an interactive rating component.
   */
  const modal = document.getElementById('vendor-modal');
  const modalName = document.getElementById('modal-name');
  const modalDescription = document.getElementById('modal-description');
  const modalLocation = document.getElementById('modal-location');
  const modalContact = document.getElementById('modal-contact');
  const modalRating = document.getElementById('modal-rating');
  const modalClose = document.getElementById('modal-close');

  function openVendorModal(vendor) {
    modalName.textContent = vendor.name;
    modalDescription.textContent = vendor.description;
    modalLocation.textContent = `Location: ${vendor.location}`;
    modalContact.textContent = `Phone: ${vendor.phone} | Email: ${vendor.email}`;
    renderInteractiveRating(vendor.name, modalRating);
    modal.style.display = 'block';
  }

  modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Close modal when clicking outside of content
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  /**
   * Handle user profile: load existing details from localStorage and display
   * greeting, or show form if no profile is stored.
   */
  function loadProfile() {
    const name = localStorage.getItem('profileName');
    const email = localStorage.getItem('profileEmail');
    if (name && email) {
      profileForm.style.display = 'none';
      profileDisplay.style.display = 'block';
      profileGreeting.textContent = `Welcome back, ${name}!`;
    } else {
      profileForm.style.display = 'block';
      profileDisplay.style.display = 'none';
    }
  }

  // Save profile on form submission
  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameValue = profileNameInput.value.trim();
    const emailValue = profileEmailInput.value.trim();
    if (nameValue && emailValue) {
      localStorage.setItem('profileName', nameValue);
      localStorage.setItem('profileEmail', emailValue);
      loadProfile();
    }
  });

  // Initial load of profile
  loadProfile();

  // Filter handlers for category dropdown and location input
  filterCategorySelect.addEventListener('change', () => {
    // Update activeCategory based on dropdown selection
    activeCategory = filterCategorySelect.value || 'All';
    renderCategories();
    filterAndRenderVendors();
  });
  filterLocationInput.addEventListener('input', () => {
    filterAndRenderVendors();
  });

  // Compute unique categories from the vendor list and include an "All" option
  const categories = ['All', ...Array.from(new Set(vendors.map(v => v.category)))];

  let activeCategory = 'All';

  /**
   * Render category cards. Clicking a card sets the active filter.
   */
  function renderCategories() {
    categoryContainer.innerHTML = '';
    categories.forEach(cat => {
      const card = document.createElement('div');
      card.className = 'category-card';
      if (cat === activeCategory) {
        card.classList.add('active');
      }
      card.dataset.category = cat;
      const h3 = document.createElement('h3');
      h3.textContent = cat;
      const p = document.createElement('p');
      // Display description except for the "All" card
      p.textContent = cat === 'All' ? 'View all vendors across every category.' : categoryDescriptions[cat] || '';
      card.appendChild(h3);
      card.appendChild(p);
      card.addEventListener('click', () => {
        activeCategory = cat;
        renderCategories();
        filterAndRenderVendors();
      });
      categoryContainer.appendChild(card);
    });
  }

  /**
   * Render vendor cards based on a filtered list.
   * @param {Array} list The list of vendors to render
   */
  function renderVendors(list) {
    vendorContainer.innerHTML = '';
    if (!list.length) {
      const msg = document.createElement('p');
      msg.textContent = 'No vendors found. Try adjusting your search or selecting another category.';
      vendorContainer.appendChild(msg);
      return;
    }
    list.forEach(v => {
      const card = document.createElement('div');
      card.className = 'vendor-card';
      const catEl = document.createElement('div');
      catEl.className = 'category';
      catEl.textContent = v.category;
      const nameEl = document.createElement('h4');
      nameEl.textContent = v.name;
      const descEl = document.createElement('p');
      descEl.textContent = v.description;
      const locEl = document.createElement('p');
      locEl.textContent = `Location: ${v.location}`;
      const contactEl = document.createElement('p');
      contactEl.className = 'contact';
      contactEl.textContent = `Phone: ${v.phone} | Email: ${v.email}`;
      card.appendChild(catEl);
      card.appendChild(nameEl);
      card.appendChild(descEl);
      card.appendChild(locEl);
      card.appendChild(contactEl);
      // Append average rating stars to each card
      const avg = getAverageRating(v.name);
      const ratingEl = createStarDisplay(avg);
      card.appendChild(ratingEl);
      // Make the card clickable to open the vendor details modal
      card.addEventListener('click', () => {
        openVendorModal(v);
      });
      vendorContainer.appendChild(card);
    });
  }

  /**
   * Filter vendors based on the active category and search term.
   */
  function filterAndRenderVendors() {
    const term = searchInput.value.trim().toLowerCase();
    // Determine selected category from activeCategory (set by cards or dropdown)
    const selectedCategory = activeCategory === 'All' ? '' : activeCategory;
    const locationTerm = filterLocationInput.value.trim().toLowerCase();
    const filtered = vendors.filter(v => {
      const matchesCategory = !selectedCategory || v.category === selectedCategory;
      const matchesName = v.name.toLowerCase().includes(term);
      const matchesLocation = !locationTerm || v.location.toLowerCase().includes(locationTerm);
      return matchesCategory && matchesName && matchesLocation;
    });
    renderVendors(filtered);
  }

  // Initialise the page
  renderCategories();
  filterAndRenderVendors();

  // Search input handler
  searchInput.addEventListener('input', () => {
    filterAndRenderVendors();
  });

  // =============================
  // Vendor portal functionality
  // =============================

  /**
   * Retrieve vendor accounts from localStorage. Returns an object keyed by
   * username with password as value. If none exist, returns an empty object.
   */
  function getVendorAccounts() {
    try {
      return JSON.parse(localStorage.getItem('vendorAccounts') || '{}');
    } catch (e) {
      return {};
    }
  }

  /**
   * Save vendor accounts to localStorage.
   */
  function saveVendorAccounts(accounts) {
    localStorage.setItem('vendorAccounts', JSON.stringify(accounts));
  }

  /**
   * Persist the current logged‑in vendor username. When not logged in, this
   * value is absent.
   */
  function setCurrentVendor(username) {
    localStorage.setItem('currentVendor', username);
  }
  function getCurrentVendor() {
    return localStorage.getItem('currentVendor');
  }
  function clearCurrentVendor() {
    localStorage.removeItem('currentVendor');
  }

  /**
   * Show the vendor dashboard section for the logged‑in user and hide the
   * login modal. Also repopulate the category dropdown used when adding
   * a new vendor.
   */
  function showVendorPortal() {
    const user = getCurrentVendor();
    if (user) {
      vendorUsernameDisplay.textContent = user;
      vendorPortalSection.style.display = 'block';
      vendorLoginModal.style.display = 'none';
      populateVendorAddCategories();
    }
  }
  function hideVendorPortal() {
    vendorPortalSection.style.display = 'none';
  }

  /**
   * Populate the category dropdown used in the vendor add form. Excludes
   * the "All" category.
   */
  function populateVendorAddCategories() {
    vendorAddCategorySelect.innerHTML = '<option value="">Select category</option>';
    categories.forEach(cat => {
      if (cat === 'All') return;
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      vendorAddCategorySelect.appendChild(opt);
    });
  }

  // Link to open portal or login depending on state
  vendorPortalLink.addEventListener('click', (e) => {
    e.preventDefault();
    if (getCurrentVendor()) {
      showVendorPortal();
    } else {
      vendorLoginModal.style.display = 'block';
      vendorLoginForm.style.display = 'flex';
      vendorSignupForm.style.display = 'none';
    }
  });

  // Close vendor login modal when clicking X or outside
  vendorLoginClose.addEventListener('click', () => {
    vendorLoginModal.style.display = 'none';
  });
  window.addEventListener('click', (event) => {
    if (event.target === vendorLoginModal) {
      vendorLoginModal.style.display = 'none';
    }
  });

  // Toggle between login and signup forms
  showSignupLink.addEventListener('click', (e) => {
    e.preventDefault();
    vendorLoginForm.style.display = 'none';
    vendorSignupForm.style.display = 'flex';
  });
  showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    vendorSignupForm.style.display = 'none';
    vendorLoginForm.style.display = 'flex';
  });

  // Handle vendor login
  vendorLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = vendorLoginUsername.value.trim();
    const password = vendorLoginPassword.value;
    const accounts = getVendorAccounts();
    if (accounts[username] && accounts[username] === password) {
      setCurrentVendor(username);
      vendorLoginForm.reset();
      showVendorPortal();
    } else {
      alert('Invalid username or password.');
    }
  });

  // Handle vendor signup
  vendorSignupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = vendorSignupUsername.value.trim();
    const password = vendorSignupPassword.value;
    if (!username || !password) {
      alert('Please fill out all fields.');
      return;
    }
    const accounts = getVendorAccounts();
    if (accounts[username]) {
      alert('Username already exists.');
      return;
    }
    accounts[username] = password;
    saveVendorAccounts(accounts);
    alert('Account created! Please log in.');
    vendorSignupForm.reset();
    vendorSignupForm.style.display = 'none';
    vendorLoginForm.style.display = 'flex';
  });

  // Handle vendor logout
  vendorLogoutBtn.addEventListener('click', () => {
    clearCurrentVendor();
    hideVendorPortal();
  });

  // Handle adding a new vendor listing
  vendorAddForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const category = vendorAddCategorySelect.value;
    const nameVal = vendorAddName.value.trim();
    const locationVal = vendorAddLocation.value.trim();
    const descriptionVal = vendorAddDescription.value.trim();
    const phoneVal = vendorAddPhone.value.trim();
    const emailVal = vendorAddEmail.value.trim();
    if (!category || !nameVal || !locationVal || !descriptionVal || !phoneVal) {
      alert('Please fill out all required fields.');
      return;
    }
    const newVendor = {
      category: category,
      name: nameVal,
      location: locationVal,
      description: descriptionVal,
      phone: phoneVal,
      email: emailVal
    };
    vendors.push(newVendor);
    // Save to userVendors in localStorage
    try {
      const list = JSON.parse(localStorage.getItem('userVendors') || '[]');
      list.push(newVendor);
      localStorage.setItem('userVendors', JSON.stringify(list));
    } catch (err) {
      localStorage.setItem('userVendors', JSON.stringify([newVendor]));
    }
    // Add new category if it doesn't exist
    if (!categories.includes(category)) {
      categories.push(category);
      categoryDescriptions[category] = 'Community submitted vendors in this category.';
      const opt = document.createElement('option');
      opt.value = category;
      opt.textContent = category;
      filterCategorySelect.appendChild(opt);
    }
    populateVendorAddCategories();
    vendorAddForm.reset();
    alert('Vendor added successfully.');
    filterAndRenderVendors();
  });

  // On load, show vendor portal if vendor is already logged in
  if (getCurrentVendor()) {
    showVendorPortal();
  }
});