import React from "react";
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Services
import paragraphService from './services/paragraphService';
import historyService from './services/historyService';

class Main extends React.Component {
	state = {
		text: '',
		words: [],
		word_last_index: [],
		colors: [],
		cursor: 0,
		word_cursor: 0,
		inputText: '',
		completed: false,
		start_time: undefined,
		timeElapsed: 0,
		wpm: 0,
		cpm: 0,
		accuracy: 0,
		percentile: null,
		incorrect_count: 0,
		num_letters: 0
	};

	// get the string to type
	get_string = async () => {
		let res = await paragraphService.get_string();
		var num_letters = res.length;
		const word_last_index = res.split('').reduce(function(a, e1, i) {
		    if (e1 === ' ') {
		    	a.push(i-1);
		    	a.push(i);
		    }
		    return a;
		}, [])
		this.setState({
			text: res,
			words: res.split(' ').join('# #').split('#'),
			num_letters: num_letters,
			colors: Array(num_letters).fill(false),
			word_last_index
		});
	}
	
	// get speed & percentile of the user
	get_percentile = async () => {
		let res = await historyService.get_percentile();
		// console.log(res);
		this.setState({
			percentile: res.percentile
		});
	}

	// post user score
	post_my_score = async () => {
		let res = await historyService.post_my_score({
					'wpm': this.state.wpm,
					'cpm': this.state.cpm,
					'accuracy': this.state.accuracy,
					'description': ''
    	});
		console.log(res);
	}

	// start game
	startGame = () => {
		this.setState({
			text: '',
			words: [],
			word_last_index: [],
			colors: [],
			cursor: 0,
			word_cursor: 0,
			inputText: '',
			completed: false,
			start_time: undefined,
			timeElapsed: 0,
			wpm: 0,
			cpm: 0,
			accuracy: 0,
			percentile: null,
			incorrect_count: 0,
			num_letters: 0
		});
	};

	calculateWPM = () => {
		const {
			start_time,
			words,
			num_letters,
			incorrect_count
		} = this.state;
		const num_words = Math.ceil(
			words.reduce((acc, word) => (acc += word !== ' ' ? 1 : 0), 0)
		);
		const now = Date.now();
		const diff = (now - start_time) / 1000 / 60;
		const wpm = Math.ceil(num_words / diff);
		const cpm = Math.ceil(num_letters / diff);
		const accuracy = Math.round(((num_letters - incorrect_count) / num_letters) * 100);
		// console.log(wpm, diff);
		this.setState({
			wpm,
			cpm,
			accuracy,
			timeElapsed: diff
		});
	};

	handleChange = e => {
		// start time at first key stroke
		if (this.state.start_time === undefined) {
			console.log("start");
			this.setState({
				start_time: Date.now()
			});
		}

		// get state
		const { 
			text,
			inputText,
			colors,
			incorrect_count,
			cursor,
			word_cursor,
			word_last_index
		} = this.state;

		let lastLetter = e.key;
		var new_colors = colors;

		// handle backspace, Shift & Capslock
		if (lastLetter !== 'Backspace') {
			if (lastLetter === 'Shift' || lastLetter === 'CapsLock') {
				return;
			}
			const newInputText = inputText + lastLetter;
			const new_cursor = cursor + 1;
			const new_word_cursor = word_last_index.includes(cursor) ? word_cursor + 1 : word_cursor;
			new_colors[cursor] = lastLetter === text[cursor] ? 'green' : 'red';
			var new_incorrect_count = lastLetter === text[cursor] ? incorrect_count : incorrect_count + 1;
			this.setState({
				inputText: newInputText,
				cursor: new_cursor,
				word_cursor: new_word_cursor,
				colors: new_colors,
				incorrect_count: new_incorrect_count,
				completed: newInputText.length === text.length ? true : false
			});
		} else {
			if (cursor === 0) {
				return;
			}
			const newInputText = inputText.slice(0, inputText.length - 1);
			new_colors[cursor - 1] = false;
			const new_word_cursor = word_last_index.includes(cursor - 1) ? word_cursor - 1 : word_cursor;
			// console.log(new_word_cursor, cursor, inputText, inputText.length, inputText[inputText.length - 1]);
			const new_cursor = cursor - 1;
			this.setState({
				inputText: newInputText,
				cursor: new_cursor,
				word_cursor: new_word_cursor,
				colors: new_colors,
			});
		}
		this.calculateWPM();
	};

	render() {
		const {
			words,
			completed,
			word_cursor,
			colors,
			wpm,
			accuracy,
			percentile
		} = this.state;

		if (!this.state.text) {
			this.get_string();
			return 'Loading...';
		}

		// post result & get percentile
		if (completed && !percentile) {
			this.post_my_score();
			this.get_percentile();
		}

		var char_idx = -1;

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
						{words.map((word, w_idx) => {
							return (
								<span
									className={`word ${!completed && word_cursor === w_idx && 'underline'}`}
									key={w_idx}>
										{word.split('').map((letter, l_idx) => {
											char_idx += 1;
											return (
												<span
													className={`letter ${colors[char_idx]}`}
													key={char_idx}>
													{letter}
												</span>
											);
										})}
								</span>
							);
						})}
					</pre>
					<div>
						{!completed &&
							<input
								type='text'
								placeholder="Type the text above"
								onKeyDown={this.handleChange}
								defaultValue=''
								autoFocus={true}
								className='input'
							/>
						}
						{completed &&
							<input
								type='text'
								placeholder={`You are faster than ${percentile}% of our users!`}
								className='disabled-input'
							/>
						}
					</div>
						{completed &&
							<div>
								<button className='result-btn'>
									<span>Speed: {wpm} wpm</span>
									<span>Accuracy: {accuracy} %</span>
								</button>
							</div>
						}
					<div className="options">
						{completed && 
							<button className='reset-btn' onClick={this.startGame}>Try Again</button>
						}
						{!completed && 
							<button className='reset-btn' onClick={this.startGame}>Reset</button>
						}
					</div>
				</div>
			</div>
		</>
		);
	}
}

ReactDOM.render(<Main />, document.getElementById('root'));