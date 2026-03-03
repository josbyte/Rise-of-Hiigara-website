/* =========================================
   SHIP CLASSES PAGE - JavaScript
   Tab switching and ship card interactions
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
  initFactionTabs();
  initShipNodes();
  createShipModal();
  
  // Generate connectors for default faction
  const defaultTree = document.querySelector('.hw-ship-tree.active');
  if (defaultTree) {
    setTimeout(() => generateConnectors(defaultTree), 100);
  }
  
  // Update on window resize
  window.addEventListener('resize', () => {
    const activeTree = document.querySelector('.hw-ship-tree.active');
    if (activeTree) {
      generateConnectors(activeTree);
    }
  });
});

/* === FACTION TABS === */
function initFactionTabs() {
  const tabs = document.querySelectorAll('.hw-tab');
  const shipTrees = document.querySelectorAll('.hw-ship-tree');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const faction = tab.dataset.faction;
      
      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Show corresponding ship tree
      shipTrees.forEach(tree => {
        tree.classList.remove('active');
        if (tree.id === faction) {
          tree.classList.add('active');
          // Generate connector lines after tree is shown
          setTimeout(() => generateConnectors(tree), 100);
        }
      });
    });
  });
}

/* === GENERATE CONNECTOR LINES === */
function generateConnectors(tree) {
  const container = tree.querySelector('.hw-tree-container');
  const sections = tree.querySelectorAll('.hw-tree-section');
  
  // Remove existing connectors
  container.querySelectorAll('.hw-tree-connector').forEach(c => c.remove());
  
  // Create connector between each section
  for (let i = 0; i < sections.length - 1; i++) {
    const currentSection = sections[i];
    const nextSection = sections[i + 1];
    
    const connector = document.createElement('div');
    connector.className = 'hw-tree-connector';
    
    // Calculate position
    const currentRect = currentSection.getBoundingClientRect();
    const nextRect = nextSection.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    const currentCenter = currentRect.left + currentRect.width - containerRect.left + container.scrollLeft;
    const nextCenter = nextRect.left - containerRect.left + container.scrollLeft;
    
    // Calculate vertical center of the sections
    const currentSectionCenter = currentRect.top + (currentRect.height / 2) - containerRect.top + container.scrollTop;
    const nextSectionCenter = nextRect.top + (nextRect.height / 2) - containerRect.top + container.scrollTop;
    
    // Use the average vertical center of both sections, with a slight offset upward
    const verticalCenter = ((currentSectionCenter + nextSectionCenter) / 2) - 10;
    
    connector.style.left = currentCenter + 'px';
    connector.style.width = (nextCenter - currentCenter) + 'px';
    connector.style.top = verticalCenter + 'px';
    
    // Add Taiidan class if it's taiidan tree
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
    node.addEventListener('click', () => {
      const shipName = node.querySelector('.hw-ship-name').textContent;
      const shipClass = node.querySelector('.hw-ship-class').textContent;
      const isTaiidan = node.querySelector('.hw-ship-card').classList.contains('taiidan-card');
      
      openShipModal(shipName, shipClass, isTaiidan);
    });
  });
}

