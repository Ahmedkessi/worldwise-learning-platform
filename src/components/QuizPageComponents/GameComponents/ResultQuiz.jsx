import "./styles.css";
import { useSelector, useDispatch } from "react-redux";
import { quizCompleted, addToLearned } from "../../../features/QuizSlice";
import { useNavigate } from "react-router-dom";
import { useFavourites } from "../../../hooks/FavoritesContext";


function ResultQuiz({ dispatch, points, questions, correctAnswers, wrongAnswers }) {
  const profile = useSelector(store => store.user.profile);
  const dispatchGame = useDispatch();
  const navigate = useNavigate();
  const { setQues, ques, favouriteCountries } = useFavourites();

  const totalQuestions = questions?.length || 0;
  const accuracy = totalQuestions > 0
    ? Math.round((correctAnswers / totalQuestions) * 100)
    : 0;

  const xp = Math.floor(points / 10);

  const currCountry = favouriteCountries?.find(
    c => c.name === ques?.name
  );
  

  const score = `${correctAnswers} / ${totalQuestions}`;
  const currCountryID = currCountry?.id;

  function finalizeQuiz() {
    dispatchGame(
      quizCompleted(
        xp,
        points,
        correctAnswers,
        wrongAnswers,
      )
    );

    if (ques?.questions?.length > 0 && accuracy >= 70 && currCountryID && accuracy && score) {
      dispatchGame(addToLearned(currCountryID, score, accuracy));
    }

    setQues({});
  }

  function handleRetry() {
    finalizeQuiz();
    dispatch({ type: "start" });
  }

  function handleClose() {
    finalizeQuiz();
    navigate("/Quiz/QuizDashboard");
  }

  return (
    <div className="quiz-result">
        <p className="top-corrected">.<span>Corrected Answers: {correctAnswers}/{questions.length}</span></p>
        <div className="quiz-result-main">
            <div className="user-box">
                
                <div className="result-box-1">
                    <div className="result-box-2">
                        <div className="img">
                            <img src={profile.avatar} alt="avatar" />
                        </div>
                        <br />
                        <p>{profile.username}</p>
                        <div className="xp"><div><span>XP</span></div> +{xp}</div>
                    </div>
                </div>

                <p className="hambalyo">
                   🎉 Congratulations! <br /> 
                You`ve completed this quiz.
                </p>


                <div className="result-lists">
                    <p>Points: <span>{points}</span></p>
                    <p>Accuracy: <span>{accuracy}%</span></p>
                    <p></p>
                </div>

                <p className="keep">Lets keep testing your knowledge by playing more quizes</p>


                <div className="btns">
                    <button onClick={handleRetry}>Rety</button>
                    <button onClick={handleClose}>Exit</button>
                </div>


            </div>
        </div>
    </div>
  );
}

export default ResultQuiz;
