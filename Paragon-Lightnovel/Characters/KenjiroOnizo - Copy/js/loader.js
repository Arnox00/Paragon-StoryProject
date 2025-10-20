// ===== Paragon Wikia Character Profile Loader =====

// Initialize on page load
document.addEventListener("DOMContentLoaded", async () => {
  const sections = document.querySelectorAll("[data-section]");

  // Load each section's .txt file
  const loadSection = async (el) => {
    const sectionName = el.getAttribute("data-section");
    const filePath = `data/${sectionName}.txt`;

    try {
      const response = await fetch(filePath);
      if (!response.ok) throw new Error(`File not found: ${filePath}`);
      const text = await response.text();
      el.innerHTML = text;
    } catch (err) {
      el.innerHTML = `<p style="color:#f87171;">⚠️ Could not load content (${sectionName}.txt not found).</p>`;
      console.error(err);
    }
  };

  // Load all text files in sequence
  for (const el of sections) {
    await loadSection(el);
  }

  // ✅ Once everything is loaded, rebuild and animate the stats
  setupStats();
  
  // Initialize form toggle if present
  initFormToggle();
});

// Setup and animate stat bars
function setupStats() {
  const statsContainer = document.querySelector('[data-section="stats"]');
  if (!statsContainer) return;

  const statBlocks = statsContainer.querySelectorAll(".stat");

  // If stats are inside a grid, rebuild each entry with segmented bars (Fate/Stay Night style)
  if (statBlocks.length > 0) {
    statBlocks.forEach((stat) => {
      const label = stat.getAttribute('data-label');
      const rank = stat.getAttribute('data-rank');
      const segments = parseInt(stat.getAttribute('data-segments')) || 5;
      const filled = parseInt(stat.getAttribute('data-filled')) || 0;

      // Check if this is an EX rank stat (filled = 5 and rank = EX)
      const isEXRank = (filled === 5 && rank === 'EX');
      
      // Add special class for EX rank stats
      if (isEXRank) {
        stat.classList.add('stat-ex');
      }

      // Generate segments HTML
      let segmentsHTML = '';
      for (let i = 0; i < segments; i++) {
        const segmentClass = i < filled ? 'stat-segment filled' : 'stat-segment empty';
        segmentsHTML += `<div class="${segmentClass}"></div>`;
      }

      // NEW STRUCTURE: Label on top, then Bar + Rank
      stat.innerHTML = `
        <div class="stat-label-header">${label}</div>
        <div class="stat-bar-wrapper">
          <div class="stat-bar-container">
            <div class="stat-bar">
              ${segmentsHTML}
            </div>
          </div>
          <span class="stat-bar-rank">${rank}</span>
        </div>
      `;
    });
  }
  
  console.log('Stats setup complete!'); // Debug log
}

// Initialize form toggle functionality (for characters with multiple forms)
function initFormToggle() {
  const toggleButton = document.querySelector('.form-toggle');
  if (!toggleButton) return; // Skip if no toggle button exists

  toggleButton.addEventListener('click', toggleForm);
}

// Toggle between character forms
function toggleForm() {
  const human = document.getElementById('humanForm');
  const oni = document.getElementById('oniForm');
  const button = document.querySelector('.form-toggle');
  
  if (!human || !oni || !button) return;
  
  const oniVisible = oni.style.display === 'block';
  
  if (oniVisible) {
    oni.style.display = 'none';
    human.style.display = 'block';
    button.textContent = 'Switch to Onizō Form';
  } else {
    oni.style.display = 'block';
    human.style.display = 'none';
    button.textContent = 'Switch to Human Form';
  }
}