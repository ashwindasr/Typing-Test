// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
import App1 from './App';
// import * as serviceWorker from './serviceWorker';

// ReactDOM.render(
//   <React.StrictMode>
//     <App/>
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.register();



import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from "reactstrap/es/Container";
import Row from "reactstrap/es/Row";
import './App.css';

function TypeText(props) {
    let text = props.text.split(" ");
    let mapper = text.map((item, index) =>
    	<>
            <span className="typing" id={"typeText" + index}>{item}</span>
            <span className="typing" id={"typeText" + index}>&nbsp;</span>
        </>
    );
    return (
        mapper
    );
}

const TEXT = "React is an open source JavaScript library for building user interfaces. It is maintained by Facebook and a community of individual developers and companies. React can be used as a base in the development of single page or mobile applications.";
class Main extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            myText: TEXT,
            words: TEXT.split(' '),
			completedWords: [],

            inputValue: '',
			lastLetter: '',
            myIndex: 0,
            totalIndex: TEXT.length - 1,
            letters: TEXT.replace(" ", "").length,
            incorrect: 0,
            totalTime: null, 
            timeElapsed: 0,
			wpm: 0,

			started: false,
            startTime: null,
			completed: false,
			progress: 0
        };
        this.checkKey = this.checkKey.bind(this)
    }


    checkKey(event) {
        let charCode = event.key.charCodeAt(0);
        if (event.key === "Enter") {
            let minutes = 1000 * 60;
            let d = new Date();
            let n = d.getTime();

            // Calculate total time
            this.totalTime = (n - this.state.startTime) / minutes;
            console.log("Total time: " + this.totalTime);

            let value = event.target.value;
            if (value.replace("\n", "") === this.state.myText) {
                console.log("Correct");
            } else {
                console.log("Incorrect");
            }
            event.target.value = "";

            document.getElementById("speed").innerHTML = "Your speed: " + Math.round(this.state.myText.split(" ").length / this.totalTime) + " WPM";
            document.getElementById("accuracy").innerHTML = "Your accuracy: " + Math.round(((this.state.letters - this.state.incorrect) / this.state.letters) * 100) + " %";
        } else if (event.key === "CapsLock" || event.key === "Shift") {
            console.log("caps");
        } else if (event.key === "Backspace") {
            if (this.state.myIndex === 0) {
                return;
            }

            this.setState({
                myIndex: this.state.myIndex - 1,
            });
            let temp = this.state.myIndex - 1;
            document.getElementById("typeText" + temp).style.color = "#000000";
        } else if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || charCode === 46) {
            if (this.state.myIndex > this.state.totalIndex) {
                return;
            }
            if (this.state.myText[this.state.myIndex] === event.key) {
                document.getElementById("typeText" + this.state.myIndex).style.color = "#00CC00";
                this.setState({
                    myIndex: this.state.myIndex + 1,
                });
            } else {
                document.getElementById("typeText" + this.state.myIndex).style.color = "#fc0303";
                this.setState({
                    myIndex: this.state.myIndex + 1,
                    incorrect: this.state.incorrect + 1,
                });
            }

        } else if (charCode === 32) {
            if (this.state.myIndex > this.state.totalIndex) {
                return;
            }
            this.setState({
                myIndex: this.state.myIndex + 1,
            });
        }

        console.log("index: " + this.state.myIndex);

        if (this.state.startTime == null) {
            let d = new Date();
            let n = d.getTime();

            // Get start time
            // this.state.startTime = n;
            this.setState({
				started: true,
				startTime: n,//Date.now(),
				completed: false,
				progress: 0
			});
        }
    }

    render() {
        return (
            <Container>
                <Row><h1 className="align-content-center">Speed Test</h1></Row>
                <Row className="myRow"><TypeText text={this.state.myText}/></Row>
                <Row><textarea id="textInput" onKeyDown={this.checkKey}/></Row>
                <Row className="speed-div">
                    <div id="speed"></div>
                </Row>
                <Row className="accuracy-div">
                    <div id="accuracy"></div>
                </Row>
            </Container>
        );
    }


}


ReactDOM.render(<Main/>, document.getElementById("root"));



// render() {
// 	return (
// 		<div id="app"></div>
// 	);
// }


// class App extends React.Component {
// 	state = {
// 		text: '',
// 		inputValue: '',
// 		lastLetter: '',
// 		words: [],
// 		completedWords: [],
// 		completed: false,
// 		startTime: undefined,
// 		timeElapsed: 0,
// 		wpm: 0,
// 		started: false,
// 		progress: 0
// 	};

// 	setText = () => {
// 		const texts = [
// 			`You never read a book on psychology, Tippy. You didn\'t need to. You knew by some divine instinct that you can make more friends in two months by becoming genuinely interested in other people than you can in two years by trying to get other people interested in you.`,
// 			`I know more about the private lives of celebrities than I do about any governmental policy that will actually affect me. I'm interested in things that are none of my business, and I'm bored by things that are important to know.`,
// 			`A spider's body consists of two main parts: an anterior portion, the prosoma (or cephalothorax), and a posterior part, the opisthosoma (or abdomen).`,
// 			`As customers of all races, nationalities, and cultures visit the Dekalb Farmers Market by the thousands, I doubt that many stand in awe and contemplate the meaning of its existence. But in the capital of the Sunbelt South, the quiet revolution of immigration and food continues to upset and redefine the meanings of local, regional, and global identity.`,
// 			`Outside of two men on a train platform there's nothing in sight. They're waiting for spring to come, smoking down the track. The world could come to an end tonight, but that's alright. She could still be there sleeping when I get back.`,
// 			`I'm a broke-nose fighter. I'm a loose-lipped liar. Searching for the edge of darkness. But all I get is just tired. I went looking for attention. In all the wrong places. I was needing a redemption. And all I got was just cages.`
// 		];
// 		const text = texts[Math.floor(Math.random() * texts.length)];
// 		const words = text.split(' ');

