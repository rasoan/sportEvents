'use strict';

import React from "react";

import './App.scss';
import TimeCounter from "../TimeCounter/TimeCounter";

interface Props {}

const App: React.FC<Props> = (props: Props) => {
    const onClick = () => {
        console.log("Hi!")
    };

    return <>
        <div>Hello world</div>
        <button onClick={onClick} className="customButton">)))))</button>
        <TimeCounter />
    </>;
};

export default App;