/* === SHIP MODAL === */
function createShipModal() {
  const modal = document.createElement('div');
  modal.className = 'hw-ship-modal';
  modal.id = 'ship-modal';
  
  modal.innerHTML = `
    <div class="hw-ship-modal-content">
      <button class="hw-ship-modal-close" onclick="closeShipModal()">✕</button>
      <div class="hw-ship-modal-body">
        <div class="hw-ship-modal-image">
          <span class="hw-ship-modal-icon"></span>
        </div>
        <div class="hw-ship-modal-info">
          <h2 class="hw-ship-modal-title"></h2>
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
  
  // Close on background click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeShipModal();
    }
  });
  
  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeShipModal();
    }
  });
}

function openShipModal(name, shipClass, isTaiidan) {
  const modal = document.getElementById('ship-modal');
  if (!modal) return;
  
  const color = isTaiidan ? 'var(--hw-blue)' : 'var(--hw-orange)';
  const gradient = isTaiidan 
    ? 'linear-gradient(90deg, var(--hw-blue), var(--hw-blue-glow))'
    : 'linear-gradient(90deg, var(--hw-orange), var(--hw-orange-glow))';
  
  // Set basic info
  modal.querySelector('.hw-ship-modal-title').textContent = name;
  modal.querySelector('.hw-ship-modal-title').style.color = color;
  modal.querySelector('.hw-ship-modal-class').textContent = shipClass;
  modal.querySelector('.hw-ship-modal-class').style.color = color;
  
  // Set icon based on ship class
  const iconMap = {
    'Mothership': '🚀',
    'Flagship': '🚀',
    'Battlecruiser': '🚢',
    'Heavy Cruiser': '🚢',
    'Destroyer': '🚢',
    'Capital': '🚢',
    'Carrier': '🛳',
    'Frigate': '🔷',
    'Corvette': '🔹',
    'Fighter': '⚡',
    'Support': '⚙'
  };
  const icon = iconMap[shipClass] || '🚀';
  modal.querySelector('.hw-ship-modal-icon').textContent = icon;
  
  // Set description
  const descriptions = {
    'Resource Collector': {
      text: 'Harvests resources from asteroids and dust clouds to fund fleet operations.',
      stats: { hp: 15, firepower: 0, speed: 40 }
    },
    'Interceptor': {
      text: 'Fast dogfighter designed to eliminate enemy strike craft with rapid-fire weapons.',
      stats: { hp: 8, firepower: 15, speed: 100 }
    },
    'Scout': {
      text: 'Fast reconnaissance craft with enhanced sensor capabilities.',
      stats: { hp: 5, firepower: 8, speed: 100 }
    },
    'Defender': {
      text: 'Point defense fighter with rapid-fire weapons.',
      stats: { hp: 10, firepower: 12, speed: 85 }
    },
    'Gunship': {
      text: 'Anti-strike craft escort with rapid-fire guns.',
      stats: { hp: 20, firepower: 30, speed: 75 }
    },
    'Pulsar': {
      text: 'Anti-frigate corvette with pulsar beams.',
      stats: { hp: 18, firepower: 40, speed: 70 }
    },
    'Minelayer': {
      text: 'Deploy explosive mines to deny areas to enemy ships.',
      stats: { hp: 22, firepower: 15, speed: 65 }
    },
    'Light Corvette': {
      text: 'Fast escort craft with rapid-fire mass drivers.',
      stats: { hp: 18, firepower: 25, speed: 80 }
    },
    'Heavy Corvette': {
      text: 'Heavily armed corvette with dual mass driver turrets.',
      stats: { hp: 25, firepower: 45, speed: 60 }
    },
    'Multi-Gun': {
      text: 'Anti-fighter specialist with multiple turreted guns.',
      stats: { hp: 22, firepower: 35, speed: 70 }
    },
    'Ion Frigate': {
      text: 'Specialized anti-capital ship with a powerful ion beam.',
      stats: { hp: 35, firepower: 75, speed: 45 }
    },
    'CCR Interceptor': {
      text: 'Light fighter used by the CCR pirates, fast and maneuverable.',
      stats: { hp: 8, firepower: 12, speed: 110 }
    },
    'Kushan Freighter Corvette': {
      text: 'Cargo vessel adapted for raiding; favourite prize of the CCR.',
      stats: { hp: 30, firepower: 5, speed: 40 }
    },
    'Large Transport': {
      text: 'Massive transport used to shuttle goods between CCR strongholds.',
      stats: { hp: 25, firepower: 0, speed: 30 }
    },
    'Assault Frigate': {
      text: 'Multi-role combat ship with kinetic and missile weapons.',
      stats: { hp: 45, firepower: 50, speed: 50 }
    },
    'Torpedo Frigate': {
      text: 'Long-range strike vessel with devastating torpedoes.',
      stats: { hp: 30, firepower: 65, speed: 55 }
    },
    'Marine Frigate': {
      text: 'Capture enemy vessels with boarding parties.',
      stats: { hp: 40, firepower: 10, speed: 50 }
    },
    'Ion Array': {
      text: 'Advanced ion platform with superior range and damage output.',
      stats: { hp: 30, firepower: 80, speed: 40 }
    },
    'Defense Frigate': {
      text: 'Escort vessel with advanced point defense systems.',
      stats: { hp: 40, firepower: 35, speed: 50 }
    },
    'Field Frigate': {
      text: 'Generates protective energy fields for nearby ships.',
      stats: { hp: 35, firepower: 5, speed: 45 }
    },
    'Destroyer': {
      text: 'Balanced warship with dual ion beams and kinetic turrets.',
      stats: { hp: 65, firepower: 70, speed: 35 }
    },
    'Carrier': {
      text: 'Mobile production facility for strike craft and frigates.',
      stats: { hp: 70, firepower: 20, speed: 20 }
    },
    'Battlecruiser': {
      text: 'Heavy assault ship with devastating ion cannons and missile batteries.',
      stats: { hp: 85, firepower: 90, speed: 25 }
    },
    'Heavy Cruiser': {
      text: 'The pride of the Taiidan fleet. Mounts devastating ion arrays and heavy missile launchers.',
      stats: { hp: 95, firepower: 100, speed: 20 }
    },
    'Mothership': {
      text: 'The heart of the fleet. Capable of producing all ship classes and supporting massive fleet operations.',
      stats: { hp: 100, firepower: 15, speed: 5 }
    }
  };
  
  const shipData = descriptions[name] || {
    text: 'A versatile ship in the fleet.',
    stats: { hp: 50, firepower: 50, speed: 50 }
  };
  
  modal.querySelector('.hw-ship-modal-desc').textContent = shipData.text;
  
  // Set stats
  const statBars = modal.querySelectorAll('.hw-modal-stat-bar span');
  const statValues = modal.querySelectorAll('.hw-modal-stat-value');
  
  const statKeys = ['hp', 'firepower', 'speed'];
  statKeys.forEach((key, i) => {
    const value = shipData.stats[key];
    statBars[i].style.width = '0%';
    statBars[i].style.background = gradient;
    statValues[i].textContent = value + '%';
    
    setTimeout(() => {
      statBars[i].style.width = value + '%';
    }, 100);
  });
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeShipModal() {
  const modal = document.getElementById('ship-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Make closeShipModal available globally
window.closeShipModal = closeShipModal;