import React from "react";
import "./navbar.css";
import twitterIcon from "../../Images/twitter-icon.jpg";
import instaIcon from "../../Images/instagram-icon.png";

class Navbar extends React.Component<{ parentCallback: (message: string) => void, sessionHeading: string}, {}> {
    constructor(props: any) {
        super(props);

        this.gotoTwitter = this.gotoTwitter.bind(this);
        this.gotoInstagram = this.gotoInstagram.bind(this);
    }

    gotoTwitter() {
        this.gotoSocial("https://twitter.com/SrivatsaM11");
    }

    gotoInstagram() {
        this.gotoSocial("https://www.instagram.com/sri._vatsa/");
    }

    gotoSocial(url: string) {
        window.open(url, "_blank");
    }

    render() {
        return (
            <nav>
                <div className="navbar-main">
                    <p className="session-heading">{this.props.sessionHeading}</p>
                    <div className="social-links">
                        <img src={twitterIcon} className="social-icon" onClick={this.gotoTwitter}/>
                        <img src={instaIcon} className="social-icon" onClick={this.gotoInstagram}/>
                    </div>
                        {/* <a href="https://www.instagram.com/sri._vatsa/" target="_blank" id="Social-Media-dd-item">Instagram</a>
                        <a href="https://twitter.com/SrivatsaM11" target="_blank" id="Social-Media-dd-item">Twitter</a> */}
                </div>
            </nav>
        );
    }
}

export default Navbar;