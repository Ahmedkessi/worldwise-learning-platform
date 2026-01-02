import "./styles.css";
import StartQuiz from "./GameComponents/StartQuiz";
import PlayQuiz from "./GameComponents/PlayQuiz";
import ResultQuiz from "./GameComponents/ResultQuiz";
import { useReducer } from "react";

const SECS_PER_QUESTION = 40;

const initialState = {
  questions: [],
  points: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  xp:0,
  page: 1,
  index: 0,
  secondsRemaining: null,
}

function reducer(state, action) {
    switch (action.type) {
      case `start`:
        return {
          ...state,
          page: 1,
        }

      case `play`:
        return {
          ...state,
          page: 2,
          questions: action.payload,
          secondsRemaining: 10 * SECS_PER_QUESTION,
        }


      case `finish`:
         return {
          ...state,
          page: 3
        }

      case `retry`:
        return {
          ...state,
          index: 0,
          points: 0,
          correctAnswers: 0,
          wrongAnswers: 0,
          xp: 0, 
          secondsRemaining: 10 * SECS_PER_QUESTION,
        }

      
      case `next`:
        return {
          ...state,
          index : state.index +1,
        }

      case `answered`:
        return {
          ...state,
          points: state.points + action.payload.points,
          correctAnswers: state.correctAnswers + action.payload.corrected,
          wrongAnswers: state.wrongAnswers + action.payload.wrong,
        }


      case "timeChange":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        page: state.secondsRemaining === 0 ? 3 : state.page,
      };

      case `addSec`: 
      return {
        ...state,
        secondsRemaining : state.secondsRemaining + 10,
      }
      
        
    
      default:
        return state;
    }
}



function QuizGame() {
  const [{page, index, points, questions, correctAnswers, wrongAnswers, secondsRemaining}, dispatch] = useReducer(reducer, initialState)


  return (
    <div className="quiz">
      {page === 1 && <StartQuiz dispatch={dispatch} />}
      {page === 2 && <PlayQuiz secondsRemaining={secondsRemaining} points={points} index={index} dispatch={dispatch} />}
      {page === 3 && <ResultQuiz dispatch={dispatch} points={points} wrongAnswers={wrongAnswers}
                                  questions={questions} correctAnswers={correctAnswers} />}
    </div>
  );
};

export default QuizGame;