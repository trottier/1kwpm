// Get HTML elements
const audioFileInput = document.getElementById('audioFileInput');
const audioElement = document.getElementById('audioElement');
const speedControl = document.getElementById('speedControl');
const speedValue = document.getElementById('speedValue');

// Noise Reduction
const noiseReduction = document.getElementById('noiseReduction');
const noiseReductionLevel = document.getElementById('noiseReductionLevel');
const noiseReductionValue = document.getElementById('noiseReductionValue');

// Phase Vocoder
const phaseVocoder = document.getElementById('phaseVocoder');
const phaseVocoderLevel = document.getElementById('phaseVocoderLevel');
const phaseVocoderValue = document.getElementById('phaseVocoderValue');

// Formant Preservation
const formantPreservation = document.getElementById('formantPreservation');
const formantPreservationLevel = document.getElementById('formantPreservationLevel');
const formantPreservationValue = document.getElementById('formantPreservationValue');

// Dynamic Equalization
const dynamicEqualization = document.getElementById('dynamicEqualization');
const dynamicEqIntensity = document.getElementById('dynamicEqIntensity');
const dynamicEqIntensityValue = document.getElementById('dynamicEqIntensityValue');

// Psychoacoustic Modeling
const psychoacousticModeling = document.getElementById('psychoacousticModeling');
const psychoacousticModelingLevel = document.getElementById('psychoacousticModelingLevel');
const psychoacousticModelingValue = document.getElementById('psychoacousticModelingValue');

// Spectral Shaping
const spectralShaping = document.getElementById('spectralShaping');
const spectralShapingLevel = document.getElementById('spectralShapingLevel');
const spectralShapingValue = document.getElementById('spectralShapingValue');

// Transient Enhancement
const transientEnhancement = document.getElementById('transientEnhancement');
const transientEnhancementLevel = document.getElementById('transientEnhancementLevel');
const transientEnhancementValue = document.getElementById('transientEnhancementValue');

// Automatic Gain Control
const automaticGainControl = document.getElementById('automaticGainControl');
const agcTargetLevel = document.getElementById('agcTargetLevel');
const agcTargetValue = document.getElementById('agcTargetValue');

// Consonant Emphasis
const consonantEmphasis = document.getElementById('consonantEmphasis');
const emphasisFrequency = document.getElementById('emphasisFrequency');
const emphasisGain = document.getElementById('emphasisGain');
const emphasisFreqValue = document.getElementById('emphasisFreqValue');
const emphasisGainValue = document.getElementById('emphasisGainValue');

// Temporal Smoothing
const temporalSmoothing = document.getElementById('temporalSmoothing');
const temporalSmoothingLevel = document.getElementById('temporalSmoothingLevel');
const temporalSmoothingValue = document.getElementById('temporalSmoothingValue');

// Frequency Compression
const frequencyCompression = document.getElementById('frequencyCompression');
const frequencyCompressionLevel = document.getElementById('frequencyCompressionLevel');
const frequencyCompressionValue = document.getElementById('frequencyCompressionValue');

// Dynamic Range Compression
const dynamicCompression = document.getElementById('dynamicCompression');
const compressionThreshold = document.getElementById('compressionThreshold');
const compressionRatio = document.getElementById('compressionRatio');
const compressionThresholdValue = document.getElementById('compressionThresholdValue');
const compressionRatioValue = document.getElementById('compressionRatioValue');

// Save and Load Settings
const saveSettingsButton = document.getElementById('saveSettings');
const loadSettingsButton = document.getElementById('loadSettings');
// Web Audio API context and nodes
let audioContext;
let sourceNode;
let gainNode;

// Noise Reduction
let noiseReductionNode;

// Automatic Gain Control
let agcNode;

// Dynamic Range Compression
let compressorNode;

// Phase Vocoder (Simplified)
let phaseVocoderNode;

// Formant Preservation
let formantPreservationNode;

// Temporal Smoothing
let temporalSmoothingNode;

// Dynamic Equalization
let dynamicEqFilters = [];

// Spectral Shaping
let spectralShapingNode;

// Consonant Emphasis
let consonantEmphasisNode;

// Frequency Compression
let frequencyCompressionNode;

// Transient Enhancement
let transientEnhancementNode;

