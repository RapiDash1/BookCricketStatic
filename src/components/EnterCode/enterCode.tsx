import React from "react";
import "../out/out.scss";
import "./enterCode.scss";

interface customenterCodeInterface {
    parentCallBack: (message: string) => void
}

class EnterCode extends React.Component<customenterCodeInterface> {

    
    constructor(props: any) {
        super(props);
        this.getCode = this.getCode.bind(this);
    }

    
    // get code
    getCode() {
        const customCodeText = document.querySelector(".code-text-input") as HTMLInputElement;
        this.hideComponent();
        // delegate socke.io code handling to parent
        this.props.parentCallBack(customCodeText.value);
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
                    <p className="enterCode-text">Enter custom code</p>
                    <input type="text" name="code-text" className="code-text-input"/>
                    <button className="Enter-game-button" onClick={this.getCode}>Enter Game</button>
                </div>
            </div>
        );
    }
}

export default EnterCode;