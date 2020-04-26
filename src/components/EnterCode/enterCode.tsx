import React from "react";
import "../out/out.scss";
import "./enterCode.scss";
import clipboard from "../../Images/clipboard.svg";

interface customenterCodeInterface {
    parentCallBack: (message: string) => void;
    sharableCode: string
}

class EnterCode extends React.Component<customenterCodeInterface> {

    // constructor
    constructor(props: any) {
        super(props);
        this.getCode = this.getCode.bind(this);
    }

    
    // get code
    getCode() {
        console.log("Hi");
        const customCodeText = document.querySelector(".code-text-input") as HTMLInputElement;
        this.hideComponent();
        // delegate socke.io code handling to parent
        this.props.parentCallBack(customCodeText.value);
    }


    sendBackSameCode() {
        this.hideComponent();
        // delegate socke.io code handling to parent
        this.props.parentCallBack(this.props.sharableCode);
    }


    // hide component
    // since this should be visible only before the game starts
    hideComponent() {
        const enterCodeElement = document.querySelector(".enterCode-div") as HTMLElement;
        enterCodeElement.classList.toggle("remove-enterCode-div");
    }

    // render
    render() {
        return (
            <div className="enterCode-div">
                <div className="display-enterCode">
                    <p className="enterCode-text">Enter code</p>
                    <div className="enter-code-main-div">
                        <input type="text" name="code-text" className="code-text-input"/>
                        <button className="Enter-game-button" onTouchStart={this.getCode} onClick={this.getCode}>Enter Game</button>
                    </div>
                    <p className="enterCode-text">Or</p>
                    <div className="share-code-button">
                        <p className="share-code-text">Share code :</p>
                        <div className="code-share-div">
                            <p className="code-val-text">{this.props.sharableCode}</p>
                            <button className="clipnoard-button"> <img src={clipboard} className="clipboard-image"/></button>
                        </div>
                        <button className="enter-share-code" onTouchStart={this.sendBackSameCode.bind(this)} onClick={this.sendBackSameCode.bind(this)}>Enter</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default EnterCode;