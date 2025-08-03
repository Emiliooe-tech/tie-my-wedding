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
  // Define a minimal vendor list containing only the Alamo Fiesta Charcuterie entry.
  const vendors = [
    { category: 'Catering & Cakes', name: 'Alamo Fiesta Charcuterie', location: 'San Antonio, TX', description: 'Bottomless charcuterie experience that allows guests to make their own boards.', phone: '210‑900‑9990', email: 'AlamoFiestaGroup@gmail.com' }
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

  // Elements related to login dropdown and vendor/member portals
  const loginButton = document.getElementById('login-button');
  const loginDropdownMenu = document.getElementById('login-dropdown-menu');
  const vendorLoginLinkEl = document.getElementById('vendor-login-link');
  const memberLoginLinkEl = document.getElementById('member-login-link');

  // Elements related to vendor portal functionality
  // vendor-portal-link no longer exists; replaced by login dropdown
  //const vendorPortalLink = document.getElementById('vendor-portal-link');
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

  // Elements for member login modal
  const memberLoginModal = document.getElementById('member-login-modal');
  const memberLoginClose = document.getElementById('member-login-close');
  const memberLoginForm = document.getElementById('member-login-form');
  const memberLoginName = document.getElementById('member-login-name');
  const memberLoginEmail = document.getElementById('member-login-email');

  // Elements for member portal
  const memberPortalSection = document.getElementById('member-portal');
  const memberNameDisplay = document.getElementById('member-name-display');
  const memberLogoutBtn = document.getElementById('member-logout');
  const savedVendorsList = document.getElementById('saved-vendors-list');
  const memberAddContactForm = document.getElementById('member-add-contact-form');
  const contactNameInput = document.getElementById('contact-name');
  const contactEmailInput = document.getElementById('contact-email');
  const contactsList = document.getElementById('contacts-list');

  // Save button in vendor modal
  const saveVendorButton = document.getElementById('save-vendor-button');

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
    // Show or hide the save button based on member login status
    if (saveVendorButton) {
      const profile = getMemberProfile();
      if (profile) {
        saveVendorButton.style.display = 'inline-block';
        // Overwrite any previous click handler
        saveVendorButton.onclick = function (e) {
          e.stopPropagation();
          addVendorToFavorites(vendor);
        };
      } else {
        saveVendorButton.style.display = 'none';
        saveVendorButton.onclick = null;
      }
    }
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
      // Add a save button if a member is logged in
      if (getMemberProfile()) {
        const saveBtn = document.createElement('button');
        saveBtn.className = 'save-button';
        saveBtn.textContent = 'Save';
        saveBtn.addEventListener('click', (evt) => {
          // Prevent the card click from opening the modal when saving
          evt.stopPropagation();
          addVendorToFavorites(v);
        });
        card.appendChild(saveBtn);
      }
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
  // ===== Login dropdown handling =====
  // Toggle display of the login dropdown when clicking the button
  loginButton.addEventListener('click', (e) => {
    e.preventDefault();
    const isVisible = loginDropdownMenu.style.display === 'block';
    loginDropdownMenu.style.display = isVisible ? 'none' : 'block';
  });

  // Hide dropdown when clicking anywhere else on the page
  window.addEventListener('click', (e) => {
    if (!loginButton.contains(e.target) && !loginDropdownMenu.contains(e.target)) {
      loginDropdownMenu.style.display = 'none';
    }
  });

  /**
   * Define global functions for vendor and member login. These functions
   * are referenced directly via onclick attributes in the HTML so that
   * clicks on the dropdown options always trigger the correct action.
   */
  window.handleVendorLogin = function () {
    loginDropdownMenu.style.display = 'none';
    if (getCurrentVendor()) {
      showVendorPortal();
    } else {
      vendorLoginModal.style.display = 'block';
      vendorLoginForm.style.display = 'flex';
      vendorSignupForm.style.display = 'none';
    }
  };
  window.handleMemberLogin = function () {
    loginDropdownMenu.style.display = 'none';
    memberLoginModal.style.display = 'block';
  };

  /**
   * Attach explicit click handlers to the vendor and member login buttons in
   * the dropdown. While the HTML uses inline `onclick` attributes, adding
   * these listeners with `stopPropagation()` ensures that the click events
   * are handled before the global document click listeners (which hide
   * dropdowns/modals) can interfere. Without stopping propagation, the
   * window-level click handler may run first and prevent the desired
   * behaviour, particularly on the vendor login button.
   */
  if (vendorLoginLinkEl) {
    vendorLoginLinkEl.addEventListener('click', (ev) => {
      ev.stopPropagation();
      window.handleVendorLogin();
    });
  }
  if (memberLoginLinkEl) {
    memberLoginLinkEl.addEventListener('click', (ev) => {
      ev.stopPropagation();
      window.handleMemberLogin();
    });
  }

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

  // ===== Member login handling =====
  // Close member login modal when clicking X
  memberLoginClose.addEventListener('click', () => {
    memberLoginModal.style.display = 'none';
  });
  // Close member login modal when clicking outside
  window.addEventListener('click', (event) => {
    if (event.target === memberLoginModal) {
      memberLoginModal.style.display = 'none';
    }
  });
  // Handle member login (simple profile capture)
  memberLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameVal = memberLoginName.value.trim();
    const emailVal = memberLoginEmail.value.trim();
    if (!nameVal || !emailVal) {
      alert('Please enter your name and email.');
      return;
    }
    // Create or update member profile with favourites and contacts arrays
    const profile = getMemberProfile() || { favorites: [], contacts: [] };
    profile.name = nameVal;
    profile.email = emailVal;
    saveMemberProfile(profile);
    // Also update profileName/profileEmail for greeting (existing profile section)
    localStorage.setItem('profileName', nameVal);
    localStorage.setItem('profileEmail', emailVal);
    loadProfile();
    memberLoginForm.reset();
    memberLoginModal.style.display = 'none';
    showMemberPortal();
    alert('Welcome! Your profile has been saved.');
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

  // =============================
  // Member portal functionality
  // =============================

  /**
   * Retrieve the member profile from localStorage. Returns an object with
   * name, email, favorites (array) and contacts (array). If none exist,
   * returns null.
   */
  function getMemberProfile() {
    try {
      return JSON.parse(localStorage.getItem('memberProfile') || 'null');
    } catch (e) {
      return null;
    }
  }

  /**
   * Save the member profile back to localStorage.
   * @param {Object} profile The profile object containing name, email, favorites and contacts
   */
  function saveMemberProfile(profile) {
    localStorage.setItem('memberProfile', JSON.stringify(profile));
  }

  /**
   * Show the member dashboard if the user is logged in. Renders the saved
   * vendors list and contacts.
   */
  function showMemberPortal() {
    const profile = getMemberProfile();
    if (profile) {
      memberNameDisplay.textContent = profile.name;
      renderSavedVendors(profile.favorites);
      renderContacts(profile.contacts);
      memberPortalSection.style.display = 'block';
    }
  }
  function hideMemberPortal() {
    memberPortalSection.style.display = 'none';
  }

  /**
   * Render the list of saved vendors in the dashboard.
   * @param {Array} list Array of vendor objects
   */
  function renderSavedVendors(list) {
    savedVendorsList.innerHTML = '';
    if (!list || !list.length) {
      const li = document.createElement('li');
      li.textContent = 'No saved vendors.';
      savedVendorsList.appendChild(li);
      return;
    }
    list.forEach(v => {
      const li = document.createElement('li');
      li.textContent = v.name;
      savedVendorsList.appendChild(li);
    });
  }

  /**
   * Render the list of contacts.
   * @param {Array} list Array of contact objects
   */
  function renderContacts(list) {
    contactsList.innerHTML = '';
    if (!list || !list.length) {
      const li = document.createElement('li');
      li.textContent = 'No contacts added.';
      contactsList.appendChild(li);
      return;
    }
    list.forEach(c => {
      const li = document.createElement('li');
      li.textContent = `${c.name} (${c.email})`;
      contactsList.appendChild(li);
    });
  }

  /**
   * Add a vendor to the current member's favourites list. If the vendor
   * already exists in the list, a message is shown instead.
   * @param {Object} vendor The vendor object to add
   */
  function addVendorToFavorites(vendor) {
    const profile = getMemberProfile();
    if (!profile) {
      alert('Please log in as a member to save vendors.');
      return;
    }
    // Use vendor name as unique identifier for simplicity
    if (profile.favorites.some(f => f.name === vendor.name)) {
      alert('Vendor is already saved in your favourites.');
      return;
    }
    profile.favorites.push({ name: vendor.name, category: vendor.category, location: vendor.location });
    saveMemberProfile(profile);
    renderSavedVendors(profile.favorites);
    alert('Vendor saved successfully!');
  }

  // Handle logout for member portal
  memberLogoutBtn.addEventListener('click', () => {
    // Remove profileName/email and memberProfile to simulate logout
    localStorage.removeItem('profileName');
    localStorage.removeItem('profileEmail');
    localStorage.removeItem('memberProfile');
    hideMemberPortal();
    loadProfile();
  });

  // Handle adding a new contact to the member profile
  if (memberAddContactForm) {
    memberAddContactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameVal = contactNameInput.value.trim();
      const emailVal = contactEmailInput.value.trim();
      if (!nameVal || !emailVal) {
        alert('Please enter contact name and email.');
        return;
      }
      const profile = getMemberProfile();
      if (!profile) {
        alert('Please log in as a member to add contacts.');
        return;
      }
      profile.contacts.push({ name: nameVal, email: emailVal });
      saveMemberProfile(profile);
      renderContacts(profile.contacts);
      memberAddContactForm.reset();
    });
  }

  // On initial load, show member portal if profile exists
  if (getMemberProfile()) {
    showMemberPortal();
  }

});