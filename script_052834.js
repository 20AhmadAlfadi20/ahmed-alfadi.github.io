let targetNumber =
Math.floor(Math.random() * 100) +1;
let tries =0 ;

const input =
document.getElementById('guessInput') ;
const btn =
document.getElementById('checkBtn') ;
const feedback =
document.getElementById('feedback') ;
const triesDisplay =
document.getElementById('triesCount') ;

btn.addEventListener('click', () => {

    let guess = Number(input.value) ;
    if (!guess || guess < 1 || guess > 100) {
        feedback.innerText = "Invalid Input!";
        feedback.style.color = " #ff4444" ;
        return;
    }
    tries++;
    triesDisplay.innerText = tries ;

    if (guess === targetNumber) {
        feedback.innerText = "SUCCESS!🎉" ;
        feedback.style.color = "#00ff88" ;
        btn.disabled = true ; // stop the game 
    } else if (guess > targetNumber) {
        feedback.innerText = "Too High!...⏬" ;
        feedback.style.color = " #ffbb33" ;
    } else  {
        feedback.innerText = " Too Low!...⏫" ;
        feedback.style.color = "#33b5e5" ;
    }
    

        input.value = ''; //clear input for next try .
        input.focus() ;
} ) ;