// Psychoacoustic Modeling
let psychoacousticNode;

// Initialize audio context and nodes
function initAudio() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // Create source node from the audio element
  sourceNode = audioContext.createMediaElementSource(audioElement);

  // Create gain node
  gainNode = audioContext.createGain();

  // Noise Reduction Node
  noiseReductionNode = audioContext.createBiquadFilter();
  noiseReductionNode.type = 'lowpass';

  // Automatic Gain Control Node
  agcNode = audioContext.createGain();

  // Dynamic Range Compression Node
  compressorNode = audioContext.createDynamicsCompressor();

  // Phase Vocoder Node (Simplified)
  phaseVocoderNode = audioContext.createDelay();

  // Formant Preservation Node
  formantPreservationNode = audioContext.createBiquadFilter();
  formantPreservationNode.type = 'allpass';

  // Temporal Smoothing Node
  temporalSmoothingNode = audioContext.createBiquadFilter();
  temporalSmoothingNode.type = 'lowpass';

  // Initialize Dynamic Equalization filters
  initDynamicEqualizationFilters();

  // Spectral Shaping Node
  spectralShapingNode = audioContext.createBiquadFilter();
  spectralShapingNode.type = 'peaking';

  // Consonant Emphasis Node
  consonantEmphasisNode = audioContext.createBiquadFilter();
  consonantEmphasisNode.type = 'peaking';

  // Frequency Compression Node
  frequencyCompressionNode = audioContext.createWaveShaper();

  // Transient Enhancement Node
  transientEnhancementNode = audioContext.createDynamicsCompressor();

  // Psychoacoustic Modeling Node
  psychoacousticNode = audioContext.createWaveShaper();

  // Connect source node to gain node
  sourceNode.connect(gainNode);

  // Set up initial audio routing
  updateAudioRouting();
}

// Initialize Dynamic Equalization filters
function initDynamicEqualizationFilters() {
  const frequencies = [250, 500, 1000, 2000, 4000, 8000];
  dynamicEqFilters = frequencies.map(frequency => {
    const filter = audioContext.createBiquadFilter();
    filter.type = 'peaking';
    filter.frequency.setValueAtTime(frequency, audioContext.currentTime);
    filter.Q.setValueAtTime(1, audioContext.currentTime);
    filter.gain.setValueAtTime(0, audioContext.currentTime);
    return filter;
  });
}

