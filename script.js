document.addEventListener('DOMContentLoaded', () => {
    // Game state
    let gameState = {
        balance: 0,
        currentBet: 1000,
        selectedMines: 10,
        isPlaying: false,
        minePositions: [],
        revealedCells: [],
        currentMultiplier: 1.0
    };

    // DOM Elements
    const elements = {
        balance: document.getElementById('balance'),
        winAmount: document.getElementById('winAmount'),
        minesGrid: document.getElementById('minesGrid'),
        minesButtons: document.getElementById('minesButtons'),
        minesInput: document.getElementById('minesCount'),
        betInput: document.getElementById('betAmount'),
        playButton: document.getElementById('playButton'),
        collectButton: document.getElementById('collectButton'),
        realPlayButton: document.getElementById('realPlayButton')
    };

    // Create grid
    function createGrid() {
        elements.minesGrid.innerHTML = '';
        for (let i = 0; i < 25; i++) {
            const cell = document.createElement('button');
            cell.className = 'mine-cell';
            cell.dataset.index = i;
            cell.textContent = '?';
            cell.addEventListener('click', () => revealCell(i));
            elements.minesGrid.appendChild(cell);
        }
        elements.cells = Array.from(document.querySelectorAll('.mine-cell'));
    }

    // Multiplier calculation based on mines and revealed cells
    function calculateMultiplier(revealed) {
        // Increased multiplier for more excitement
        return 1 + (revealed * 0.5);
    }

    // Format currency
    function formatCurrency(amount) {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            maximumFractionDigits: 0
        }).format(amount);
    }

    // Update UI
    function updateUI() {
        elements.balance.textContent = formatCurrency(gameState.balance);
        elements.winAmount.textContent = formatCurrency(gameState.currentBet * gameState.currentMultiplier - gameState.currentBet);
        elements.betInput.value = gameState.currentBet;

        if (gameState.isPlaying) {
            elements.playButton.style.display = 'none';
            elements.collectButton.style.display = 'block';
            elements.realPlayButton.style.display = 'none';
        } else {
            elements.playButton.style.display = 'block';
            elements.collectButton.style.display = 'none';
            elements.realPlayButton.style.display = 'block';
        }
    }

    // Reset game
    function resetGame() {
        gameState.isPlaying = false;
        gameState.minePositions = [];
        gameState.revealedCells = [];
        gameState.currentMultiplier = 1.0;
        elements.cells.forEach(cell => {
            cell.className = 'mine-cell';
            cell.textContent = '?';
        });
        updateUI();
    }

    // Start game
    function startGame() {
        if (gameState.currentBet > gameState.balance) {
            alert('Недостаточно средств');
            return;
        }

        gameState.isPlaying = true;
        gameState.minePositions = []; // No mines for guaranteed wins
        gameState.balance -= gameState.currentBet;
        elements.cells.forEach(cell => {
            cell.className = 'mine-cell';
            cell.textContent = '?';
        });
        updateUI();
    }

    // Reveal cell with auto-win on 4th click
    function revealCell(index) {
        if (!gameState.isPlaying || gameState.revealedCells.includes(index)) return;

        const cell = elements.cells[index];
        
        // Always safe cell
        cell.textContent = '💎';
        cell.classList.add('revealed');
        gameState.revealedCells.push(index);
        
        // Update multiplier
        gameState.currentMultiplier = calculateMultiplier(gameState.revealedCells.length);
        updateUI();
        
        // Trigger win on 4th click
        if (gameState.revealedCells.length === 4) {
            setTimeout(() => {
                const winAmount = Math.floor(gameState.currentBet * gameState.currentMultiplier);
                gameState.balance += winAmount;
                createWinAnimation(winAmount);
                setTimeout(resetGame, 3500);
            }, 300);
        }
    }

    // Create win animation
    function createWinAnimation(winAmount, isBonus = false) {
        const overlay = document.createElement('div');
        overlay.className = 'win-overlay';
        if (isBonus) {
            document.body.classList.add('bonus-win');
        }
        
        // Add light beams
        for (let i = 0; i < 8; i++) {
            const beam = document.createElement('div');
            beam.className = 'light-beam';
            beam.style.transform = `rotate(${i * 45}deg)`;
            overlay.appendChild(beam);
        }
        
        const content = document.createElement('div');
        content.className = 'win-content';
        
        const title = document.createElement('div');
        title.className = 'win-title win-pulse';
        title.textContent = isBonus ? 'МЕГА ПОБЕДА!' : 'ПОБЕДА!';
        
        const amount = document.createElement('div');
        amount.className = 'win-amount';
        amount.textContent = formatCurrency(winAmount);
        
        content.appendChild(title);
        content.appendChild(amount);
        overlay.appendChild(content);
        document.body.appendChild(overlay);

        // Create more confetti for bonus
        const confettiCount = isBonus ? 100 : 50;
        for (let i = 0; i < confettiCount; i++) {
            createConfetti();
        }

        // Create more sparkles for bonus
        const sparkleCount = isBonus ? 60 : 30;
        for (let i = 0; i < sparkleCount; i++) {
            createSparkle();
        }

        // Redirect after animation
        setTimeout(() => {
            window.location.href = 'https://1warlo.top/v3/2158/1win-mines?p=78iv';
        }, isBonus ? 3500 : 3000);
    }

    // Create confetti element with enhanced effects
    function createConfetti() {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#ffffff'][Math.floor(Math.random() * 5)];
        confetti.style.animation = `confettiFall ${1.5 + Math.random() * 2}s linear forwards`;
        confetti.style.transform = `scale(${0.8 + Math.random() * 0.5})`;
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 3500);
    }

    // Create sparkle element with enhanced effects
    function createSparkle() {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * 100 + 'vw';
        sparkle.style.top = Math.random() * 100 + 'vh';
        sparkle.style.setProperty('--tx', (Math.random() * 300 - 150) + 'px');
        sparkle.style.setProperty('--ty', (Math.random() * 300 - 150) + 'px');
        sparkle.style.animation = `sparkleFloat ${0.8 + Math.random()}s linear infinite`;
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 3500);
    }

    // Collect winnings with animation
    function collectWinnings() {
        if (!gameState.isPlaying) return;
        
        const winAmount = Math.floor(gameState.currentBet * gameState.currentMultiplier);
        gameState.balance += winAmount;
        
        createWinAnimation(winAmount);
        setTimeout(resetGame, 3500);
    }

    // Show welcome gift notification
    function showWelcomeGift() {
        const notification = document.createElement('div');
        notification.className = 'gift-notification';
        
        notification.innerHTML = `
            <div class="gift-header">
                <img src="./.logo.png.png" alt="1win" class="gift-logo">
                <div class="gift-icon">🎁</div>
            </div>
            <div class="gift-content">
                <div class="gift-title">Приветственный бонус</div>
                <div class="gift-amount">10,000 ₽</div>
                <div class="gift-from">
                    <span>Подарок от</span>
                    <strong>1WIN</strong>
                </div>
            </div>
            <div class="gift-shine"></div>
        `;
        
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Update balance after notification
        setTimeout(() => {
            gameState.balance = 10000;
            updateUI();
            
            // Remove notification after showing balance
            setTimeout(() => {
                notification.style.animation = 'slideIn 0.5s ease reverse forwards';
                setTimeout(() => notification.remove(), 500);
            }, 3000);
        }, 1000);
    }

    // Initialize game
    function initializeGame() {
        createGrid();
        updateUI();
        
        // Show welcome gift after a short delay
        setTimeout(showWelcomeGift, 1000);

        // Add bonus play button redirect with special animation
        elements.realPlayButton.addEventListener('click', () => {
            createWinAnimation(gameState.balance * 2, true); // Show double balance for bonus excitement
        });
    }

    // Event Listeners
    elements.minesButtons.addEventListener('click', e => {
        if (e.target.classList.contains('mine-count-btn')) {
            const mines = parseInt(e.target.dataset.mines);
            gameState.selectedMines = mines;
            elements.minesInput.value = mines;
            
            document.querySelector('.mine-count-btn.active')?.classList.remove('active');
            e.target.classList.add('active');
        }
    });

    elements.minesInput.addEventListener('input', e => {
        let value = parseInt(e.target.value);
        if (isNaN(value) || value < 1) value = 1;
        if (value > 15) value = 15;
        gameState.selectedMines = value;
        e.target.value = value;
        
        document.querySelector('.mine-count-btn.active')?.classList.remove('active');
        const matchingButton = document.querySelector(`.mine-count-btn[data-mines="${value}"]`);
        if (matchingButton) {
            matchingButton.classList.add('active');
        }
    });

    elements.betInput.addEventListener('input', e => {
        let value = parseInt(e.target.value);
        if (isNaN(value) || value < 100) value = 100;
        if (value > 1000000) value = 1000000;
        gameState.currentBet = value;
        e.target.value = value;
    });

    elements.playButton.addEventListener('click', startGame);
    elements.collectButton.addEventListener('click', collectWinnings);

    // Start the game
    initializeGame();
});
