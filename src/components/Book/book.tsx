import React from "react";
import Sheet from "../Sheet/sheet";
import "./book.css";
import App from "../../App";
const ReactTouchEvents = require("react-touch-events");

interface customBookProps {
    appCallBack: (currentSheetScore: number) => void;
    socket: any;
    customPlayerCode: () => string;
    playerTurn: boolean
}


class Book extends React.Component<customBookProps> {

    // get the start time for calculating score
    _startTime: Date = new Date();
    // get the end time for calculating score
    _endTime: Date = new Date();
    // Hold all the sheet instances to manipulate sheet elements
    _sheetArray: Sheet[] = [];
    // Time diff translates into score
    _timeDiff: number = 0;
    // Score after each book turn
    _pageNumber: number = 0;


    // constructor
    constructor(props: any) {
        super(props);
        // Bind functions
        this.handleEndDrag = this.handleEndDrag.bind(this);
        this.handleStartDrag = this.handleStartDrag.bind(this);
    }  


    // handle start drag
    handleStartDrag() {
        // adding shouldBeDragabble here insted of dragabble atribute to handle touch evvents aswell
        if (this.shouldBeDragabble()) {
            // start time checkpoint
            this._startTime = new Date();
        }
    }


    // handle drag
    handleDrag(e: any) {
        // adding shouldBeDragabble here insted of dragabble atribute to handle touch evvents aswell
        if (this.shouldBeDragabble()) {
            // delegate start drag to each component
            this._sheetArray.forEach(sheet => {
                sheet.handleDrag(e, this.props.socket, this.props.customPlayerCode);
                // timer stop
                if (this.shouldTimerBeStopped(sheet)) {
                    // end time checkpoint
                    this._endTime = new Date();
                    const timeDIff: number = this._endTime.getTime() - this._startTime.getTime();
                    this._timeDiff = timeDIff;
                    // If the number is odd.convert it to even
                    // This is done to increase the probability of 0 occuring
                    if (this._timeDiff % 2 != 0) {
                        const rand = Math.random()*3;
                        const roundedRand = Math.floor(rand);
                        if (roundedRand == 0) {
                            this._timeDiff += 1;
                        }
                    }
                    // take only the last digit of time diff
                    // that's how book cricket scores are calculated
                    this._pageNumber = Number(this._timeDiff.toString());
                    // force rerender of the component to upodate the page values on each sheet
                    this.forceUpdate();
                    // reset timer stop bool so that the above calculatio is done only once
                    sheet.resetTimerStopBool();
                }
            });
        }
    }


    // should timer be stopped
    shouldTimerBeStopped(currentSheet: Sheet) {
        // We have to delegate part of the responisibility to the sheet
        // We need to calculate the time diff only once,
        // Hence check if _timeDIff has its original value, only then
        // Calculate the time diff
        return (currentSheet.shouldTimerBeStopped() && this._timeDiff == 0);
    }


    // reset time diff bool
    // resetting is important to update time on opening the book again
    resetTimeDiffBool() {
        this._timeDiff = 0;
    }


    // handle end drag
    handleEndDrag() {
        // adding shouldBeDragabble here insted of dragabble atribute to handle touch evvents aswell
        if (this.shouldBeDragabble()) {
            // first convey stop animmaton to opponent
            // then stop current player's animation
            this.props.socket.emit("opponentBookStopOpeningAnimation", {playerCode: this.props.customPlayerCode()});
            // delegate end drag to each component
            this._sheetArray.forEach(sheet => {
                sheet.handleEndDrag();
            });
            this.resetTimeDiffBool();
            // Set totalScore in app using callback
            if (this.props.appCallBack) this.props.appCallBack(this._pageNumber);
        }
    }

    // should be dragabble
    shouldBeDragabble(): boolean {
        return (this.props.playerTurn) ? true : false;
    }


    // component did mount
    componentDidMount() {
        // Add sheet instances to manipulate later
        for (let sheetPos: number = 0; sheetPos < 10; sheetPos++) {
            this._sheetArray.push(new Sheet({pos:sheetPos}));
        }
    }


    // render
    render() {
        // Append all the sheets necessary
        let _sheetCollection: any[] = []
        for (let sheetPos: number = 0; sheetPos < 10; sheetPos++) {
           _sheetCollection.push(<Sheet pos={sheetPos}  key={"sheet"+sheetPos.toString()} pageNumber={this._timeDiff}/>);
        }
        return (
            <div className="complete-book">
                {/* Invisible button */}
                {/* When dragged translates distance into sheet opening angle*/}
                <button className="drag-button" onDragStart={this.handleStartDrag} onTouchStart={this.handleStartDrag} onTouchMove={this.handleDrag.bind(this)} onTouchEnd={this.handleEndDrag} onDrag={this.handleDrag.bind(this)} onDragEnd={this.handleEndDrag}>DragMe</button>
                <div className="book">
                    {_sheetCollection}
                </div>
            </div>
        );
    }
}

export default Book;