// 		this.setState({
// 			text,
// 			words,
// 			completedWords: []
// 		});
// 	};

// 	startGame = () => {
// 		this.setText();

// 		this.setState({
// 			started: true,
// 			startTime: Date.now(),
// 			completed: false,
// 			progress: 0
// 		});
// 	};

// 	handleChange = e => {
// 		const { words, completedWords } = this.state;
// 		const inputValue = e.target.value;
// 		const lastLetter = inputValue[inputValue.length - 1];

// 		const currentWord = words[0];

// 		// if space or '.', check the word
// 		if (lastLetter === ' ' || lastLetter === '.') {
// 			// check to see if it matches to the currentWord
// 			// trim because it has the space
// 			if (inputValue.trim() === currentWord) {
// 				// remove the word from the wordsArray
// 				// cleanUp the input
// 				const newWords = [...words.slice(1)];
// 				const newCompletedWords = [...completedWords, currentWord];

// 				// Get the total progress by checking how much words are left
// 				const progress =
// 					(newCompletedWords.length /
// 						(newWords.length + newCompletedWords.length)) *
// 					100;
// 				this.setState({
// 					words: newWords,
// 					completedWords: newCompletedWords,
// 					inputValue: '',
// 					completed: newWords.length === 0,
// 					progress
// 				});
// 			}
// 		} else {
// 			this.setState({
// 				inputValue,
// 				lastLetter
// 			});
// 		}

// 		this.calculateWPM();
// 	};

// 	calculateWPM = () => {
// 		const { startTime, completedWords } = this.state;
// 		const now = Date.now();
// 		const diff = (now - startTime) / 1000 / 60; // 1000 ms / 60 s

// 		// every word is considered to have 5 letters
// 		// so here we are getting all the letters in the words and divide them by 5
// 		// "my" shouldn't be counted as same as "deinstitutionalization"
// 		const wordsTyped = Math.ceil(
// 			completedWords.reduce((acc, word) => (acc += word.length), 0) / 5
// 		);

// 		// calculating the wpm
// 		const wpm = Math.ceil(wordsTyped / diff);

// 		this.setState({
// 			wpm,
// 			timeElapsed: diff
// 		});
// 	};

// 	render() {
// 		const {
// 			text,
// 			inputValue,
// 			completedWords,
// 			wpm,
// 			timeElapsed,
// 			started,
// 			completed,
// 			progress
// 		} = this.state;

// 		if (!started)
// 			return (
// 				<div className='container'>
// 					<h2>Welcome to the Typing game</h2>
// 					<p>
// 						<strong>Rules:</strong> <br />
// 						Type in the input field the highlighted word. <br />
// 						The correct words will turn <span className='green'>green</span>.
// 						<br />
// 						Incorrect letters will turn <span className='red'>red</span>.
// 						<br />
// 						<br />
// 						Have fun! 😃
// 					</p>
// 					<button className='start-btn' onClick={this.startGame}>
// 						Start game
// 					</button>
// 				</div>
// 			);

// 		if (!text) return <p>Loading...</p>;

// 		if (completed) {
// 			return (
// 				<div className='container'>
					
// 				</div>
// 			);
// 		}

// 		return (
// 			<div>
// 				<div className='wpm'>
// 					<strong>WPM: </strong>
// 					{wpm}
// 					<br />
// 					<strong>Time: </strong>
// 					{Math.floor(timeElapsed * 60)}s
// 				</div>
// 				<div className='container'>
// 					<h4>Type the text below</h4>
// 					<progress value={progress} max='100'></progress>
// 					<p className='text'>
// 						{text.split(' ').map((word, w_idx) => {
// 							let highlight = false;
// 							let currentWord = false;

// 							// this means that the word is completed, so turn it green
// 							if (completedWords.length > w_idx) {
// 								highlight = true;
// 							}

// 							if (completedWords.length === w_idx) {
// 								currentWord = true;
// 							}

// 							return (
// 								<span
// 									className={`word 
//                                 ${highlight && 'green'} 
//                                 ${currentWord && 'underline'}`}
// 									key={w_idx}>
// 									{word.split('').map((letter, l_idx) => {
// 										const isCurrentWord = w_idx === completedWords.length;
// 										const isWronglyTyped = letter !== inputValue[l_idx];
// 										const shouldBeHighlighted = l_idx < inputValue.length;

// 										return (
// 											<span
// 												className={`letter ${
// 													isCurrentWord && shouldBeHighlighted
// 														? isWronglyTyped
// 															? 'red'
// 															: 'green'
// 														: ''
// 												}`}
// 												key={l_idx}>
// 												{letter}
// 											</span>
// 										);
// 									})}
// 								</span>
// 							);
// 						})}
// 					</p>
// 					<input
// 						type='text'
// 						onChange={this.handleChange}
// 						value={inputValue}
// 						autofocus={started ? 'true' : 'false'}
// 					/>
// 				</div>
// 			</div>
// 		);
// 	}
// }

// ReactDOM.render(<App />, document.getElementById('app'));

