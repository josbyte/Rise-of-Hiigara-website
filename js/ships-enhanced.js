/* =========================================
   SHIP CLASSES PAGE - Enhanced JavaScript
   Tab switching, search, filter, and ship card interactions
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
  initFactionTabs();
  initShipNodes();
  initSearchFilter();
  createShipModal();
  
  const defaultTree = document.querySelector('.hw-ship-tree.active');
  if (defaultTree) {
    setTimeout(() => generateConnectors(defaultTree), 100);
  }
  
  window.addEventListener('resize', debounce(() => {
    const activeTree = document.querySelector('.hw-ship-tree.active');
    if (activeTree) {
      generateConnectors(activeTree);
    }
  }, 250));
});

/* === UTILITY: DEBOUNCE === */
function debounce(fn, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/* === SEARCH AND FILTER === */
function initSearchFilter() {
  // Create search container if it doesn't exist
  const tabsSection = document.querySelector('.hw-faction-tabs .container');
  if (!tabsSection) return;

  // Check if search already exists
  if (document.getElementById('ship-search-container')) return;

  const searchContainer = document.createElement('div');
  searchContainer.id = 'ship-search-container';
  searchContainer.className = 'hw-search-container';
  searchContainer.innerHTML = `
    <div class="hw-search-box">
      <input 
        type="search" 
        id="ship-search" 
        class="hw-search-input" 
        placeholder="Search ships by name or class..."
        aria-label="Search ships"
      >
      <span class="hw-search-icon">🔍</span>
    </div>
    <div class="hw-filter-buttons">
      <button class="hw-filter-btn" data-filter="all" aria-pressed="true">All Ships</button>
      <button class="hw-filter-btn" data-filter="fighter">Fighters</button>
      <button class="hw-filter-btn" data-filter="bomber">Bombers</button>
      <button class="hw-filter-btn" data-filter="capital">Capital Ships</button>
    </div>
  `;

  tabsSection.parentNode.insertBefore(searchContainer, tabsSection);

  const searchInput = document.getElementById('ship-search');
  const filterButtons = document.querySelectorAll('.hw-filter-btn');
  let activeFilter = 'all';

  searchInput.addEventListener('input', debounce(() => {
    filterShips(searchInput.value, activeFilter);
  }, 300));

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.setAttribute('aria-pressed', 'false');
        b.classList.remove('active');
      });
      btn.setAttribute('aria-pressed', 'true');
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      filterShips(searchInput.value, activeFilter);
    });
  });
}

function filterShips(searchTerm, filterType) {
  const activeTree = document.querySelector('.hw-ship-tree.active');
  if (!activeTree) return;

  const cards = activeTree.querySelectorAll('.hw-ship-card');
  let visibleCount = 0;

  cards.forEach(card => {
    const name = card.querySelector('.hw-ship-name')?.textContent.toLowerCase() || '';
    const shipClass = card.querySelector('.hw-ship-class')?.textContent.toLowerCase() || '';
    const shipType = card.dataset.type || '';

    const matchesSearch = !searchTerm || name.includes(searchTerm.toLowerCase()) || shipClass.includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || shipType === filterType;

    if (matchesSearch && matchesFilter) {
      card.style.display = 'block';
      card.classList.add('ship-visible');
      visibleCount++;
    } else {
      card.style.display = 'none';
      card.classList.remove('ship-visible');
    }
  });

  // Show no results message
  const existingMessage = activeTree.querySelector('.hw-no-results');
  if (existingMessage) existingMessage.remove();

  if (visibleCount === 0 && (searchTerm || filterType !== 'all')) {
    const message = document.createElement('div');
    message.className = 'hw-no-results';
    message.setAttribute('role', 'status');
    message.setAttribute('aria-live', 'polite');
    message.textContent = 'No ships match your search criteria.';
    activeTree.appendChild(message);
  }
}

/* === FACTION TABS === */
function initFactionTabs() {
  const tabs = document.querySelectorAll('.hw-tab');
  const shipTrees = document.querySelectorAll('.hw-ship-tree');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const faction = tab.dataset.faction;
      
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      
      shipTrees.forEach(tree => {
        tree.classList.remove('active');
      });
      
      const activeTree = document.querySelector('#' + faction + '.hw-ship-tree');
      if (activeTree) {
        activeTree.classList.add('active');
        setTimeout(() => generateConnectors(activeTree), 100);
        
        // Clear search when faction changes
        const searchInput = document.getElementById('ship-search');
        if (searchInput) {
          searchInput.value = '';
          filterShips('', 'all');
        }
      }
    });
  });
}

