import React from "react";
import "./chat.scss";
import chatIcon from "../../Images/chatIcon.png";

interface chatInterface {
    socket: any;
    customPlayerCode: () => string
}

class Chat extends React.Component<chatInterface> {
    constructor(props: any) {
        super(props);   

        // bind
        this.handleSendMessageClick = this.handleSendMessageClick.bind(this);
    }

    // handle chat icon click
    // toggle chat window
    handleChatIconClick() {
        // End chat icon animation if it is animating
        const chatIconAnim = document.querySelector(".chat-icon-anim") as HTMLElement;
          if (chatIconAnim) {
            chatIconAnim.classList.toggle("chat-icon-anim");
          }

        // toggle chat display  
        const chatBox = document.querySelector(".chat-box-div") as HTMLElement;
        chatBox.classList.toggle("hide-chat-box");
    }

    // handle send message click
    // handle displaying the message typed in the chat,
    // also handle sending it to the oppponent
    handleSendMessageClick() {
        // text input element
        const enteredTextElement = document.querySelector(".chat-box-text-input") as HTMLInputElement;
        const enterTextValue = enteredTextElement.value;

        // display message only if it is not empty
        if (enterTextValue != "") {
            // div where all the messages should be displayed
            const msgDisplayArea = document.querySelector(".chat-box-display") as HTMLElement;
            // create message elemement
            const paragraphElement = document.createElement("p");
            paragraphElement.appendChild(document.createTextNode(enterTextValue));
            paragraphElement.setAttribute("class", "player-message");
            msgDisplayArea.appendChild(paragraphElement);
            this.props.socket.emit("playerMessage", {message: enterTextValue, customPlayerCode: this.props.customPlayerCode()})
            // reset the value in the text input element
            enteredTextElement.value = "";
        }
    }

    // render
    render() {
        return(
            <div className="chat-main-div">
                <div className="chat-box-div hide-chat-box">
                    <div className="chat-box-display">
                    </div>
                    <div className="chat-box-type">
                        <input type="text" className="chat-box-text-input"/>
                        <button className="send-msg-button" onClick={this.handleSendMessageClick}>Send</button>
                    </div>
                </div>
                <div className="chat-icon-div">
                    <img src={chatIcon} className="chat-icon" onClick={this.handleChatIconClick}/>
                </div>
            </div>
        );
    }
}

export default Chat;