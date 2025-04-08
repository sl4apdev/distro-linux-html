// perguntas
const questions = [
  {
    id: "Segurança",
    text: "Você considera a segurança como prioridade máxima?",
    options: [
      { value: "V", text: "Sim, preciso de um sistema altamente seguro" },
      { value: "F", text: "Não é minha principal preocupação" }
    ]
  },
  {
    id: "Jogar",
    text: "Você pretende usar o sistema para jogos?",
    options: [
      { value: "V", text: "Sim, quero jogar no Linux" },
      { value: "F", text: "Não vou usar para jogos" }
    ]
  },
  {
    id: "Leve",
    text: "Você precisa de um sistema leve para hardware limitado?",
    options: [
      { value: "V", text: "Sim, tenho hardware modesto" },
      { value: "F", text: "Não, tenho hardware potente" }
    ]
  },
  {
    id: "Open-Source",
    text: "É importante para você que o sistema seja 100% open source?",
    options: [
      { value: "V", text: "Sim, quero apenas software livre" },
      { value: "F", text: "Não me importo se tiver componentes proprietários" }
    ]
  },
  {
    id: "Estabilidade",
    text: "Você prefere um sistema estável ou com novidades constantes?",
    options: [
      { value: "V", text: "Prefiro estabilidade acima de tudo" },
      { value: "F", text: "Prefiro ter as últimas novidades mesmo que menos estável" }
    ]
  },
  {
    id: "Experiência",
    text: "Você já tem experiência prévia com sistemas Linux?",
    options: [
      { value: "V", text: "Sim, já uso Linux há algum tempo" },
      { value: "F", text: "Não, sou iniciante em Linux" }
    ]
  }
];

// State variables
let currentQuestionIndex = 0;
let answers = [];
let distros = []; // Will be fetched from escolhas.html

// DOM elements
const questionContainer = document.getElementById('question-container');
const progressBar = document.getElementById('progress-bar');
const currentStepElement = document.getElementById('current-step');
const totalStepsElement = document.getElementById('total-steps');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');
const resultContainer = document.getElementById('result-container');
const distroName = document.getElementById('distro-name');
const distroDescription = document.getElementById('distro-description');
const distroLogo = document.getElementById('distro-logo');
const restartBtn = document.getElementById('restart-btn');

// Initialize the quiz
function initQuiz() {
  // Fetch distros data from escolhas.html
  fetchDistros().then(() => {
    totalStepsElement.textContent = questions.length;
    showQuestion(currentQuestionIndex);
  });
  
  // Add event listeners
  prevBtn.addEventListener('click', showPreviousQuestion);
  nextBtn.addEventListener('click', showNextQuestion);
  submitBtn.addEventListener('click', showResult);
  restartBtn.addEventListener('click', resetQuiz);
}

// Fetch distros data from escolhas.html
async function fetchDistros() {
  try {
    const response = await fetch('escolhas.html');
    const html = await response.text();
    
    // Create a temporary element to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Extract the distros variable from the script tag
    const scriptContent = tempDiv.querySelector('script').innerText;
    const distrosMatch = scriptContent.match(/const distros = (\[[\s\S]*?\]);/);
    
    if (distrosMatch && distrosMatch[1]) {
      // Safely evaluate the distros array
      distros = eval(distrosMatch[1]);
    } else {
      console.error('Could not find distros data in escolhas.html');
      // Fallback to default distro
      distros = [{
        Segurança:"V", Jogar:"V", Leve:"V", "Open-Source":"V", 
        Estabilidade:"V", Experiência:"V", distro:"Ubuntu", 
        description: "A distribuição Linux mais popular", 
        color: "#E95420", 
        logo: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#E95420"/></svg>'
      }];
    }
  } catch (error) {
    console.error('Error fetching distros:', error);
    // Fallback to default distro
    distros = [{
      Segurança:"V", Jogar:"V", Leve:"V", "Open-Source":"V", 
      Estabilidade:"V", Experiência:"V", distro:"Ubuntu", 
      description: "A distribuição Linux mais popular", 
      color: "#E95420", 
      logo: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#E95420"/></svg>'
    }];
  }
}