// Update audio routing based on current settings
function updateAudioRouting() {
  // Disconnect nodes
  gainNode.disconnect();
  noiseReductionNode.disconnect();
  agcNode.disconnect();
  compressorNode.disconnect();
  phaseVocoderNode.disconnect();
  formantPreservationNode.disconnect();
  temporalSmoothingNode.disconnect();
  dynamicEqFilters.forEach(filter => filter.disconnect());
  spectralShapingNode.disconnect();
  consonantEmphasisNode.disconnect();
  frequencyCompressionNode.disconnect();
  transientEnhancementNode.disconnect();
  psychoacousticNode.disconnect();

  let currentNode = gainNode;

  // 1. Noise Reduction
  if (noiseReduction.checked) {
    let frequency = 20000 - (noiseReductionLevel.value / 100) * 20000;
    frequency = Math.max(frequency, 20);
    noiseReductionNode.frequency.setValueAtTime(frequency, audioContext.currentTime);
    currentNode.connect(noiseReductionNode);
    currentNode = noiseReductionNode;
  }

  // 2. Automatic Gain Control
  if (automaticGainControl.checked) {
    agcNode.gain.setValueAtTime(agcTargetLevel.value, audioContext.currentTime);
    currentNode.connect(agcNode);
    currentNode = agcNode;
  }

  // 3. Dynamic Range Compression
  if (dynamicCompression.checked) {
    compressorNode.threshold.setValueAtTime(compressionThreshold.value, audioContext.currentTime);
    compressorNode.ratio.setValueAtTime(compressionRatio.value, audioContext.currentTime);
    compressorNode.attack.setValueAtTime(0.003, audioContext.currentTime);
    compressorNode.release.setValueAtTime(0.25, audioContext.currentTime);
    currentNode.connect(compressorNode);
    currentNode = compressorNode;
  }

  // 4. Phase Vocoder (Simplified)
  if (phaseVocoder.checked) {
    let delayTime = (phaseVocoderLevel.value - 1) * 0.05;
    phaseVocoderNode.delayTime.setValueAtTime(delayTime, audioContext.currentTime);
    currentNode.connect(phaseVocoderNode);
    currentNode = phaseVocoderNode;
  }

  // 5. Formant Preservation
  if (formantPreservation.checked) {
    formantPreservationNode.frequency.setValueAtTime(1000 * formantPreservationLevel.value, audioContext.currentTime);
    currentNode.connect(formantPreservationNode);
    currentNode = formantPreservationNode;
  }

  // 6. Temporal Smoothing
  if (temporalSmoothing.checked) {
    let smoothingFrequency = 20000 - (temporalSmoothingLevel.value / 100) * 20000;
    smoothingFrequency = Math.max(smoothingFrequency, 20);
    temporalSmoothingNode.frequency.setValueAtTime(smoothingFrequency, audioContext.currentTime);
    currentNode.connect(temporalSmoothingNode);
    currentNode = temporalSmoothingNode;
  }

  // 7. Dynamic Equalization
  if (dynamicEqualization.checked) {
    dynamicEqFilters.forEach(filter => {
      filter.gain.setValueAtTime((dynamicEqIntensity.value - 1) * 10, audioContext.currentTime);
    });
    dynamicEqFilters.reduce((prevNode, currentFilter) => {
      prevNode.connect(currentFilter);
      return currentFilter;
    }, currentNode);
    currentNode = dynamicEqFilters[dynamicEqFilters.length - 1];
  }

  // 8. Spectral Shaping
  if (spectralShaping.checked) {
    spectralShapingNode.frequency.setValueAtTime(1500, audioContext.currentTime);
    spectralShapingNode.gain.setValueAtTime((spectralShapingLevel.value - 1) * 10, audioContext.currentTime);
    spectralShapingNode.Q.setValueAtTime(1, audioContext.currentTime);
    currentNode.connect(spectralShapingNode);
    currentNode = spectralShapingNode;
  }

  // 9. Consonant Emphasis
  if (consonantEmphasis.checked) {
    consonantEmphasisNode.frequency.setValueAtTime(emphasisFrequency.value, audioContext.currentTime);
    consonantEmphasisNode.gain.setValueAtTime(emphasisGain.value, audioContext.currentTime);
    consonantEmphasisNode.Q.setValueAtTime(1, audioContext.currentTime);
    currentNode.connect(consonantEmphasisNode);
    currentNode = consonantEmphasisNode;
  }

  // 10. Frequency Compression
  if (frequencyCompression.checked) {
    frequencyCompressionNode.curve = makeFrequencyCompressorCurve(frequencyCompressionLevel.value);
    currentNode.connect(frequencyCompressionNode);
    currentNode = frequencyCompressionNode;
  }

  // 11. Transient Enhancement
  if (transientEnhancement.checked) {
    transientEnhancementNode.threshold.setValueAtTime(-50, audioContext.currentTime);
    transientEnhancementNode.ratio.setValueAtTime(20 * transientEnhancementLevel.value, audioContext.currentTime);
    transientEnhancementNode.attack.setValueAtTime(0.001, audioContext.currentTime);
    transientEnhancementNode.release.setValueAtTime(0.05, audioContext.currentTime);
    currentNode.connect(transientEnhancementNode);
    currentNode = transientEnhancementNode;
  }

  // 12. Psychoacoustic Modeling
  if (psychoacousticModeling.checked) {
    psychoacousticNode.curve = makePsychoacousticCurve(psychoacousticModelingLevel.value);
    currentNode.connect(psychoacousticNode);
    currentNode = psychoacousticNode;
  }

  // Connect to audio context destination
  currentNode.connect(audioContext.destination);
}

// Functions to create curves for custom nodes
function makePsychoacousticCurve(intensity) {
  let numSamples = 44100;
  let curve = new Float32Array(numSamples);
  for (let i = 0; i < numSamples; ++i) {
    let x = (i * 2) / numSamples - 1;
    curve[i] = Math.tanh(intensity * x);
  }
  return curve;
}

