import React from "react";
import "./sheet.scss";

interface CustomInputProps {
    pos: number;
    pageNumber: number;
    key: string
  }


class Sheet extends React.Component <CustomInputProps> {

    _sheetPos: number = 0;
    _sheetCoverStr : string;
    // Used to indicate if the timer in book should be stopped
    _timerStopBool: boolean = false;
    // Used to handle loop from the book
    // If the loop in book has already gone through this sheet in the previous iteration
    // ewhere rot was greater than 75deg then don't allow that
    _stopTimerLoop: boolean = false;

    // constructor 
    constructor(props : any) {
        super(props);
        this._sheetPos = props.pos;
        this._sheetCoverStr = "sheet-cover" + this._sheetPos;
        // Bind functions
        this.handleEndDrag = this.handleEndDrag.bind(this);
        this.handleStartDrag = this.handleStartDrag.bind(this);
    }


    // add component did mount and change the background color based on the position
    // Also add a box shadow

    componentDidMount() {
        const sheetCover = document.querySelector("."+this._sheetCoverStr)  as HTMLElement;
        if (this._sheetPos == 0 || this._sheetPos == 9) {sheetCover.style.backgroundColor = "#50C878";}
        else {sheetCover.style.backgroundColor = "white";}
        sheetCover.style.boxShadow = "2px 3px 4px 0.05px";
    }


    // Convert rotation to number
    // A string like rotateY(50deg) to 50
    // xOry indicates if the string is either in the form of rotateX() or rotateY()
    convertRoataionToNumber(rotVal: string, xOry: boolean = true) {
        const startPos = (xOry) ? 8 : 7;
        return Number(rotVal.slice(startPos, -4));
    }


    // handle start drag
    // Set start time
    handleStartDrag() {
    }


    // covert transklation to rotation
    translationToRotation(relativeDist: number) {
        // the angle the sheets should turn is based on the sheetPos
        // This is done so that the sheets move at a different rate,
        // which looks better
        // maxDivisor is lower for mobile screens since
        // there will be lesser distance to travel to skip the book
        // Full rotatioin should happen for a smaller relative distance
        const maxDivisor = (window.innerWidth <= 1200) ? 5 : 6;
        return relativeDist/(maxDivisor - this._sheetPos*0.15);
    }


    // handle drag
    // Translate the sheet based on relative mouse position
    // Returns true if time considered for page number
    // calculation should be stopped 
    handleDrag(e: any, socket: any, customPlayerCodeStr: () => string) {
        // x position of the bottom right corner of the sheet
        const dragButtonPosMultiplier = (window.innerWidth < 1200) ? 0.7 : 0.55;
        console.log(dragButtonPosMultiplier);
        const originX = window.innerWidth*dragButtonPosMultiplier;
        const sheetCover = document.querySelector("."+this._sheetCoverStr) as HTMLElement;
        const currentYRot = this.convertRoataionToNumber(sheetCover.style.transform, true);
        // get the actual width of the window
        // e.screenX returns the positon of the mouse wrt the whole screen
        const eScreen  = (e.screenX) ? e.screenX : (e.touches) ? e.touches[0].clientX : 0;
        const actualWindowWidth = eScreen - window.screenLeft;
        //  Below formula emulates a good fit for drag movement to sheet angle
        const newYRot = this.translationToRotation(actualWindowWidth - originX);
        // new angle is being restricted to -155deg, this offers good tradeoff between,
        // dragging distance and duration
        if (currentYRot >= newYRot) {
            // Comsidering one of the sheet which opens last
            // Use this to display the page number
            if (this.shouldPageNumberDisplay() && newYRot <= -70 && !this._stopTimerLoop) {
                // stop the timer after a certain angle
                // Dont set the timer bool always, only if it is false, i.e..., only onceas
                if (!this._timerStopBool) {
                    // stop timer
                    this._timerStopBool = true;
                    // stop loop
                    this._stopTimerLoop = true;
                }
            }
            if (newYRot >= -145 + this.sheetAngleOffset()) {
                sheetCover.style["transform"] = "rotateY(" + newYRot.toString() + "deg" +")";
                // send this info to server so that
                // opponent can have the same animation while watching
                socket.emit("bookOpenAngle", {bookAngle: newYRot, customCode: customPlayerCodeStr(), sheetPos: this._sheetCoverStr});
            }
        }
        return false;
        
    }


    // should page number be displayed
    // Only the last page which turns over should display the page number
    shouldPageNumberDisplay() {
        return this._sheetPos == 5;
    }


    shouldNextPageNumberDisplay() {
        return this._sheetPos == 4;
    }


    // reset timer stop bool
    // its necessary to reset this, or else
    // the time difference will be considered each time handleDrag is called
    resetTimerStopBool() {
        this._timerStopBool = false;
    }


    // should timer be stopped
    // HandleDrag in book uses this to stop the timer
    shouldTimerBeStopped() {
        return this._timerStopBool; 
    }


    // reset stop timer loop
    // this needs to be done inorder to get the new timeDiff value in book
    resetStopTimerLoop() {
        this._stopTimerLoop = false
    }


    // sheet offset angle
    // Give an offset to every sheet
    // THe sheets should be clustered around the beginning and the end for better visibility of score
    sheetAngleOffset() {
        return (this._sheetPos >= 5) ? (9 - this._sheetPos)*5 : (145 - this._sheetPos*10) 
    }


    // Handle End drag
    // Set end time and reset sheet
    handleEndDrag() {
        this.resetStopTimerLoop();
        this.resetsheet();
    }


    // resetsheet
    // Reset the sheet back to its original state with a 2s animation
    resetsheet() {
        const sheetCover = document.querySelector("."+this._sheetCoverStr) as HTMLElement;
        // Hold the page open for 1.5s to view the score
        setTimeout(() => {
            sheetCover.classList.toggle("sheet-cover-close"); // Starts the closing sheet animation
            // Wait for the sheet to close, then reset them toggle back the animation class
            setTimeout(() => {
                sheetCover.style["transform"] = "rotateY(0deg)";
                sheetCover.classList.toggle("sheet-cover-close"); 
            }, 1900);
        }, 1500);
    }

    // render
    render() {
        // Display pageNumber if page is 4
        // Display next page number if page is 4
        // Dont display anything else
        const sheetNumber = (this.shouldPageNumberDisplay()) ? <p className="page-number">{this.props.pageNumber}</p> : (this.shouldNextPageNumberDisplay()) ? <p className="next-page-number">{this.props.pageNumber+1}</p> : null;
        
        return (
        <div className={this._sheetCoverStr}>{sheetNumber}</div> 
        );
    }
}

export default Sheet;



