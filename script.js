class AudioController{
    constructor(){
        this.flipSound = new Audio('Assets/Audio/flip.wav');
        this.matchSound = new Audio('Assets/Audio/match.wav');
        this.gameOverSound = new Audio('Assets/Audio/gameOver.wav');
        this.victorySound = new Audio('Assets/Audio/victory.wav');
        this.bgMusic = new Audio('Assets/Audio/stringer-things-sound.mp3');
        this.bgMusic.loop = true;
        this.bgMusic.volume=0.5;
        
    }
    startMusic(){
        this.bgMusic.play();
    }
    stopMusic (){
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }
    flip(){
        this.flipSound.play();
    }
    match() {
        this.matchSound.play();
    }
    victory (){
        this.stopMusic();
        this.victorySound.play();
    }
    gameOver() {
        this.stopMusic();
        this.gameOverSound.play();
    }
}

class MixOrMatch{
    constructor(totalTime, cards){
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById('time-remaining');
        this.score = document.getElementById('score');
        this.audioController = new AudioController();
        
    }
    startGame(){
        this.cardToCheck = null;
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.matchedCards = [];
        this.busy = true;
        this.currentScore = 0;
        

        setTimeout(()=>{
            this.audioController.startMusic();
            this.busy = false;
            this.shuffleCards();
            this.countDown = this.startCountDown();
        }, 500);

        this.hideCards();
        this.timer.innerText = this.timeRemaining;
        
    }    

        hideCards(){
            this.cardsArray.forEach(card => {
                card.classList.remove('visible');
            });
        };

        startCountDown(){
            return setInterval(()=>{
                this.timeRemaining --;
                this.timer.innerText = this.timeRemaining;
                if (this.timeRemaining === 0){
                    this.gameOver();
                }
            }, 1000);
        }

        gameOver (){
            clearInterval(this.countDown);
            this.audioController.gameOver();
            document.getElementById('game-over').classList.add('visible');
        }

        victory (){
            clearInterval(this.countDown);
            this.audioController.victory();
            this.score.innerHTML = 0;
            document.getElementById('winner-text').classList.add('visible');
            
        }
    
    flipCard(card){
        if (this.canFlipCard(card)) {
            this.audioController.flip();
            card.classList.add('visible');

            if (this.cardToCheck) {
                this.checkForCardMatch(card, this.cardToCheck);
            } else {
                this.cardToCheck = card;
            }
        }
        
    }
    checkForCardMatch(card, cardToCheck){
        if(this.getCardType(card) === this.getCardType(this.cardToCheck)) {
            this.cardMatch(card, this.cardToCheck);
        }
         else {
            this.cardMismatch(card, this.cardToCheck);
        }
        this.cardToCheck=null;
    }
    cardMatch(card1, card2){
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);

        // ADD HERE
        // card1.classList.add('');
        // card2.classList.add('');
        
        this.currentScore += 1;
        this.score.innerHTML = this.currentScore;

        this.audioController.match();
        if (this.matchedCards.length === this.cardsArray.length){
            this.victory();
        }
    }
    cardMismatch(card1, card2){
        this.busy= true;
        setTimeout(()=>{
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy=false;
        }, 1000)
    }
    getCardType(card){
        return card.getElementsByClassName('card-value')[0].src;
    }
    shuffleCards(){
        for(let i=this.cardsArray.length -1; i>0; i--) {
            let randomIndex = Math.floor(Math.random()* (i+1));
            this.cardsArray[randomIndex].style.order = i;
            this.cardsArray[i].style.order = randomIndex;
        }
    }
    canFlipCard (card) {
        if (!this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck) {
            return true;
        } else {
            return false;
        }
    }

}

function ready() {
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new MixOrMatch(100, cards);
    

    overlays.forEach(overlay=> {
        overlay.addEventListener('click', ()=>{
            overlay.classList.remove('visible');
            
            game.startGame();
        
        //     let audioController = new AudioController();
        // audioController.startMusic();
        })
        
    })
    cards.forEach(card => {
        card.addEventListener('click', ()=>{
            game.flipCard(card);
        });
    });

}


if(document.readyState==="loading"){
    document.addEventListener('DOMContentLoaded', ready())
} else {
    ready();
}



