import React from "react";
import "./score.css";

interface scoreCustomProps {
    playerScore: number;
    opponentScore: string
}

class Score extends React.Component<scoreCustomProps> {

    // constructor
    constructor(props: any) {
        super(props);
    }

    // render
    render() {
        return (
            <div className="scoring-div">
                <div className="total-div">
                    <p className="scoring-key">Total :</p>
                    <p className="scoring-val">{this.props.playerScore}</p>
                </div>
                <div className="total-div">
                    <p className="scoring-key">Opponent :</p>
                    <p className="scoring-val">{this.props.opponentScore}</p>
                </div>
            </div>
        );
    }
}

export default Score;