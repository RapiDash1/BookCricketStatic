import React from "react";
import "./loader.css";

class Loader extends React.Component {
    constructor(props: any) {
        super(props);   
    }

    render() {
        return(
            <div className="loader-main-div">
              <div className="loader"></div>
            </div>
        );
    }
}

export default Loader;