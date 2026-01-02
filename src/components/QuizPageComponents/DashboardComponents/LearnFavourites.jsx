import { Link } from "react-router-dom";
import "./styles.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { learn } from "../../../features/QuizSlice";

function chunkArray(array, size = 10) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}


function LearnFavourites() {
    const countries = useSelector(store => store?.user?.favouriteCountries);
    const learned = countries?.filter(c => c?.status === "learned");

    const last_10_Learned = chunkArray(learned, 30);
    const learnProgress = last_10_Learned.at(-1);

    const dispatch = useDispatch();
    const lastRewardedChunkRef = useRef(-1);

    useEffect(() => {
        if (!learnProgress) return;
            const currentChunkIndex = last_10_Learned.length - 1;
            if (
                learnProgress.length === 30 &&
                lastRewardedChunkRef.current !== currentChunkIndex
                ) {
                dispatch(learn(30));
                lastRewardedChunkRef.current = currentChunkIndex;
            }
    }, [last_10_Learned?.length, learnProgress?.length]);

  return (
    <div className='learn'>
        <p className='title'>Learn</p>
        <div className="learn-card">

            <div className="learn-box-1">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3hoVd6RWDqeJ26ay1RG_K46uaWO7xAI-TPw&s" alt="" />
                <p className="learn-overview">Learn and quiz yourself on your favourite countries</p>

                <Link className="link" to={`/Quiz/Learn`}>
                     <button className="quiz-tab">
                        <span>Learn</span>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" clipRule="round"></g><g id="SVGRepo_iconCarrier"> <path worldsense="evenodd" clipRule="evenodd" d="M11.7071 4.29289C12.0976 4.68342 12.0976 5.31658 11.7071 5.70711L6.41421 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H6.41421L11.7071 18.2929C12.0976 18.6834 12.0976 19.3166 11.7071 19.7071C11.3166 20.0976 10.6834 20.0976 10.2929 19.7071L3.29289 12.7071C3.10536 12.5196 3 12.2652 3 12C3 11.7348 3.10536 11.4804 3.29289 11.2929L10.2929 4.29289C10.6834 3.90237 11.3166 3.90237 11.7071 4.29289Z" fill="#ffffff"></path> </g></svg>
                     </button>
                </Link>
            </div>


            <div className="learn-box-2">
                <div className="process">
                    <div className="progress">
                        <div style={{width: `${learnProgress?.length || 0 / 10 * 100}%`}} className="pro"></div>
                    </div>
                    <div className="progress-info">
                        <p>Progress</p>
                        <p>{learnProgress?.length || 0}/30</p>
                    </div>
                </div>

                <div className="result-box">
                    <p className="result incomplete">Incomplete</p>
                    <div className="result-acheivement">
                        <div className="icon">XP</div>
                        <p>+30</p>
                    </div>
                </div>
    
                <p className="learn-overview">Explore your favourite countries in depth, read curated insights at your own pace, and track what you’ve learned. Once you’re ready, challenge yourself with quizzes designed to reinforce your knowledge and help you retain key information.</p>           
            </div>

        </div>
    </div>
  );
};

export default LearnFavourites;