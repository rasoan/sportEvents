'use strict';

import React from "react";

import './App.scss';

interface Props {}

const App: React.FC<Props> = (props: Props) => {
    const onClick = () => {
        console.log("Hi!")
    };

    return <>
        <div>Hello world</div>
        <button onClick={onClick} className="customButton">)))))</button>
    </>;
};

export default App;
