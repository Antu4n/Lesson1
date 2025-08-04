document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENTS ---
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const endScreen = document.getElementById('end-screen');
    const startBtn = document.querySelector('.start-button');
    const playAgainBtn = document.getElementById('play-again-button');
    const playNarrationBtn = document.getElementById('play-narration-btn');
    const narrationAudio = document.getElementById('intro-audio');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const modalOverlay = document.getElementById('feedback-modal-overlay');
    const modal = document.getElementById('feedback-modal');
    const feedbackTitle = document.getElementById('feedback-title');
    const feedbackText = document.getElementById('feedback-modal-text');
    const nextQuestionBtn = document.getElementById('next-question-button');
    const dragItemsContainer = document.getElementById('drag-items-container');
    const badgeReward = document.getElementById('badge-reward');
    const bonusTips = document.getElementById('bonus-tips');
    const dingAudio = document.getElementById('ding-audio');
    const buzzAudio = document.getElementById('buzz-audio');
    const nextActivityBtn = document.getElementById('next-activity-button');
    const previousActivityBtn = document.getElementById('previous-activity-button');


    

    let score = 0;
    let totalQuestions = 0;
    let currentItems = [];
    let correctAttempts = 0;

    // Helper to stop all playing audio
    function stopAllAudio() {
        narrationAudio.pause();
        narrationAudio.currentTime = 0;

        dingAudio.pause();
        dingAudio.currentTime = 0;

        buzzAudio.pause();
        buzzAudio.currentTime = 0;

        if (window.activeAudio && !window.activeAudio.paused) {
            window.activeAudio.pause();
            window.activeAudio.currentTime = 0;
        }
    }

    const gameData = [
                {
                    id: 'pyramids-giza',
                    name: 'Pyramids of Giza',
                    marker: 'A',
                    correctFeedback: 'Excellent! You’ve placed the Pyramids of Giza in Egypt—right where they belong. These ancient structures are over 4,500 years old!',
                    incorrectFeedback: 'That’s not the right spot for the pyramids. Think about where the Nile River flows through the desert.',
                    hint: 'Remember, the Pyramids are in Egypt, near the northeastern tip of Africa.',
                    steps: [
                        'Step 1: The Nile River runs north through Egypt.',
                        'Step 2: The Pyramids are just outside Cairo, Egypt’s capital.',
                        'Step 3: Look for the marker in the northeast corner of the map.'
                    ],
                    isMatched: false,
                    correctAudioSrc: './asset/audio/correctA.mp3',
                    incorrectAudioSrc: './asset/audio/incorrectA.mp3'
                },
                {
                    id: 'timbuktu',
                    name: 'Timbuktu',
                    marker: 'B',
                    correctFeedback: 'Great memory! Timbuktu is in Mali, West Africa. It was once a major center of learning and trade.',
                    incorrectFeedback: 'Not quite! Timbuktu isn’t in that region. Think desert libraries and gold routes.',
                    hint: 'Timbuktu is in Mali—look west of Nigeria, near the Sahara Desert.',
                    steps: [
                        'Step 1: Mali is in western Africa.',
                        'Step 2: Timbuktu sits just below the edge of the Sahara.',
                        'Step 3: Try the marker in West Africa—closer to the desert.'
                    ],
                    isMatched: false,
                    correctAudioSrc: './asset/audio/correctB.mp3',
                    incorrectAudioSrc: './asset/audio/incorrectB.mp3'
                },
                {
                    id: 'great-zimbabwe',
                    name: 'Great Zimbabwe Ruins',
                    marker: 'C',
                    correctFeedback: 'Well done! The Great Zimbabwe Ruins are in Zimbabwe. These stone walls were built without mortar!',
                    incorrectFeedback: 'Oops! That’s not Zimbabwe. Remember where ancient kings once ruled behind giant stone walls.',
                    hint: 'Great Zimbabwe is in southern Africa—below Zambia and to the west of Mozambique.',
                    steps: [
                        'Step 1: Zimbabwe is south of Zambia.',
                        'Step 2: The ruins are inland, away from the coast.',
                        'Step 3: Find the marker in southern Africa that isn’t on the coast.'
                    ],
                    isMatched: false,
                    correctAudioSrc: './asset/audio/correctC.mp3',
                    incorrectAudioSrc: './asset/audio/incorrectCmp3'
                },
                {
                    id: 'serengeti',
                    name: 'Serengeti National Park',
                    marker: 'D',
                    correctFeedback: 'Nice work! Serengeti National Park is in Tanzania and home to the great wildebeest migration.',
                    incorrectFeedback: 'Not quite. The Serengeti is in East Africa—not that far west.',
                    hint: 'Look for Tanzania, just below Kenya in East Africa—near the Great Rift Valley.',
                    steps: [
                        'Step 1: Tanzania is in East Africa, bordering Kenya.',
                        'Step 2: The Serengeti is inland, not coastal.',
                        'Step 3: Try the marker near northern Tanzania.'
                    ],
                    isMatched: false,
                    correctAudioSrc: './asset/audio/correctD.mp3',
                    incorrectAudioSrc: './asset/audio/incorrectD.mp3'
                },
                {
                    id: 'robben-island',
                    name: 'Robben Island',
                    marker: 'E',
                    correctFeedback: 'Correct! Robben Island is just off the coast of Cape Town, South Africa. Nelson Mandela was imprisoned here for 18 years.',
                    incorrectFeedback: 'That’s not quite right. Robben Island isn’t inland—think ocean!',
                    hint: 'It’s an island near Cape Town on the southern coast of South Africa.',
                    steps: [
                        'Step 1: Look at South Africa’s southwestern coast.',
                        'Step 2: Cape Town is on the edge of the continent.',
                        'Step 3: Find the marker off the coast—it’s Robben Island.'
                    ],
                    isMatched: false,
                    correctAudioSrc: './asset/audio/correctE.mp3',
                    incorrectAudioSrc: './asset/audio/incorrectE.mp3'
                },
                {
                    id: 'victoria-falls',
                    name: 'Victoria Falls',
                    marker: 'F',
                    correctFeedback: 'Yes! Victoria Falls is right on the border between Zambia and Zimbabwe. Locals call it ‘The Smoke That Thunders.’',
                    incorrectFeedback: 'Oops! That’s not Victoria Falls. Think about large rivers and borders.',
                    hint: 'Look along the Zambezi River—between Zambia and Zimbabwe.',
                    steps: [
                        'Step 1: The Zambezi River separates Zambia and Zimbabwe.',
                        'Step 2: Victoria Falls is just downstream of Lake Kariba.',
                        'Step 3: Click the marker between those two countries.'
                    ],
                    isMatched: false,
                    correctAudioSrc: './asset/audio/correctF.mp3',
                    incorrectAudioSrc: './asset/audio/incorrectF.mp3'
                },
                {
                    id: 'vallee-de-mai',
                    name: 'Vallée de Mai Nature Reserve',
                    marker: 'G',
                    correctFeedback: 'You got it! Vallée de Mai is in Seychelles. It’s a tropical forest famous for the Coco de Mer palm.',
                    incorrectFeedback: 'Not quite! Vallée de Mai isn’t on the mainland—it’s on an island!',
                    hint: 'Look northeast of Madagascar, in the Indian Ocean. That’s where Seychelles is!',
                    steps: [
                        'Step 1: The Seychelles are small islands off Africa’s eastern coast.',
                        'Step 2: Find the island cluster northeast of Madagascar.',
                        'Step 3: That marker leads to Vallée de Mai.'
                    ],
                    isMatched: false,
                    correctAudioSrc: './asset/audio/correctG.mp3',
                    incorrectAudioSrc: './asset/audio/incorrectG.mp3'
                },
                {
                    id: 'lalibela',
                    name: 'Rock-Hewn Churches of Lalibela',
                    marker: 'H',
                    correctFeedback: 'Fantastic! Lalibela is in Ethiopia. These churches were carved straight into the rock in the 1100s!',
                    incorrectFeedback: 'Not there. Lalibela is in Ethiopia, up in the northeast of Africa.',
                    hint: 'Think about the Horn of Africa—Ethiopia is just above Kenya and next to Eritrea.',
                    steps: [
                        'Step 1: Ethiopia is part of the Horn of Africa.',
                        'Step 2: It’s northeast of Kenya and inland.',
                        'Step 3: Look for the marker in central-northern Ethiopia.'
                    ],
                    isMatched: false,
                    correctAudioSrc: './asset/audio/correctH.mp3',
                    incorrectAudioSrc: './asset/audio/incorrectH.mp3'
                }
            ];


    totalQuestions = gameData.length;

    const icons = { /* your icons object remains unchanged */ };

   function initializeGame() {
    score = 0;
    correctAttempts = 0;

    // Deep copy the gameData array
    currentItems = JSON.parse(JSON.stringify(gameData));

    // Reset key fields on each object
    currentItems.forEach(item => {
        item.isMatched = false;
        item.failedAttempts = 0; // Track wrong drops for step-by-step support
    });

    shuffleArray(currentItems);          // Randomize order of draggable items
    populateDragItems();                 // Create draggable elements
    resetMapMarkers();                   // Remove any old match styles
    updateProgressBar();                 // Reset progress bar
    badgeReward.textContent = '';        // Clear reward
    bonusTips.textContent = '';          // Clear tips
    addDropListeners();                  // Re-bind drop zones
}



    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function populateDragItems() {
        dragItemsContainer.innerHTML = '';
        currentItems.forEach((item) => {
            const dragItem = document.createElement('div');
            dragItem.className = 'drag-item';
            dragItem.draggable = true;
            dragItem.textContent = item.name;
            dragItem.dataset.siteId = item.id;

            addDragListeners(dragItem);
            dragItemsContainer.appendChild(dragItem);
        });
    }

    function resetMapMarkers() {
        document.querySelectorAll('.map-marker').forEach(marker => {
            marker.classList.remove('correct-match', 'incorrect-match');
        });
    }

    function addDragListeners(item) {
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.dataset.siteId);
            e.target.classList.add('dragging');
        });

        item.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
        });
    }

    function addDropListeners() {
        document.querySelectorAll('.map-marker').forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.classList.add('drag-over');
            });

            zone.addEventListener('dragleave', () => {
                zone.classList.remove('drag-over');
            });

            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('drag-over');

                const draggedSiteId = e.dataTransfer.getData('text/plain');
                const droppedMarker = zone.dataset.marker;

                const draggedItemElement = document.querySelector(`.drag-item[data-site-id="${draggedSiteId}"]`);
                const siteData = currentItems.find(item => item.id === draggedSiteId); // ✅ fixed

                if (siteData && !siteData.isMatched) {
                    if (siteData.marker === droppedMarker) {
                        siteData.isMatched = true;
                        score++;
                        correctAttempts++;
                        draggedItemElement.classList.add('matched');
                        zone.classList.add('correct-match');

                        dingAudio.currentTime = 0;
                        dingAudio.play();
                        dingAudio.onended = () => {
                            const specificCorrectAudio = new Audio(siteData.correctAudioSrc);
                            window.activeAudio = specificCorrectAudio;
                            specificCorrectAudio.play();
                        };

                        showFeedback(true, siteData.correctFeedback);
                        updateProgressBar();
                    } else {
                        zone.classList.add('incorrect-match');
                        setTimeout(() => {
                            zone.classList.remove('incorrect-match');
                        }, 500);

                        buzzAudio.currentTime = 0;
                        buzzAudio.play();
                        buzzAudio.onended = () => {
                            const specificIncorrectAudio = new Audio(siteData.incorrectAudioSrc);
                            window.activeAudio = specificIncorrectAudio;
                            specificIncorrectAudio.play();
                        };

siteData.failedAttempts++;

let stepsMessage = '';
if (siteData.steps && siteData.failedAttempts >= 2) {
    const stepCount = siteData.failedAttempts - 1;
    const stepsToShow = siteData.steps.slice(0, stepCount);
    stepsMessage = `<br><strong>Step-by-Step Help:</strong><br>${stepsToShow.join('<br>')}`;
}

const fullHint = `
    ${siteData.incorrectFeedback}<br><br>
    <strong>Hint:</strong> ${siteData.hint}
    ${stepsMessage}
`;

showFeedback(false, fullHint);
                    }
                }
            });
        });
    }

    function switchScreen(hideScreen, showScreen) {
        hideScreen.classList.add('hidden');
        showScreen.classList.remove('hidden');
    }

    function updateProgressBar() {
        const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;
        progressBar.style.width = `${percentage}%`;
        progressText.textContent = `${score} / ${totalQuestions}`;
    }
    
