import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from "reactstrap/es/Container";
import Row from "reactstrap/es/Row";
import './index.css';

function TypeText(props) {
    let text = props.text.split("");
    let mapper = text.map((item, index) =>
        <div>
            <div className="typing" id={"typeText" + index}>{item}</div>
            &nbsp;</div>
    );
    return (
        mapper
    );
}


class Main extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            myText: "React is an open source JavaScript library for building user interfaces. It is maintained by Facebook and a community of individual developers and companies. React can be used as a base in the development of single page or mobile applications.",
            myIndex: 0,
            totalIndex: "React is an open source JavaScript library for building user interfaces. It is maintained by Facebook and a community of individual developers and companies. React can be used as a base in the development of single page or mobile applications.".length - 1,
            startTime: null,
            words: 3,
            letters: "React is an open source JavaScript library for building user interfaces. It is maintained by Facebook and a community of individual developers and companies. React can be used as a base in the development of single page or mobile applications.".replace(" ", "").length,
            incorrect: 0,
            totalTime: null,        // in minutes
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
            document.getElementById("accuracy").innerHTML = "Your accuracy: " + Math.round(((this.state.letters - this.state.incorrect) / this.state.letters) * 100)
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
                document.getElementById("typeText" + this.state.myIndex).style.color = "#03fc0b";
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
                startTime: n,
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
