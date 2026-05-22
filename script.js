let targetNumber ;
let maxTries = 0;
let triesLeft = 0 ;

 
const startCard = document.getElementById('startCard') ;
const gameCard = document.getElementById('gameCard') ;
const gameTitle = document.getElementById('gameTitle') ;
const input = document.getElementById('guessInput') ;
const btn = document.getElementById('checkBtn') ;
const feedback = document.getElementById('feedback') ;
const triesDisplay = document.getElementById('triesCount') ;
const restartBtn = document.getElementById('restartBtn') ;
const diffButtons = document.querySelectorAll('.diff-btn') ;

 //تشغيل مستويات الصعوبة 
diffButtons.forEach(button => {
button.addEventListener('click' ,() => {
    maxTries =Number(button.getAttribute('data-tries ')) ;
    triesLeft = maxTries ;

//توليد الرقم االعشواءي 

targetNumber =Math.floor(Math.rendom() * 100 ) +1 ;
triesDisplay.innerText = triesLeft ;

//تاثيرات بصرية 

if (maxTries === 3) {
    gameTitle.innerText = "Expert mode 🌚" ;
    gameTitle.style.color = "#ffbb33 " ;
    triesDisplay.style.color ="#ffbb33" ;
} else if (maxTries === 1) {
    gameTitle.innerText = "LEGEND MODE 💀 " ;
    gameTitle.style.color = " #ff4444 " ;
    triesDisplay.style.color = "#ff4444 " ;

}else {
    gameTitle.innerText = "Number Master 🎮" ;
    gameTitle.style.color = "#00ff88 " ;
}

//الانتقال من قاءمة البداية الى اللعبة
 startCard.classList.add('hidden') ;
 gameCard.classList.remove('hidden') ;

// تنظيف الواجهة لبدء اللعب 
feedback.innerText = '' ;
btn.disabled = false ;
restartBtn.classList.add('hidden') ;
input.value = '' ;
input.focus() ;
});
});

//فحص التخمين عند الضغط على الزر
btn.addEventListener('click' , () => {
    let guess = Number(input.value) ;

//التحقق من صحة الادخال 

    if (!guess || guess < 1 || guess > 100) {
        feedback.innerText = "Invalid Input!";
        feedback.style.color = " #ff4444" ;
        return;
    }
    triesLeft--;
    triesDisplay.innerText = triesLeft ;




//خوازمية الفوز و الخسارة و التوجيه 

if (guess === targetNumber) {
        feedback.innerText = "SUCCESS!🎉YOU WIN!" ;
        feedback.style.color = "#00ff88" ;
        endGame(); 
        
    } else if (triesLeft === 0) {
        feedback.innerText = 'GAME OVER!  ( The number was ${targetNumber}) ';
        feedback.style.color = " #ff4444";
        endGame() ;
    } else if (guess > targetNumber) {
        feedback.innerText =" Too High!...⏬" ;
        feedback.style.color= "#ffbb33 " ;
    }
    
     else   {
        feedback.innerText = " Too Low!...⏫" ;
        feedback.style.color = "#33b5e5" ;
    }
    

        input.value = ''; //clear input for next try .
        input.focus() ;
} ) ;



//انهاء اللعبة و اظهار زر العودة
function endGame() {
    btn.disabled = true ;
    restartBtn.Btn.classList.remove('hidden') ;
}




//العودة للقائمة الرئيسية لبدء تحدي جديد
 restartBtn.addEventListener('click', () => {
    gameCard.classList.add('hidden') ;
    startCard.classList.remove('hidden') ;

    }) ;
