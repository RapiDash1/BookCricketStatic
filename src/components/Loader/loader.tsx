import React from "react";
import "./loader.css";

class Loader extends React.Component {
    constructor(props: any) {
        super(props);   
    }

    componentDidMount() {
        const loaderInstructions = document.querySelector(".loader-instruction") as HTMLElement;
        loaderInstructions.classList.toggle("hide-loader");
    }

    render() {
        return(
            <div className="loader-main-div">
                <div className="loader-instruction">
                    <div className="l-i-info">Waiting for opponent to join</div>
                    <div className="l-i-info">Share code to a friend to start playing</div>
                    <div className="l-i-info-alt">Alternatively, you can open the game in another tab and enter the code there</div>
                </div>
                <div className="loader"></div>
            </div>
        );
    }
}

export default Loader;