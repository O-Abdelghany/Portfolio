// Cache bust v2
export function initNeuralMap() {
  console.log('Neural map init called - v2');
  try {
    initDesktop();
  } catch(e) {
    console.error('Desktop init error:', e);
  }
  try {
    initMobile();
  } catch(e) {
    console.error('Mobile init error:', e);
  }
}

function initDesktop() {
  console.log('Desktop init starting');
  const svg = document.getElementById('neural-svg');
  const connGroup = document.getElementById('neural-connections');
  const nodeGroup = document.getElementById('neural-nodes');
  
  console.log('SVG:', svg);
  console.log('connGroup:', connGroup);
  console.log('nodeGroup:', nodeGroup);
  
  if (!svg || !connGroup || !nodeGroup) {
    console.warn('Missing SVG elements');
    return;
  }
  
  // Test: draw a simple circle
  const testCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  testCircle.setAttribute('cx', '500');
  testCircle.setAttribute('cy', '280');
  testCircle.setAttribute('r', '50');
  testCircle.setAttribute('fill', '#a855f7');
  testCircle.setAttribute('stroke', '#ffffff');
  testCircle.setAttribute('stroke-width', '2');
  nodeGroup.appendChild(testCircle);
  
  console.log('Test circle added');
}

function initMobile() {
  console.log('Mobile init starting');
  const inputsEl = document.getElementById('mobile-inputs');
  const cardsEl = document.getElementById('mobile-project-cards');
  
  if (!inputsEl || !cardsEl) {
    console.warn('Missing mobile elements');
    return;
  }
  
  inputsEl.innerHTML = '<span class="text-white">Mobile test</span>';
  cardsEl.innerHTML = '<div class="text-white">Mobile cards test</div>';
  
  console.log('Mobile content added');
}
