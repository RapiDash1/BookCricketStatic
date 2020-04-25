import React from "react";
import "./navbar.css";


class Navbar extends React.Component<{ parentCallback: (message: string) => void, sessionHeading: string}, {}> {
    constructor(props: any) {
        super(props);
    }

    // drop down menu toggle
    handleSocialMediaClick() {
        let socialMediaLinks = document.querySelector(".Social-Media-selection");
        socialMediaLinks?.classList.toggle("Social-Media-selection-active");
    }

    render() {
        return (
            <nav>
                <div className="navbar-main">
                    <p className="session-heading">{this.props.sessionHeading}</p>
                    <div className="Social-Media-selection">
                        <ul className="Social-Media-dropdown">
                            <li className="Social-Media-dd-item"><a href="https://www.instagram.com/sri._vatsa/" target="_blank" id="social-media-element" onClick={this.handleSocialMediaClick}>Instagram</a></li>
                            <li className="Social-Media-dd-item"><a href="https://twitter.com/SrivatsaM11" target="_blank" style={{textDecoration: "none"}} id="social-media-element" onClick={this.handleSocialMediaClick}>Twitter</a></li>
                        </ul>
                    </div>
                    <ul className="nav-links">
                        <li className="Social-Media" onClick={this.handleSocialMediaClick}>Social Media</li>
                    </ul>
                </div>
            </nav>
        );
    }
}

export default Navbar;