/* === GENERATE CONNECTOR LINES === */
function generateConnectors(tree) {
  const container = tree.querySelector('.hw-tree-container');
  const sections = tree.querySelectorAll('.hw-tree-section');
  
  if (!container || sections.length < 2) return;
  
  container.querySelectorAll('.hw-tree-connector').forEach(c => c.remove());
  
  for (let i = 0; i < sections.length - 1; i++) {
    const currentSection = sections[i];
    const nextSection = sections[i + 1];
    
    const connector = document.createElement('div');
    connector.className = 'hw-tree-connector';
    connector.setAttribute('aria-hidden', 'true');
    
    const currentRect = currentSection.getBoundingClientRect();
    const nextRect = nextSection.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    const currentCenter = currentRect.left + currentRect.width - containerRect.left + container.scrollLeft;
    const nextCenter = nextRect.left - containerRect.left + container.scrollLeft;
    
    const currentSectionCenter = currentRect.top + (currentRect.height / 2) - containerRect.top + container.scrollTop;
    const nextSectionCenter = nextRect.top + (nextRect.height / 2) - containerRect.top + container.scrollTop;
    
    const verticalCenter = ((currentSectionCenter + nextSectionCenter) / 2) - 10;
    
    connector.style.left = currentCenter + 'px';
    connector.style.width = (nextCenter - currentCenter) + 'px';
    connector.style.top = verticalCenter + 'px';
    
    if (tree.id === 'taiidan') {
      connector.classList.add('taiidan-connector');
    }
    
    container.appendChild(connector);
  }
}

/* === SHIP NODES === */
function initShipNodes() {
  const nodes = document.querySelectorAll('.hw-ship-card');
  
  nodes.forEach(node => {
    node.setAttribute('role', 'button');
    node.setAttribute('tabindex', '0');
    
    const clickHandler = () => {
      const shipName = node.querySelector('.hw-ship-name').textContent;
      const shipClass = node.querySelector('.hw-ship-class').textContent;
      const isTaiidan = node.classList.contains('taiidan-card');
      openShipModal(shipName, shipClass, isTaiidan);
    };
    
    node.addEventListener('click', clickHandler);
    
    // Keyboard accessibility
    node.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        clickHandler();
      }
    });
  });
}

/* === SHIP MODAL === */
function createShipModal() {
  if (document.getElementById('ship-modal')) return;

  const modal = document.createElement('div');
  modal.className = 'hw-ship-modal';
  modal.id = 'ship-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-labelledby', 'ship-modal-title');
  modal.setAttribute('aria-hidden', 'true');
  
  modal.innerHTML = `
    <div class="hw-ship-modal-content">
      <button class="hw-ship-modal-close" aria-label="Close modal">✕</button>
      <div class="hw-ship-modal-body">
        <div class="hw-ship-modal-image">
          <span class="hw-ship-modal-icon"></span>
        </div>
        <div class="hw-ship-modal-info">
          <h2 class="hw-ship-modal-title" id="ship-modal-title"></h2>
          <span class="hw-ship-modal-class"></span>
          <p class="hw-ship-modal-desc"></p>
          
          <div class="hw-ship-modal-stats">
            <div class="hw-modal-stat">
              <span>HP</span>
              <div class="hw-modal-stat-bar"><span></span></div>
              <span class="hw-modal-stat-value"></span>
            </div>
            <div class="hw-modal-stat">
              <span>Firepower</span>
              <div class="hw-modal-stat-bar"><span></span></div>
              <span class="hw-modal-stat-value"></span>
            </div>
            <div class="hw-modal-stat">
              <span>Speed</span>
              <div class="hw-modal-stat-bar"><span></span></div>
              <span class="hw-modal-stat-value"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  modal.querySelector('.hw-ship-modal-close').addEventListener('click', closeShipModal);
  
  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      closeShipModal();
    }
  });
  
  // Close on background click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeShipModal();
    }
  });
}

function openShipModal(shipName, shipClass, isTaiidan) {
  const modal = document.getElementById('ship-modal');
  const titleEl = modal.querySelector('.hw-ship-modal-title');
  const classEl = modal.querySelector('.hw-ship-modal-class');
  
  titleEl.textContent = shipName;
  classEl.textContent = `Class: ${shipClass}`;
  
  modal.setAttribute('aria-hidden', 'false');
  modal.classList.add('active');
  
  // Prevent body scroll
  document.body.style.overflow = 'hidden';
  
  // Focus management
  const closeBtn = modal.querySelector('.hw-ship-modal-close');
  closeBtn.focus();
}

function closeShipModal() {
  const modal = document.getElementById('ship-modal');
  modal.setAttribute('aria-hidden', 'true');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}