function showFeedback(isCorrect, message, siteData = null) {
    const titleText = isCorrect ? "Correct!" : "Not Quite...";
    feedbackTitle.innerHTML = `${isCorrect ? icons.correct : icons.incorrect} ${titleText}`;

    if (isCorrect && siteData?.correctIconSrc) {
        feedbackText.innerHTML = `
            <div class="feedback-image-wrapper">
                <img src="${siteData.correctIconSrc}" alt="${siteData.name}" class="feedback-image" />
            </div>
            <div class="feedback-text">${message}</div>
        `;
    } else {
        feedbackText.innerHTML = `<div class="feedback-text">${message}</div>`;
    }

    modal.className = 'feedback-modal';
    modal.classList.add(isCorrect ? 'correct-feedback' : 'incorrect-feedback');

    modalOverlay.classList.remove('hidden');
}


    function showFeedback(isCorrect, message) {
        const icons = {
    correct: "✅",
    incorrect: "❌"
};

        const titleText = isCorrect ? "Correct!" : "Not Quite...";
        feedbackTitle.innerHTML = `${isCorrect ? icons.correct : icons.incorrect} ${titleText}`;
        feedbackText.innerHTML = message;

        modal.className = 'feedback-modal';
        modal.classList.add(isCorrect ? 'correct-feedback' : 'incorrect-feedback');

        modalOverlay.classList.remove('hidden');
    }

    function checkGameCompletion() {
        if (score === totalQuestions) {
            setTimeout(() => {
                modalOverlay.classList.add('hidden');
                switchScreen(gameScreen, endScreen);
                displayBadgeReward();
            }, 1200);
        }
    }

    function displayBadgeReward() {
        // unchanged
    }

    // --- EVENT LISTENERS ---
    startBtn.addEventListener('click', () => {
        stopAllAudio();
        switchScreen(startScreen, gameScreen);
        initializeGame();
    });

    playAgainBtn.addEventListener('click', () => {
        stopAllAudio();
    endScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden'); // This was not in your original handlePlayAgain
    initializeGame();
    });

    nextQuestionBtn.addEventListener('click', () => {
        stopAllAudio();
        modalOverlay.classList.add('hidden');
        checkGameCompletion();
    });

    nextActivityBtn?.addEventListener('click', () => {
    window.location.href = '../ACTIVITY3/index.html'; // Replace with actual relative path
});

    previousActivityBtn?.addEventListener('click', () => {
    window.location.href = '../ACTIVITY1/index.html'; // Replace with actual relative path
});

    playNarrationBtn.addEventListener('click', () => {
        const playIcon = document.getElementById('play-icon');
        const pauseIcon = document.getElementById('pause-icon');
        const btnText = document.getElementById('narration-btn-text');

        if (narrationAudio.paused) {
            narrationAudio.play();
            btnText.textContent = 'PAUSE NARRATION';
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        } else {
            narrationAudio.pause();
            btnText.textContent = 'PLAY NARRATION';
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        }
    });

    narrationAudio.addEventListener('ended', () => {
        document.getElementById('narration-btn-text').textContent = 'PLAY NARRATION';
        document.getElementById('play-icon').style.display = 'block';
        document.getElementById('pause-icon').style.display = 'none';
    });

    addDropListeners();
});