function makeFrequencyCompressorCurve(compressionLevel) {
  let numSamples = 44100;
  let curve = new Float32Array(numSamples);
  let x;
  for (let i = 0; i < numSamples; ++i) {
    x = i * 2 / numSamples - 1;
    curve[i] = Math.sign(x) * Math.pow(Math.abs(x), 1 / compressionLevel);
  }
  return curve;
}

// Initialize audio context when user interacts
function initializeAudioContext() {
  if (!audioContext) {
    initAudio();
  }
}

// Event listener for file input
audioFileInput.addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (file) {
    const fileURL = URL.createObjectURL(file);
    audioElement.src = fileURL;
    audioElement.load();
    initializeAudioContext();
  }
});

// Event listener to resume audio context on play
audioElement.addEventListener('play', function () {
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume();
  }
});

// Event listener for playback speed control
speedControl.addEventListener('input', function () {
  const playbackRate = parseFloat(this.value);
  audioElement.playbackRate = playbackRate;
  speedValue.textContent = playbackRate.toFixed(1) + 'x';
});

// Event listeners for Noise Reduction
noiseReduction.addEventListener('change', function () {
  updateAudioRouting();
  updateCheckboxLabels();
});

noiseReductionLevel.addEventListener('input', function () {
  noiseReductionValue.textContent = noiseReductionLevel.value;
  updateAudioRouting();
});

// Event listeners for Phase Vocoder
phaseVocoder.addEventListener('change', function () {
  updateAudioRouting();
  updateCheckboxLabels();
});

phaseVocoderLevel.addEventListener('input', function () {
  phaseVocoderValue.textContent = phaseVocoderLevel.value;
  updateAudioRouting();
});

// Event listeners for Formant Preservation
formantPreservation.addEventListener('change', function () {
  updateAudioRouting();
  updateCheckboxLabels();
});

formantPreservationLevel.addEventListener('input', function () {
  formantPreservationValue.textContent = formantPreservationLevel.value;
  updateAudioRouting();
});

// Event listeners for Dynamic Equalization
dynamicEqualization.addEventListener('change', function () {
  updateAudioRouting();
  updateCheckboxLabels();
});

dynamicEqIntensity.addEventListener('input', function () {
  dynamicEqIntensityValue.textContent = dynamicEqIntensity.value;
  updateAudioRouting();
});

// Event listeners for Psychoacoustic Modeling
psychoacousticModeling.addEventListener('change', function () {
  updateAudioRouting();
  updateCheckboxLabels();
});

psychoacousticModelingLevel.addEventListener('input', function () {
  psychoacousticModelingValue.textContent = psychoacousticModelingLevel.value;
  updateAudioRouting();
});

// Event listeners for Spectral Shaping
spectralShaping.addEventListener('change', function () {
  updateAudioRouting();
  updateCheckboxLabels();
});

spectralShapingLevel.addEventListener('input', function () {
  spectralShapingValue.textContent = spectralShapingLevel.value;
  updateAudioRouting();
});

// Event listeners for Transient Enhancement
transientEnhancement.addEventListener('change', function () {
  updateAudioRouting();
  updateCheckboxLabels();
});

transientEnhancementLevel.addEventListener('input', function () {
  transientEnhancementValue.textContent = transientEnhancementLevel.value;
  updateAudioRouting();
});

// Event listeners for Automatic Gain Control
automaticGainControl.addEventListener('change', function () {
  updateAudioRouting();
  updateCheckboxLabels();
});

agcTargetLevel.addEventListener('input', function () {
  agcTargetValue.textContent = agcTargetLevel.value;
  updateAudioRouting();
});

// Event listeners for Consonant Emphasis
consonantEmphasis.addEventListener('change', function () {
  updateAudioRouting();
  updateCheckboxLabels();
});

emphasisFrequency.addEventListener('input', function () {
  emphasisFreqValue.textContent = emphasisFrequency.value;
  updateAudioRouting();
});

emphasisGain.addEventListener('input', function () {
  emphasisGainValue.textContent = emphasisGain.value;
  updateAudioRouting();
});

// Event listeners for Temporal Smoothing
temporalSmoothing.addEventListener('change', function () {
  updateAudioRouting();
  updateCheckboxLabels();
});

temporalSmoothingLevel.addEventListener('input', function () {
  temporalSmoothingValue.textContent = temporalSmoothingLevel.value;
  updateAudioRouting();
});