// Show a question by index
function showQuestion(index) {
  questionContainer.innerHTML = '';
  const question = questions[index];
  
  const questionCard = document.createElement('div');
  questionCard.className = 'question-card';
  questionCard.style.animation = 'fadeIn 0.5s forwards';
  
  const questionTitle = document.createElement('h2');
  questionTitle.className = 'question-title';
  questionTitle.textContent = question.text;
  questionCard.appendChild(questionTitle);
  
  question.options.forEach((option, i) => {
    const button = document.createElement('button');
    button.className = 'option-btn';
    button.textContent = option.text;
    button.dataset.value = option.value;
    button.style.animationDelay = `${0.2 + (i * 0.1)}s`;
    
    // Check if this option is already selected
    if (answers[question.id] === option.value) {
      button.classList.add('selected');
    }
    
    button.addEventListener('click', () => {
      // Deselect all options
      document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected');
      });
      
      // Select this option
      button.classList.add('selected');
      answers[question.id] = option.value;
      
      // Enable next button or submit button depending on the current question
      if (index === questions.length - 1) {
        submitBtn.disabled = false;
      } else {
        nextBtn.disabled = false;
      }
    });
    
    questionCard.appendChild(button);
  });
  
  questionContainer.appendChild(questionCard);
  
  // Update progress
  currentStepElement.textContent = index + 1;
  progressBar.style.width = `${((index + 1) / questions.length) * 100}%`;
  
  // Update buttons
  prevBtn.disabled = index === 0;
  
  if (index === questions.length - 1) {
    nextBtn.classList.add('d-none');
    submitBtn.classList.remove('d-none');
    // Changed here: Check if there's already an answer for this question
    submitBtn.disabled = !answers[question.id];
  } else {
    nextBtn.classList.remove('d-none');
    submitBtn.classList.add('d-none');
    nextBtn.disabled = !answers[question.id];
  }
}

// Show the previous question
function showPreviousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    showQuestion(currentQuestionIndex);
  }
}

// Show the next question
function showNextQuestion() {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    showQuestion(currentQuestionIndex);
  }
}

// Show the result
function showResult() {
  // Find the matching distro
  const matchingDistro = findMatchingDistro() || distros[0]; // Default to first entry if no match
  
  // Update the result UI
  distroName.textContent = matchingDistro.distro;
  distroDescription.textContent = matchingDistro.description;
  distroLogo.innerHTML = matchingDistro.logo;
  
  // Show result container with animation
  document.querySelector('.quiz-container').style.animation = 'fadeOut 0.5s forwards';
  setTimeout(() => {
    document.querySelector('.quiz-container').classList.add('d-none');
    resultContainer.classList.remove('d-none');
    resultContainer.style.animation = 'fadeIn 0.8s forwards';
  }, 500);
}

// Find the best matching distro based on answers
function findMatchingDistro() {
  // Convert answers from object to simple array format for easier comparison
  const answersArray = [];
  questions.forEach(q => {
    answersArray[q.id] = answers[q.id];
  });
  
  // Find exact match first
  let match = distros.find(d => 
    questions.every(q => d[q.id] === answersArray[q.id])
  );
  
  if (match) return match;
  
  // If no exact match, find closest match by counting matching attributes
  let bestMatchScore = -1;
  let bestMatch = null;
  
  distros.forEach(d => {
    let score = 0;
    questions.forEach(q => {
      if (d[q.id] === answersArray[q.id]) {
        score++;
      }
    });
    
    if (score > bestMatchScore) {
      bestMatchScore = score;
      bestMatch = d;
    }
  });
  
  return bestMatch;
}

// Reset the quiz
function resetQuiz() {
  currentQuestionIndex = 0;
  answers = [];
  resultContainer.style.animation = 'fadeOut 0.5s forwards';
  setTimeout(() => {
    resultContainer.classList.add('d-none');
    document.querySelector('.quiz-container').classList.remove('d-none');
    document.querySelector('.quiz-container').style.animation = 'fadeIn 0.8s forwards';
    showQuestion(currentQuestionIndex);
  }, 500);
}

// Intro animation and main content setup
function setupIntro() {
  const startQuizBtn = document.getElementById('start-quiz-btn');
  const introScreen = document.getElementById('intro-screen');
  const mainContent = document.getElementById('main-content');
  
  startQuizBtn.addEventListener('click', () => {
    introScreen.style.animation = 'fadeOut 0.8s forwards';
    setTimeout(() => {
      introScreen.classList.add('d-none');
      mainContent.classList.remove('d-none');
      initQuiz();
    }, 800);
  });
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
  setupIntro();
});