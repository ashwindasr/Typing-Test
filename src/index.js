import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from "reactstrap/es/Container";
import Row from "reactstrap/es/Row";

function TypeText(props) {
    let text = props.text.split("");
    let i = 0;
    let mapper = text.map((item) =>
            <div id={"typeText" + i++}>{item}</div>
    );
    return (
        mapper
    );
}



class Main extends React.Component{

        constructor(props) {
            super(props);
            this.state = {
                myText: "apple is red",
                myIndex: 0,
                startTime: null,
                words: 3,
                totalTime: null,        // in minutes
            };
            this.checkKey = this.checkKey.bind(this)
        }



    checkKey(event){




        if (this.state.myText[this.state.myIndex] === event.key){
            // console.log("new");
            document.getElementById("typeText" + this.state.myIndex).style.color = "#03fc0b";
            this.setState({
                myIndex: this.state.myIndex + 1,
            });
        } else if (event.key === "Backspace"){
            // console.log("back");

            this.setState({
                myIndex: this.state.myIndex - 1,
            });
            let temp = this.state.myIndex -1 ;
            document.getElementById("typeText" + temp).style.color = "#000000";
        }
        else if (event.key !== "Enter") {
            // console.log("enter");

            document.getElementById("typeText" + this.state.myIndex).style.color = "#fc0303";
            this.setState({
                myIndex: this.state.myIndex + 1,
            });
        }

        console.log(this.state.myIndex);

        if (event.key === "a"){
            let d = new Date();
            let n = d.getTime();

            // Get start time
            // this.state.startTime = n;
            this.setState({
                startTime: n,
            });
        }

        if (event.key === "Enter"){
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
        }
    }
    render() {
        return (
            <Container>
                <Row><TypeText text={this.state.myText} /></Row>
                <Row><textarea id="textInput" onKeyDown={this.checkKey}/></Row>
            </Container>
        );
    }


}


ReactDOM.render(<Main/>, document.getElementById("root"));
