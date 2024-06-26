'use strict';

import React from "react";

import './App.scss';
import TimeCounter from "../TimeCounter/TimeCounter";
import {TimeCounterFormat} from "../TimeCounter/types/TimeCounter";
import {getCountersOfDays} from "../utils/utils";

interface Props {}

const App: React.FC<Props> = (props: Props) => {
    const onClick = () => {
        console.log("Hi!")
    };

    return <>
        {new Array(60).fill(1).map((el, index) => (
            <TimeCounter
                timeCounterFormat={TimeCounterFormat.Seconds}
                value={index + 1}
            />)
        )}
    </>;
};

export default App;
