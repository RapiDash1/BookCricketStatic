import React, { Component } from 'react';
import "./instructions.css"

class Instructions extends React.Component {

    render() {
        return (
            <div className="instructions-div">
                <div className="instructions-to-play">
                    <div className="instruction-name">Instructions</div>
                    <ul>
                        <li>Press and hold the bottom right corner of the book.</li>
                        <li>Pull horizontally towards left of the book.</li>
                        <li>Open the book untill a page number is visible on the left page.</li>
                        <li>Leave the book to close by itself, once you have viewed your score.</li>
                    </ul>
                </div>
                <div className="scoring-instructions">
                    <div className="instruction-name">How it the game scored?</div>
                    <ul>
                        <li>Your score on each book open is the last digit on the left page.</li>
                        <li>If you open a page containing a 0 as the last digit, then you are out.</li>
                        <li>The turn passes to your opponent.</li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default Instructions;