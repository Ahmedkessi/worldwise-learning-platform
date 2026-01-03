import { useState } from "react";
import "./styles.css";
import { QUIZ_CATEGORIES } from "../../../features/quizCategories";
import { useLocation } from "../../../hooks/LocationContext";
import { useNavigate } from "react-router-dom";


function QuizCategories() {
  
  const [isOpen, setIsOpen] = useState(false)
  const [currCateg, setCurrCateg] = useState(null)
  const {setQueCategory, setQueDificulity} = useLocation()
  const navigate = useNavigate();
  

  return (
    <div className="quiz-categories">
        <p className="title">Quiz Categories</p>
        <div className="category-box">   
         {QUIZ_CATEGORIES.map((categ, i) => <Category navigate={navigate} data={categ} i={i} key={categ.id} isOpen={isOpen} setIsOpen={setIsOpen} setQueDificulity={setQueDificulity}
                                                      currCateg={currCateg} setCurrCateg={setCurrCateg} setQueCategory={setQueCategory} />)}
        </div>
    </div>
  );
};

export default QuizCategories;



function Category({data, navigate, isOpen, setIsOpen, currCateg, setCurrCateg, i, setQueCategory, setQueDificulity}) { 
  const Icon = data?.icon;
  const [dificulity, setDificulity] = useState(`easy`)


  function handleOpen() {
    setCurrCateg(i)
    if(currCateg === i) setIsOpen(q => !q)
    else {setIsOpen(true)}
  }

  function handlePlay() {
    setQueCategory(data.id)
    setQueDificulity(dificulity)
    navigate(`/Quiz/QuizGame`)
  }
  
    return (
        <div className="category">
          <div className="list" onClick={handleOpen}>
            <div className="l"></div>
            <div className="l"></div>
            <div className="l"></div>
          </div>
          {currCateg === i && isOpen && <AdjustBox setDificulity={setDificulity} setIsOpen={setIsOpen} />}


            <Icon size={20} />
            <p>{data.name}</p> 
              {/* this was the first button i made but when i saw a friend as user used this button he clicked and thought it wont work so i changed this
              <button disabled={currCateg !== i} onClick={handlePlay}>Play</button>
              */}
            <button onClick={handlePlay}>Play</button>
        </div>
    )
}


function AdjustBox({setIsOpen, setDificulity}) {
  

  function handleSelect(e) {
    setIsOpen(false)
    setDificulity(e.target.innerHTML.toLowerCase())
  }

  return(
    <div className="adjust-box">
      <li onClick={(e)=> handleSelect(e)}>Easy</li>
      <li onClick={(e)=> handleSelect(e)}>Medium</li>
      <li onClick={(e)=> handleSelect(e)}>Hard</li>
    </div>
  )
}