// Event listeners for Frequency Compression
frequencyCompression.addEventListener('change', function () {
  updateAudioRouting();
  updateCheckboxLabels();
});

frequencyCompressionLevel.addEventListener('input', function () {
  frequencyCompressionValue.textContent = frequencyCompressionLevel.value;
  updateAudioRouting();
});

// Event listeners for Dynamic Range Compression
dynamicCompression.addEventListener('change', function () {
  updateAudioRouting();
  updateCheckboxLabels();
});

compressionThreshold.addEventListener('input', function () {
  compressionThresholdValue.textContent = compressionThreshold.value;
  updateAudioRouting();
});

compressionRatio.addEventListener('input', function () {
  compressionRatioValue.textContent = compressionRatio.value;
  updateAudioRouting();
});

// Function to update checkbox labels
function updateCheckboxLabels() {
  const filters = [
    { checkbox: noiseReduction, label: 'noiseReduction' },
    { checkbox: phaseVocoder, label: 'phaseVocoder' },
    { checkbox: formantPreservation, label: 'formantPreservation' },
    { checkbox: dynamicEqualization, label: 'dynamicEqualization' },
    { checkbox: psychoacousticModeling, label: 'psychoacousticModeling' },
    { checkbox: spectralShaping, label: 'spectralShaping' },
    { checkbox: transientEnhancement, label: 'transientEnhancement' },
    { checkbox: automaticGainControl, label: 'automaticGainControl' },
    { checkbox: consonantEmphasis, label: 'consonantEmphasis' },
    { checkbox: temporalSmoothing, label: 'temporalSmoothing' },
    { checkbox: frequencyCompression, label: 'frequencyCompression' },
    { checkbox: dynamicCompression, label: 'dynamicCompression' },
  ];

  filters.forEach(filter => {
    const status = filter.checkbox.checked ? 'Enabled' : 'Disabled';
    document.querySelector(`label[for="${filter.label}"] .setting-value`).textContent = `(${status})`;
  });
}

// Initialize displayed values on page load
updateCheckboxLabels();
noiseReductionValue.textContent = noiseReductionLevel.value;
phaseVocoderValue.textContent = phaseVocoderLevel.value;
formantPreservationValue.textContent = formantPreservationLevel.value;
dynamicEqIntensityValue.textContent = dynamicEqIntensity.value;
psychoacousticModelingValue.textContent = psychoacousticModelingLevel.value;
spectralShapingValue.textContent = spectralShapingLevel.value;
transientEnhancementValue.textContent = transientEnhancementLevel.value;
agcTargetValue.textContent = agcTargetLevel.value;
emphasisFreqValue.textContent = emphasisFrequency.value;
emphasisGainValue.textContent = emphasisGain.value;
temporalSmoothingValue.textContent = temporalSmoothingLevel.value;
frequencyCompressionValue.textContent = frequencyCompressionLevel.value;
compressionThresholdValue.textContent = compressionThreshold.value;
compressionRatioValue.textContent = compressionRatio.value;

// Save and Load Settings
saveSettingsButton.addEventListener('click', saveSettings);
loadSettingsButton.addEventListener('click', loadSettings);

function saveSettings() {
  const settings = {
    playbackRate: speedControl.value,
    noiseReduction: noiseReduction.checked,
    noiseReductionLevel: noiseReductionLevel.value,
    phaseVocoder: phaseVocoder.checked,
    phaseVocoderLevel: phaseVocoderLevel.value,
    formantPreservation: formantPreservation.checked,
    formantPreservationLevel: formantPreservationLevel.value,
    dynamicEqualization: dynamicEqualization.checked,
    dynamicEqIntensity: dynamicEqIntensity.value,
    psychoacousticModeling: psychoacousticModeling.checked,
    psychoacousticModelingLevel: psychoacousticModelingLevel.value,
    spectralShaping: spectralShaping.checked,
    spectralShapingLevel: spectralShapingLevel.value,
    transientEnhancement: transientEnhancement.checked,
    transientEnhancementLevel: transientEnhancementLevel.value,
    automaticGainControl: automaticGainControl.checked,
    agcTargetLevel: agcTargetLevel.value,
    consonantEmphasis: consonantEmphasis.checked,
    emphasisFrequency: emphasisFrequency.value,
    emphasisGain: emphasisGain.value,
    temporalSmoothing: temporalSmoothing.checked,
    temporalSmoothingLevel: temporalSmoothingLevel.value,
    frequencyCompression: frequencyCompression.checked,
    frequencyCompressionLevel: frequencyCompressionLevel.value,
    dynamicCompression: dynamicCompression.checked,
    compressionThreshold: compressionThreshold.value,
    compressionRatio: compressionRatio.value,
  };
  localStorage.setItem('audioPlayerSettings', JSON.stringify(settings));
  alert('Settings saved successfully!');
}

