import React, { useEffect, useState } from 'react'
import './App1.css';

const hillSrc = "https://www.greatfrontend.com/img/questions/whack-a-mole/mole-hill.png"
const moleSrc = "https://www.greatfrontend.com/img/questions/whack-a-mole/mole-head.png"
export default function App1() {
  return (
    <WhackAMole
    rows={3}
    columns = {3}
    gameDuration = {15}
    moleDuration = {1500}
    moleToAppear = {2}
    score = {0}
    />
  )
}




function WhackAMole ({
    columns = 3,
    rows = 3,
    gameDuration = 15,
    moleAppearingDuration = 1500,
    moleToAppear = 1,
}){
    const [isRunning , setIsRunning] = useState(false)
    const [score,setScore] = useState(0)
    const [timeLeft , setTimeLeft] = useState(gameDuration)
    let timeLeftFlag
    let lastRenderTime =0
    useEffect(()=>{
        let moleAnimationId;

        const animateMoles = (timestamp) => {
          if (isRunning && timeLeft > 0) {
            moleAnimationId = requestAnimationFrame(animateMoles);
            const currentTime = performance.now();
            if (currentTime - lastRenderTime > moleAppearingDuration) {
              renderMole();
              lastRenderTime = currentTime;
            }
          }
        };
      
        animateMoles();
      
        return () => {
          cancelAnimationFrame(moleAnimationId);
        };

    },[isRunning,moleToAppear, moleAppearingDuration,timeLeft  ])

    useEffect(()=>{
        return ()=>{
            clearInterval(timeLeftFlag)
          }
    },[])

    const handleStartGame = () =>{
        setScore(0)
        setTimeLeft(15)
        setIsRunning(true)

        timeLeftFlag = setInterval(()=>{
        setTimeLeft((prevValue=>{
            if(prevValue<=0){
                setIsRunning(false)
                // const getMoles = document.querySelectorAll('.mole-Img')
                // getMoles.forEach(item=>{
                //     item.style.display="none"
                //     console.log("item",item)
                // })
                return 0
            }
            return prevValue -1 
        }))

        },1000)
    }

    const renderMole = ()=>{
     const randomRow = Math.floor(Math.random()*rows)
     const randomColumn = Math.floor(Math.random()*columns)
     console.log("randomRow",randomRow)
     console.log("randomColumn",randomColumn)
    return <Mole row={randomRow+1} column={randomColumn+1} />

    }

    const handleMoleClick = (e,row,column)=>{
      setScore(prevScore=>prevScore+1)
      const moleElement = document.querySelector(`[data-mole="${row}-${column}"]`);
      if (moleElement) {
        moleElement.style.display = 'none';
        console.log("moleElement",moleElement)
        console.log("hello")
      }
    }
    const Mole = ({row,column})=>{
        return <img data-mole={`${row}-${column}`} row={row} column={column} onClick={(e)=>handleMoleClick(e,row,column)} className='mole-Img' style={{gridColumnStart:column, gridRowStart:row }}  src={moleSrc} alt='alt-img'/>
    }

const renderHills = (rows,columns)=>{
   const result =  Array.from({length:rows}).map((_,rowIndex)=>(
    Array.from({length:columns}).map((_,colIndex)=>(
         <Hill key={`${rowIndex}-${colIndex}`} row={rowIndex+1} column={colIndex+1}  />
       )) 
    ))

    console.log("result",result)

    return result
    
  
}

const Hill = ({row,column})=>{

    return <img className='hillImg' style={{gridColumnStart:column, gridRowStart:row }}  src={hillSrc} alt='hill-img'/>
}

console.log("hello")
  return (
   <div className='game-wrapper'>
    {
        (isRunning || score>0)? (<div className='game-score'>
            <p>Score: {score}</p>
            {timeLeft==0 && <button onClick={handleStartGame}>Play Again</button>}
            <p>Time Left: {timeLeft}</p>
        </div>)
        :
    <button className='start-game' onClick={handleStartGame}>Start Game</button>
    }
     <div className='game-area' style={{display:'grid', gridColumnTemplate:`repeat (${columns}, 1fr)`, gridRowTemplate:`repeat (${rows}, 1fr)` }}>
        {renderHills(rows,columns)}
       { (isRunning && timeLeft>0) && Array.from({length:moleToAppear}).map((_,index)=>renderMole())}
    </div>
   </div>
  )
}