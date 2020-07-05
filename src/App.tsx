import React, { Component } from 'react';
import './App.css';
import Book from "./components/Book/book";
import Navbar from "./components/Navbar/navbar";
import Score from "./components/score/score";
import Out from "./components/out/out";
import Sheet from "./components/Sheet/sheet";
import EnterCode from "./components/EnterCode/enterCode";
import socketIo from "socket.io-client";
import Loader from "./components/Loader/loader";
import Chat from "./components/Chat/chat";
import Instrucions from "./components/Instructions/instructions";

class App extends React.Component<{}, {opponentScore: string}> {

  _totalScore: number = 0;
  _isOut: boolean = false;
  // http://localhost:3000/
  // https://blooming-meadow-53073.herokuapp.com/
  socket = socketIo("http://localhost:3000/");
  _customPlayerCode: string = "";
  _displayPlayererSessionInfo: boolean = false;

  constructor(props: any) {
    super(props);

    this.state = {
      opponentScore: "0",
    }
    
    // binding functions
    this.bookCallBack = this.bookCallBack.bind(this);
    this.resetTotalScore = this.resetTotalScore.bind(this);
    this.sendPlayerScore = this.sendPlayerScore.bind(this);
    this.codeCallBack = this.codeCallBack.bind(this);
    this.getCustomPlayerCode = this.getCustomPlayerCode.bind(this);
    this.sendPlayerPageNumber = this.sendPlayerPageNumber.bind(this);
  }

  // toggle out window
  toggleOutWindow() {
    const outComponent = new Out({});
    outComponent.toggleOutWindow();
  }


  // Handkle book call back
  // Sccore is updated here everytime drag is ended
  bookCallBack(currentSheetPageNumber: number) {
    // send the current page number to opponent
    this.sendPlayerPageNumber(currentSheetPageNumber);
    // If page number is a multiple of 10, then the palyer is out
    if (currentSheetPageNumber % 10 == 0) {
      setTimeout(() => {
        this._isOut = true;
        this.sendOutMessage();
        this.toggleOutWindow();
        this.forceUpdate();
        // dont reset score before toggling window
        // it'll update the reset value to score
      }, 1800);
    } else {
      this._totalScore += Number(currentSheetPageNumber.toString().slice(-1));
      // Total time for book opoen position hold and close aniation is 1.9s + 1.5s = 3.4s
      // Timeout for 2.5s so that we give enough time for the book
      // to close partially, so that page number wont be visible when
      // we reset it
      setTimeout(()=>{
        this.forceUpdate();
      }, 2500);
    }
    // send player score to opponent after each turn 
    // should always send this after updating total score
    this.sendPlayerScore(this._totalScore);
  }

  // get custom pleayer code
  // used to return updated customPlayerCode in sheet
  getCustomPlayerCode() {
    return this._customPlayerCode;
  }


  // reset total score
  resetTotalScore() {
    this._totalScore = 0;
    // reset the value of player score element
    // const scoringELement = document.querySelector(".scoring-val") as HTMLElement;
    // scoringELement.innerText = "0";
  }


  // send player score
  sendPlayerScore(currScore: number) {
    this.socket.emit("playerScore", {score: currScore.toString(), customCode: this._customPlayerCode});
  }


  // send player page number
  sendPlayerPageNumber(currentPage:  number) {
    this.socket.emit("currentPage", {page: currentPage.toString(), playerCode: this._customPlayerCode});
  }


  // send out message to opponent
  sendOutMessage() {
    this.socket.emit("outMessage", {playerCode: this._customPlayerCode});
  }

  // toggle loader
  toggleLoader() {
    const loaderMainDiv = document.querySelector(".loader-main-div") as HTMLElement;
    loaderMainDiv.classList.toggle("hide-loader"); 
  }


  // code call back
  // handles sending game initial code to server
  codeCallBack(code: string) {
    this.socket.emit("customCommonCode", code);
  }

  // final score to be displayed
  // decide between total score or opponent score
  // IF this player is not out, hta tmeans the opponent just got out
  // HEnce show opponent score
  finalScore() {
    return (this._isOut) ? this._totalScore : Number(this.state.opponentScore);
  }
  

  // Text to be displayed on out dialog box
  playerText() {
    return (this._isOut) ? "You are out" : "Opponent is out";
  }


  // session heading
  sessionHeading() {
    // don't display anythin before player join a game
    // player turn is decide then, hence wait for it
    if (!this._displayPlayererSessionInfo) return "";
    return (this._isOut) ? "Opponent's turn to play" : "Your turn to play";
  }


