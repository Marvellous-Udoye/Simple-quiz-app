import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isOptionClicked, setIsOptionClicked] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [correctOption, setCorrectOption] = useState(null);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const fetchData = async () => {
    try {
      const response = await fetch('/data.json');
      if (!response) {
        throw new Error('Unable to fetch questions');
      }
      const data = await response.json();
      return data;
    } catch (e) {
      setError('Error:', e.message);
    }
  };

  useEffect(() => {
    const getData = async () => {
      const data = await fetchData();
      if (data) {
        setQuestions(data);
        setLoading(false);
      } else {
        setLoading(false);
        setError('Unable to fetch questions');
      }
    };
    getData();
  }, []);

  const currentQuestion = questions[currentQuestionIndex];

  const handleClickedOption = (option) => {
    setSelectedOption(option);
    setIsOptionClicked(true);

    if (option === currentQuestion.answer) {
      setCorrectOption(true);
      setScore(score + 1);
    } else {
      setCorrectOption(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsOptionClicked(false);
      setSelectedOption(null);
      setCorrectOption(null);
    } else {
      setIsQuizCompleted(true);
    }
  };

  const handlePlayAgain = () => {
    setCurrentQuestionIndex(0);
    setIsQuizCompleted(false);
    setIsOptionClicked(false);
    setSelectedOption(null);
    setCorrectOption(null);
    setScore(0);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="quiz_container">
      <h3 className="quizName">Frontend Dev. Quiz</h3>

      {isQuizCompleted ? (
        <>
          <p>You scored {score} out of {questions.length}</p>
          <div onClick={handlePlayAgain} className="next_button">
            <button>Play Again</button>
          </div>
        </>
      ) : (
        <>
          {currentQuestion && (
            <div key={currentQuestionIndex} className="quiz">
              <p className="question">
                {currentQuestionIndex + 1}. {currentQuestion.question}
              </p>

              <div className="question_container">
                {currentQuestion.options.map((option, optionIndex) => (
                  <p
                    key={optionIndex}
                    onClick={() => !isOptionClicked && handleClickedOption(option)}
                    className={`option 
                      ${isOptionClicked && (option === currentQuestion.answer ? 'correct' : option === selectedOption ? 'incorrect' : '')}
                    `}
                  >
                    {option}
                  </p>
                ))}
              </div>
            </div>
          )}

          {isOptionClicked && (
            <div onClick={handleNextQuestion} className="next_button">
              <button>{currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'}</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