function loadSettings() {
  const settings = JSON.parse(localStorage.getItem('audioPlayerSettings'));
  if (settings) {
    // Playback rate
    speedControl.value = settings.playbackRate;
    audioElement.playbackRate = parseFloat(settings.playbackRate);
    speedValue.textContent = parseFloat(settings.playbackRate).toFixed(1) + 'x';

    // Noise Reduction
    noiseReduction.checked = settings.noiseReduction;
    noiseReductionLevel.value = settings.noiseReductionLevel;
    noiseReductionValue.textContent = settings.noiseReductionLevel;

    // Phase Vocoder
    phaseVocoder.checked = settings.phaseVocoder;
    phaseVocoderLevel.value = settings.phaseVocoderLevel;
    phaseVocoderValue.textContent = settings.phaseVocoderLevel;


    // Formant Preservation
    formantPreservation.checked = settings.formantPreservation;
    formantPreservationLevel.value = settings.formantPreservationLevel;
    formantPreservationValue.textContent = settings.formantPreservationLevel;

    // Dynamic Equalization
    dynamicEqualization.checked = settings.dynamicEqualization;
    dynamicEqIntensity.value = settings.dynamicEqIntensity;
    dynamicEqIntensityValue.textContent = settings.dynamicEqIntensity;

    // Psychoacoustic Modeling
    psychoacousticModeling.checked = settings.psychoacousticModeling;
    psychoacousticModelingLevel.value = settings.psychoacousticModelingLevel;
    psychoacousticModelingValue.textContent = settings.psychoacousticModelingLevel;

    // Spectral Shaping
    spectralShaping.checked = settings.spectralShaping;
    spectralShapingLevel.value = settings.spectralShapingLevel;
    spectralShapingValue.textContent = settings.spectralShapingLevel;

    // Transient Enhancement
    transientEnhancement.checked = settings.transientEnhancement;
    transientEnhancementLevel.value = settings.transientEnhancementLevel;
    transientEnhancementValue.textContent = settings.transientEnhancementLevel;

    // Automatic Gain Control
    automaticGainControl.checked = settings.automaticGainControl;
    agcTargetLevel.value = settings.agcTargetLevel;
    agcTargetValue.textContent = settings.agcTargetLevel;

    // Consonant Emphasis
    consonantEmphasis.checked = settings.consonantEmphasis;
    emphasisFrequency.value = settings.emphasisFrequency;
    emphasisFreqValue.textContent = settings.emphasisFrequency;
    emphasisGain.value = settings.emphasisGain;
    emphasisGainValue.textContent = settings.emphasisGain;

    // Temporal Smoothing
    temporalSmoothing.checked = settings.temporalSmoothing;
    temporalSmoothingLevel.value = settings.temporalSmoothingLevel;
    temporalSmoothingValue.textContent = settings.temporalSmoothingLevel;

    // Frequency Compression
    frequencyCompression.checked = settings.frequencyCompression;
    frequencyCompressionLevel.value = settings.frequencyCompressionLevel;
    frequencyCompressionValue.textContent = settings.frequencyCompressionLevel;

    // Dynamic Range Compression
    dynamicCompression.checked = settings.dynamicCompression;
    compressionThreshold.value = settings.compressionThreshold;
    compressionThresholdValue.textContent = settings.compressionThreshold;
    compressionRatio.value = settings.compressionRatio;
    compressionRatioValue.textContent = settings.compressionRatio;

    updateAudioRouting();
    updateCheckboxLabels();

    alert('Settings loaded successfully!');
  } else {
    alert('No saved settings found.');
  }
}

