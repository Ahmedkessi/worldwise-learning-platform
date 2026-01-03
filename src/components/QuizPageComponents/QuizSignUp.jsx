import "./styles.css";
import Button from "../UIComponents/Button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Error from "../UIComponents/Error";
import { loadUser } from "../../features/QuizSlice";
import store from "../../store/store";
import LoadingPageSpinner from "../UIComponents/LoadingPageSpinner";
import UploadAvatar from "./UploadAvatar";
import { useSelector } from "react-redux";

function QuizSignUp() {
  const [username, setUsername] = useState(``);
  const [password, setPassword] = useState(``);
  const [error, setError] = useState(false);
  const [back, setBack] = useState(false);

  const [showAvatarPage, setShowAvatarPage] = useState(false);
  const defAvatar = useSelector((store) => store?.user?.profile?.avatar);
  const image = defAvatar
    ? defAvatar
    : `https://avatar.iran.liara.run/public/39`;
  const [avatarImg, setAvatarImg] = useState(image);

  const navigate = useNavigate();

  
function signup(username, password, avatar) {
  const users = JSON.parse(localStorage.getItem("WorldWise_users")) || {};

  if (users[username]) {
    setError("Username already exists");
    return;
  }

  
 

  





  


  const newUser = {
    profile: { username, password, avatar },
    createdAt: new Date().toISOString().split("T")[0],
    progress: { level: 1, xp: 0, streak: 0 },
    daily: {
      date: null,
      gamesPlayedToday: 0,
      rewardClaimed: false,
    },
    stats: {
      quizzesPlayed: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      accuracy: 0,
      points: 0,
      countriesLearned: 0,
    },
    lessonQuizCompleted: 0,
    favouriteCountries: [],
    achievements: [],
    notifications: [],
  };

  users[username] = newUser;

  localStorage.setItem("WorldWise_users", JSON.stringify(users));
  localStorage.setItem("WorldWise_currentUser", username);

  store.dispatch(loadUser(users[username]));
}


  function handlerSubmit(e) {
    e.preventDefault();
    if (back) {
      navigate(`/`);
      return;
    }

    setError(``);
    if (!username || !password || !avatarImg.length > 0) {
      setError(`please fill this form...`);
      return;
    }

    signup(
      capitalize(username),
      password.trim().split(` `).join(``),
      avatarImg
    );
    navigate(`/Quiz`);
  }

  function handleUploadAvatar() {
    setShowAvatarPage(true);
  }

  function handleBack() {
    setBack(true);
  }

  return showAvatarPage ? (
    <UploadAvatar
      avatarImg={avatarImg}
      setAvatarImg={setAvatarImg}
      setShowAvatarPage={setShowAvatarPage}
    />
  ) : (
    <div className="login">
      <div className="login--contaiener">
        <div className="box-1">
          <div className="welcome">
            <p className="title">Welcome to the Ultimate Quiz Challenge! 🎉</p>
            <p className="intro">
              Sharpen your mind, test your knowledge, and compete for the top
              spot. You’ll answer fun and challenging questions across different
              categories. Each correct answer earns you points — the faster you
              respond, the higher your score! Ready to prove yourself? Log in
              and start your journey to becoming a quiz master
            </p>
          </div>
        </div>

        <div className="login-box">
          <p className="title">Sign up to begin</p>
          <p className="intro">
            Create username and password to access your personalized dashboard.
          </p>
          <p className="nb">
            NOTE: YOU CANNOT CHANGE YOUR NAME ONCE YOU CREATED <br />
            <span>make sure to choose good name</span>
          </p>

          <form onSubmit={(e) => handlerSubmit(e)}>
            <div className="img" onClick={handleUploadAvatar}>
              <img src={avatarImg} alt="avatar" />
            </div>
            <input
              type="text"
              placeholder="Enter Your Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="password"
              placeholder="Enter Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error.length > 0 ? (
              <div className="err">
                <Error type={`small`} msg={error}></Error>
              </div>
            )  : ``}

            <div className="btns">
              <Button handleClick={handleBack}>Back</Button>
              <Button>Sign in</Button>
            </div>
          </form>

          <br />
          <p className="footer">
            Already have an account? <Link to={`/Quiz/QuizLogin`}>Log in</Link>{" "}
            and join the fun!
          </p>
        </div>
      </div>
    </div>
  );
}

export default QuizSignUp;




function capitalize(string) {
  return string
    .trim()
    .toLocaleLowerCase()
    .split(` `)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(` `);
}
