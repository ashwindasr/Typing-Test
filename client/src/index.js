import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
// import Container from "reactstrap/es/Container";
// import Row from "reactstrap/es/Row";
import './App.css';

// import App1 from './App';

// SERVICES
import paragraphService from './services/paragraphService';
import historyService from './services/historyService';

// post_my_score = async () => {
// let res = historyService.post_my_score({
// 			'wpm': 40,
// 			'cpm': 400,
// 			'accuracy': 98,
// 			'description': ''
// 		});
// console.log(res);
// }


// post_my_score();

// import axios from 'axios';


// useEffect(() => {
//     if(!TEXT) {
//       get_string();
//     }
//   })


// var callApi = async () => {
// 	const response = await fetch('/api/get_string');
// 	if (response.status !== 200) throw Error('error');
// 	return response.data.text;
// };

// console.log(this.callApi);

// function get_string(async) {
// 	axios.get('/api/get_string')
// 	.then(response => {
// 		console.log(response.data.text);
// 		return response.data.text;
// 	})
// 	.catch(error => {
// 		console.log('error');
// 		return '';
// 	});
// };
// get_string();
// console.log(get_string());
// const TEXT = "React is an open source JavaScript library for building user interfaces. It is maintained by Facebook and a community of individual developers and companies. React can be used as a base in the development of single page or mobile applications.";
var TEXT = ' ... loading ...';
// var ddd = await get_string();

// this.text = get_string();
// console.log(ddd);

// callApi();

class Main extends React.Component {
	state = {
		text: '',
		inputValue: '',
		lastLetter: '',
		words: [],
		words_backup: [],
		completedWords: [],
		completed: false,
		startTime: undefined,
		timeElapsed: 0,
		wpm: 0,
		started: false,
		progress: 0,
		letters: 0,
		incorrect: 0
	};

	get_string = async () => {
		let res = await paragraphService.get_string();
		var num_letters = res.length;
		res = res.split(' ').join('# #');
		this.setState({
			text: res,
			words: res.split('#'),
			words_backup: res.split('#'),
			letters: num_letters
		});
	}
	// get_string;

	post_my_score = async () => {
		let res = await historyService.post_my_score({
    				'wpm': this.state.wpm,
    				'cpm': 0,
    				'accuracy': Math.round(((this.state.letters - this.state.incorrect) / this.state.letters) * 100),
    				'description': ''
    			});
	}

	startGame = () => {

		this.setState({
		text: '',
		inputValue: '',
		lastLetter: '',
		words: [],
		words_backup: [],
		completedWords: [],
		completed: false,
		startTime: undefined,
		timeElapsed: 0,
		wpm: 0,
		started: false,
		progress: 0,
		num_words: 0,
		letters: 0,
		incorrect: 0
	});
	};

	handleChange = e => {
		if (this.state.startTime === undefined) {
			console.log("start");
			this.state.startTime = Date.now();
		}
		const { words, completedWords, num_words, num_correct } = this.state;
		const inputValue = e.target.value;
		const lastLetter = inputValue[inputValue.length - 1];
		// console.log(inputValue, lastLetter);

		const currentWord = words[0];
		// console.log(lastLetter === currentWord[inputValue.length - 1]);

		this.setState({
			incorrect: lastLetter === currentWord[inputValue.length - 1] ? this.state.incorrect : this.state.incorrect + 1,
		});

		if (currentWord === undefined) {
			console.log('undefined word');
		}
		else if (inputValue.length === currentWord.length) {
			const newWords = [...words.slice(1)];
			const newCompletedWords = [...completedWords, inputValue];

			// Get the total progress by checking how much words are left
			const progress =
				(newCompletedWords.length /
					(newWords.length + newCompletedWords.length)) *
				100;
			const new_num_words = num_words + 1;
			// const new_correct
			this.setState({
				words: newWords,
				completedWords: newCompletedWords,
				inputValue: '',
				completed: newWords.length === 0,
				progress,
			});
		} else {
			this.setState({
				inputValue,
				lastLetter
			});
		}

		this.calculateWPM();
	};

	calculateWPM = () => {
		const { startTime, completedWords } = this.state;
		const now = Date.now();
		const diff = (now - startTime) / 1000 / 60;

		const wordsTyped = Math.ceil(
			completedWords.reduce((acc, word) => (acc += word.length), 0) / 5
		);

		// calculating the wpm
		const wpm = Math.ceil(wordsTyped / diff);
		// const acc = Math.round(((this.state.letters - this.state.incorrect) / this.state.letters) * 100);

		// console.log("wpm is",wpm, acc, this.state.incorrect);
		this.setState({
			wpm,
			timeElapsed: diff
		});
	};

	render() {
		const {
			text,
			words_backup,
			inputValue,
			completedWords,
			wpm,
			timeElapsed,
			started,
			completed,
			progress
		} = this.state;

		if (this.state.completed) {
			this.post_my_score();
		}


		if (!this.state.text) { this.get_string(); return <p>Loading...</p>;}

		
		return (
		<>
			<div>
				<div className='title-container'>
					<h4>Typing Speed Test</h4>
				</div>
				<hr />
			</div>
			<div>
				<div className='container'>
					<pre className='text'>
						{text.split('#').map((word, w_idx) => {
							let highlight = false;
							let currentWord = false;
							let color = 'red';

							// this means that the word is completed, so turn it green
							if (completedWords.length > w_idx) {
								// console.log(w_idx, completedWords);
								// console.log(completedWords[w_idx], words_backup[w_idx]);
								highlight = true;
								// const isWronglyTyped = letter !== inputValue[l_idx];
								if (completedWords[w_idx] === words_backup[w_idx]) {
									color = 'green';
								}
							}

							if (completedWords.length === w_idx) {
								currentWord = true;
							}

							return (
								<span
									className={`word 
                                ${highlight && color} 
                                ${currentWord && 'underline'}`}
									key={w_idx}>
									{word.split('').map((letter, l_idx) => {
										const isCurrentWord = w_idx === completedWords.length;
										const isWronglyTyped = letter !== inputValue[l_idx];
										const shouldBeHighlighted = l_idx < inputValue.length;

										return (
											<span
												className={`letter ${
													isCurrentWord && shouldBeHighlighted
														? isWronglyTyped
															? 'red'
															: 'green'
														: ''
												}`}
												key={l_idx}>
												{letter}
											</span>
										);
									})}
								</span>
							);
						})}
					</pre>
					{!completed &&
						<input
							type='text'
							placeholder="Type the text above"
							onChange={this.handleChange}
							value={inputValue}
							autofocus='true'
							className={completed && 'disabled-input' || !completed && 'input'}
						/>
					}
					{completed &&
						<input
							type='text'
							placeholder="You are faster than 50 % of our users!"
							onChange={this.handleChange}
							value={inputValue}
							autofocus='true'
							className='disabled-input'
						/>
					}
					{completed && <><div><button className='result-btn'>Speed: {this.state.wpm} wpm</button><button className='result-btn'>Accuracy: {Math.round(((this.state.letters - this.state.incorrect) / this.state.letters) * 100)} %</button></div></>}
					<div className="options">
						
						{completed && <button className='reset-btn' onClick={this.startGame}>Try Again</button>}
						{!completed && <button className='reset-btn' onClick={this.startGame}>Reset</button>}
						
					</div>
				</div>
			</div>
		</>
		);

	}
}

ReactDOM.render(<Main/>, document.getElementById('root'));
