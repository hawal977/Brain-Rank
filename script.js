// PLAYER VARIABLES
let score = 0, level = 1, rankIndex = 0, time = 20, timer, questionCounter = 0, hints=0;
let correctAnswer;

// PLAYER NAME
const playerNickname = "Smart Brain";

// ELEMENTS
const questionEl = document.getElementById("question");
const buttons = document.querySelectorAll(".answers button");
const timeEl = document.getElementById("time");
const challengeText = document.getElementById("challengeText");
const boardContent = document.getElementById("boardContent");
const rankEl = document.getElementById("rank");
const levelEl = document.getElementById("level");
const scoreEl = document.getElementById("score");
const headerRankIcon = document.getElementById("headerRankIcon");

// RANKS & ICONS
const ranks = ["Rookie","Learner","Smart","Expert","Brain Master"];
const rankIcons = ["🥉","🥈","🥇","🏆","💎"];
const challenges = ["I challenge you!","Can your brain handle this?","Focus! Don’t rush","Train your brain every day","Only smart minds pass this"];

// QUESTIONS
const mathQ = [], englishQ = [];
for(let i=1;i<=1000;i++){
  mathQ.push({q:`${i} + ${i} = ?`,a:(i+i).toString()});
  englishQ.push({q:`Choose the meaning of "word${i}"`,a:`option${i}`});
}

// LEADERBOARD
let leaderboardData=[
  {name:"Alice",rank:"Expert",level:12,score:250},
  {name:"Bob",rank:"Smart",level:8,score:140},
  {name:"Charlie",rank:"Learner",level:5,score:70},
  {name:playerNickname,rank:ranks[0],level,score}
];

// STREAK
let streak=parseInt(localStorage.getItem("streak"))||0;
const today=new Date().toDateString();const lastPlayed=localStorage.getItem("lastPlayed");
if(lastPlayed!==today){if(lastPlayed===new Date(Date.now()-86400000).toDateString())streak++;else streak=0;localStorage.setItem("streak",streak);localStorage.setItem("lastPlayed",today);}
document.getElementById("streak").textContent=streak;

// TIMER
function startTimer(){clearInterval(timer);time=20;timeEl.textContent=time;timeEl.classList.remove("warning");timer=setInterval(()=>{time--;timeEl.textContent=time;if(time<=5)timeEl.classList.add("warning");if(time<=0)loseGame();},1000);}

// GENERATE QUESTION
function generateQuestion(){
  let isMath=Math.random()<0.5;let pool=isMath?mathQ:englishQ;
  let q=pool[Math.floor(Math.random()*pool.length)];
  questionEl.textContent=q.q;
  correctAnswer=q.a;
  let answers=[correctAnswer];
  while(answers.length<4){let fake=isMath?(Math.floor(Math.random()*2000)).toString():"option"+Math.floor(Math.random()*2000);if(!answers.includes(fake))answers.push(fake);}
  answers.sort(()=>Math.random()-0.5);
  buttons.forEach((b,i)=>{b.textContent=answers[i];b.className="";});
  correctAnswer=answers.indexOf(correctAnswer);
  challengeText.textContent=challenges[Math.floor(Math.random()*challenges.length)];
}

// CHECK ANSWERS
buttons.forEach((btn,i)=>{btn.onclick=()=>{if(i===correctAnswer){btn.classList.add("correct");score+=10+streak;questionCounter++;updateLevelRank();if(questionCounter%10===0)startMiniGame();else generateQuestion(),startTimer();}else{btn.classList.add("wrong");loseGame();}};});

// LEVEL & RANK
function updateLevelRank(){level=Math.floor(score/50)+1;rankIndex=Math.min(Math.floor(score/150),ranks.length-1);rankEl.textContent=ranks[rankIndex];levelEl.textContent=level;scoreEl.textContent=score;headerRankIcon.textContent=rankIcons[rankIndex];let player=leaderboardData.find(p=>p.name===playerNickname);player.rank=ranks[rankIndex];player.level=level;player.score=score;updateLeaderboard();}

// MINI TAP GAME
let miniScore=0,miniTimer;
function startMiniGame(){document.getElementById("miniGame").classList.remove("hidden");miniScore=0;document.getElementById("tapScore").textContent=0;let tapTime=10;document.getElementById("tapTime").textContent=tapTime;const tapButton=document.getElementById("tapButton");tapButton.onclick=()=>{miniScore++;document.getElementById("tapScore").textContent=miniScore;};miniTimer=setInterval(()=>{tapTime--;document.getElementById("tapTime").textContent=tapTime;if(tapTime<=0)endMiniGame();},1000);}
function endMiniGame(){clearInterval(miniTimer);score+=miniScore;document.getElementById("score").textContent=score;document.getElementById("miniGame").classList.add("hidden");updateLevelRank();generateQuestion();startTimer();}

// LEADERBOARD
function updateLeaderboard(){leaderboardData.sort((a,b)=>b.score-a.score);let html="";leaderboardData.forEach(d=>{html+=`<div class="boardRow"><span>${d.name}</span><span>${d.rank}</span><span>${d.level}</span><span>${d.score}</span></div>`;});boardContent.innerHTML=html;}

// LOSE
function loseGame(){clearInterval(timer);document.getElementById("loseBox").classList.remove("hidden");}

// CONTINUE & RESTART
function continueGame(){document.getElementById("loseBox").classList.add("hidden");generateQuestion();startTimer();}
function restartGame(){location.reload();}

// LEVEL UP
function closeLevelUp(){document.getElementById("levelUpBox").classList.add("hidden");generateQuestion();startTimer();}

// PREMIUM
function buyPremium(amount){hints+=parseInt(amount);alert(`You bought ${amount} hints! Total hints: ${hints}`);}

// DAILY REWARD
function checkDailyReward(){const lastDay=localStorage.getItem("lastRewardDay");if(lastDay!==today){document.getElementById("dailyReward").classList.remove("hidden");}}
function claimReward(){score+=5;document.getElementById("score").textContent=score;updateLevelRank();localStorage.setItem("lastRewardDay",today);document.getElementById("dailyReward").classList.add("hidden");}
checkDailyReward();

// START GAME
generateQuestion();startTimer();updateLeaderboard();