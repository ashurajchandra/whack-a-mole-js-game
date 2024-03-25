import './App.css';
import { useRef, useState, useEffect } from 'react';

const imgItem = {
  hill: {
    isActive: true,
    src: "https://www.greatfrontend.com/img/questions/whack-a-mole/mole-hill.png"
  },
  mouse: {
    isActive: false,
    src: "https://www.greatfrontend.com/img/questions/whack-a-mole/mole-head.png"
  }
};

const images = new Array(9).fill({ ...imgItem });

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameOver, setGameOver] = useState(false);
  const [gameImages, setGameImages] = useState(images);
  const [score, setScore] = useState(0);
  let gameDurationTimerFlag
  let moleDurationFlag
useEffect(()=>{
    if(timeLeft==0){
        setGameStarted(true)
        return
    }
if(gameStarted){
    console.log("hiii",gameStarted)
    startGameDurationCountDown()
    updateMolePosition()
}
return(()=>{
    clearInterval(gameDurationTimerFlag)
    
})
},[gameStarted, timeLeft])



const updateMolePosition = ()=>{
  
    const randomIndex = Math.floor(Math.random() * gameImages.length)
    console.log("randomIndex",randomIndex)

    const updatedImages = gameImages.map((item,index)=>{
        if(index===randomIndex){
           return {
            ...item,
            mouse:{
                ...item.mouse,
                isActive:true
            }
           }
        }
        return item
    })
    setGameImages(updatedImages)

    moleDurationFlag= setTimeout(() => {
        clearTimeout(moleDurationFlag)
        const deactivatedImages = updatedImages.map((item, index) => {
          if (index === randomIndex) {
            return {
              ...item,
              mouse: {
                ...item.mouse,
                isActive: false
              }
            };
          }
          return item;
        });
        setGameImages(deactivatedImages);
    },1500)
}

const handleMoleClick = (moleIndex)=>{
    console.log("moleIndex",moleIndex)

  const updatedImages=  gameImages.map((item,index)=>{
        if(index==moleIndex){
            setScore(score+1)
            return {
                ...item,
                mouse:{
                    ...item.mouse,
                    isActive:false
                }
            }
        }
        return item
    })

    setGameImages(updatedImages)
}


const startGameDurationCountDown = ()=>{
    gameDurationTimerFlag = setInterval(()=>{
       if(timeLeft==0){
        setGameStarted(false)
        clearInterval(gameDurationTimerFlag)
        return
       }
       console.log("timeLeft",timeLeft)
    //    debugger
        setTimeLeft(prevState=>prevState-1)
       
    },1000)
}

const handleStartGame = ()=>{
    setScore(0)
    setGameStarted(true)
}
  const renderImg = (item, index, class1, class2) => {
    return (
      <div className="hill-wrapper" key={`${index}-${class1}-${class2}`}>
        <img className={class1} src={item.hill.src} alt={`${index}-img`} key={index} />
        {item.mouse.isActive && <img onClick={()=>handleMoleClick(index)} className={`${class2} ${item.mouse.isActive && "show-mole"}`} src={item.mouse.src} alt={`${index}-img`} key={index} />}
      </div>
    );
  };

  return (
    <div className="game-container">
      <div className="game-meta-info">
       
          <button className="start-game" onClick = {handleStartGame} >
            {!gameStarted?'Start Game':'Re-start'} 
          </button>
       
        <p className="score-info">Score: {score}</p>
         { gameStarted && (
          <div className="resume-game">
            {/* <p className="score-info">Score: {score}</p> */}
            {/* {gameOver && <p className="score-info">Game Over!</p>} */}
            {/* {!gameStarted && (
              <div>
                <p className="score-info">Final Score: {score}</p>
                <button className="restart-game" >
                  Restart Game
                </button>
              </div>
            )} */}
            {<p className="score-info">Time Left: {timeLeft}</p>}
          </div>
        )}
      </div>
      <div className="game-body">
        {gameImages.map((item, index) => renderImg(item, index, "game-hill", "game-mouse"))}
      </div>
    </div>
  );
}