  // component did mount
  componentDidMount() {

    // getting a sharable code from the server
    this.socket.on("sharableCode", (playerCodeInfo: {gameCode: number}) => {
      console.log("Sharable code in");
      this._customPlayerCode = playerCodeInfo.gameCode.toString();
      this.forceUpdate();
    });

    // hide loader on player connect
    this.socket.on("hideLoader", () => {
      console.log("Loader toggled");
      this.toggleLoader();
    });

      // what to do on recieving opponent's score
      this.socket.on("opponentScore", (oppScore: string) => {
        // console.log(oppScore);
        this.setState({
          opponentScore: oppScore
        });
      });

      // set player codes
      this.socket.on("playerCode", (playerInitInfoMap: {playerCode: string, initSession: boolean}) => {
        console.log("Ibnside layer code");
        // setting player code that is given back by the server
        // this playerCode is used to tie players and opponents together
        this._customPlayerCode = playerInitInfoMap.playerCode;
        // player session is whether player should play or not
        this._isOut = playerInitInfoMap.initSession;
        // Display session info once player is connected to a game
        this._displayPlayererSessionInfo = true;
        this.forceUpdate();
      });

      // open book wile opponent is animating
      this.socket.on("openBookWithOpponentAngle", (sheetInfo: any) => {
        // console.log("oppening book");
        // rotate the sheet of .sheetInfo.sheetCoverPos class bt sheetInfo.sheetAngle angle 
        const sheetCover = document.querySelector("."+sheetInfo.sheetCoverPos) as HTMLElement;
        sheetCover.style["transform"] = "rotateY(" + sheetInfo.sheetAngle + "deg" +")";
      })

      // player book closing animation
      // triggered by opponent
      this.socket.on("opponentBookStopOpeningAnimation", () => {
        // handle sheet closing animation per sheet
        for (let sheetPos: number = 0; sheetPos < 10; sheetPos++) {
          const sheet = new Sheet({pos:sheetPos});
          sheet.handleEndDrag();
        }
      });

      // Display opponent's page number while playing
      this.socket.on("currentPage", (opponentPageNumber: string) => {
        // sheets are arranged in a book as a stack, hence page 5 appears first
        const rightSheet = document.querySelector(".sheet-cover5") as HTMLElement;
        const rightSheetPara =  rightSheet.querySelector(".page-number") as HTMLElement;
        rightSheetPara.innerText = opponentPageNumber;

        // page 4 is on the right side
        const leftSheet = document.querySelector(".sheet-cover4") as HTMLElement;
        const leftSheetPara =  leftSheet.querySelector(".next-page-number") as HTMLElement;
        leftSheetPara.innerText = (Number(opponentPageNumber)+1).toString(); 
      });


      // Handle sending player message to opponenet
      this.socket.on("opponentMessage", (messageInfo: {message: string}) => {

        // display message only if it is not empty
        if (messageInfo.message != "") {
          // div where all the messages should be displayed
          const msgDisplayArea = document.querySelector(".chat-box-display") as HTMLElement;

          const msgDisplayDivHidden = document.querySelector(".hide-chat-box") as HTMLElement;
          if (msgDisplayDivHidden) {
            const chatIconDiv = document.querySelector(".chat-icon-div") as HTMLElement;
            chatIconDiv.classList.toggle("chat-icon-anim");
          }

            // create message elemement
            const paragraphElement = document.createElement("p");
            paragraphElement.appendChild(document.createTextNode(messageInfo.message));
            paragraphElement.setAttribute("class", "opponent-message");
            msgDisplayArea.appendChild(paragraphElement);
        }
      });

      // Switch player when opponent is out
      // Display opponent is out message toi current player
      this.socket.on("outMessage", () => {
        console.log("Outmessage");
          // if opponent is out,
          // current player can start playing
          this._isOut = false;
          this.toggleOutWindow();
          this.forceUpdate();
      });


  }




  // TODO: devide the horizontal space between book and score
  // Add a a lighter grey to the background and add box shadow
  // It will be a better UX, oncve the player knows the bounds of the book




  // render
  render() {
    return(
      <div className="App">
        <Loader />
        <Out finalScore={this.finalScore()} playerText={this.playerText()}/>
        <EnterCode parentCallBack={this.codeCallBack} sharableCode={this._customPlayerCode}/>
        <Navbar parentCallback={() => {}} sessionHeading={this.sessionHeading()}/>
        <div className="body-container">
          <div className="first-row">
            {/* If player is not out then it is player's turn */}
            <Book appCallBack={this.bookCallBack} socket={this.socket} customPlayerCode={this.getCustomPlayerCode} playerTurn={!this._isOut} /> 
            <Score playerScore={this._totalScore} opponentScore={this.state.opponentScore}/>
          </div>
          <Instrucions />
          <Chat socket={this.socket} customPlayerCode={this.getCustomPlayerCode}/>
        </div>
      </div>
    );
  }
}

export default App;
