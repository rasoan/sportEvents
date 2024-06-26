'use strict';

import React, {useEffect} from "react";

import './App.scss';
import TimeCounter from "../TimeCounter/TimeCounter";
import {TimeCounterFormat} from "../TimeCounter/types/TimeCounter";
import {getCountersOfDays} from "../utils/utils";
import {api} from "../Api/Api";

interface Props {}

const App: React.FC<Props> = (props: Props) => {
    useEffect(() => {
        api.getSportEvents().then(response => {
            console.log(response.videostandEvents);
        });
    }, []);

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
