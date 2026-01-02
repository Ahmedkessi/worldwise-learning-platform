import { Link } from "react-router-dom";
import "./styles.css";
import { useEffect, useMemo, useState } from "react";
import Timer from "./Timer";
import { useLocation } from "../../../hooks/LocationContext";
import { useFavourites } from "../../../hooks/FavoritesContext";

function shuffleArray(array) {
  return [...array]
    .map(v => ({ v, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ v }) => v);
}

function decodeHTML(text = "") {
  const txt = document.createElement("textarea");
  txt.innerHTML = text;
  return txt.value;
}


export default function PlayQuiz({
  index,
  points,
  dispatch,
  secondsRemaining,
}) {
  const { questions } = useLocation();
  const { setQues } = useFavourites();

  const [locked, setLocked] = useState(false);
  const [showNext, setShowNext] = useState(false);

  const currQuestion = questions?.[index];

  useEffect(() => {
    if (index >= questions.length) {
      dispatch({ type: "finish" });
    }
  }, [index, questions.length, dispatch]);


  useEffect(() => {
    setLocked(false);
    setShowNext(false);
  }, [index]);


  const answers = useMemo(() => {
    if(currQuestion){
        return shuffleArray([
            ...currQuestion.incorrect_answers,
            currQuestion.correct_answer,
        ]);
    }
  }, [index, currQuestion?.correct_answer, currQuestion?.incorrect_answers]);


  if (!currQuestion) return null;

  const difficulty = currQuestion.difficulty;
  const POINTS_PER_QUESTION =
    difficulty === "easy" ? 10 :
    difficulty === "medium" ? 20 : 30;

  const totalPoints = questions.length * POINTS_PER_QUESTION;


  const progressWidth = ((index) / questions.length) * 100;

  function handleNext() {
    dispatch({ type: "next" });
  }

  function handleExit() {
    setQues({});
  }


  
  return (
    <div className="play-quiz">
      {/* Header */}
      <div className="play-header">
        <Link to="/Quiz/QuizDashboard" onClick={handleExit} className="back-tab">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" clipRule="round"></g><g id="SVGRepo_iconCarrier"> <path worldsense="evenodd" clipRule="evenodd" d="M11.7071 4.29289C12.0976 4.68342 12.0976 5.31658 11.7071 5.70711L6.41421 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H6.41421L11.7071 18.2929C12.0976 18.6834 12.0976 19.3166 11.7071 19.7071C11.3166 20.0976 10.6834 20.0976 10.2929 19.7071L3.29289 12.7071C3.10536 12.5196 3 12.2652 3 12C3 11.7348 3.10536 11.4804 3.29289 11.2929L10.2929 4.29289C10.6834 3.90237 11.3166 3.90237 11.7071 4.29289Z" fill="#ffffff"></path> </g></svg>

        </Link>
        <p>Question {index + 1}/{questions.length}</p>
        <p className="reset" onClick={() => dispatch({ type: "retry" })}>↩️</p>
      </div>

      {/* Progress */}
      <div className="game-process">
        <div className="game-progress">
          <div className="pro" style={{ width: `${progressWidth}%` }} />
        </div>
        <div className="game-progress-info">
          <p>Points: {points}/{totalPoints}</p>
          <p className={`dif ${difficulty || `medium`}`}>{difficulty || `medium`}</p>
        </div>
      </div>

      {/* Question */}
      <div className="question-card">
        <p className="question">{decodeHTML(currQuestion.question)}</p>
      </div>

      {/* Answers */}
      <div className="answers">
        {answers.map((ans, i) => (
          <Answer
            key={i}
            ans={ans}
            index={i}
            correct={currQuestion.correct_answer}
            locked={locked}
            setLocked={setLocked}
            dispatch={dispatch}
            points={POINTS_PER_QUESTION}
            setShowNext={setShowNext}
            type={currQuestion?.type}
            ind={index}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="btns">
        <button className="answer time">
            <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
        </button>
        {showNext && (
          <button className="answer next" onClick={handleNext}>
            Next →
          </button>
        )}
        <button className="answer time" onClick={()=> dispatch({type: `addSec`})}>+10</button>
      </div>
    </div>
  );
}





function Answer({
  ans,
  index,
  correct,
  locked,
  setLocked,
  dispatch,
  points,
  setShowNext,
  type,
  ind,
}) {
  const isCorrect = ans === correct;
  const [currClick, setCurrClick] = useState(false)

  useEffect(() => {
    setCurrClick(false)
  }, [ind]);

  function handleClick() {
    if (locked) return;
    setCurrClick(true)
    dispatch({
      type: "answered",
      payload: {
        corrected: isCorrect ? 1 : 0,
        wrong: isCorrect ? 0 : 1,
        points: isCorrect ? points : 0,
      },
    });

    setLocked(true);
    setShowNext(true);
  }

  return (
    <button
      className={`answer ${
        currClick ? (isCorrect ? "correct" : "wrong") : ""
      }`}
      onClick={handleClick}
      disabled={locked}
    >
      {type === `image` ? 
      <img src={ans} alt="answer_flag" /> 
    :
      <div>{(index+1)} )  {decodeHTML(ans)}</div>
    }
    </button>
  );
}
