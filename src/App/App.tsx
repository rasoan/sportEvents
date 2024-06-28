'use strict';

import React, {useEffect} from "react";

import './App.scss';
import {api} from "../api/api";
import DefaultWidget, {DefaultWidget_mode} from "../DefaultWidget/DefaultWidget";

interface Props {}

const App: React.FC<Props> = (props: Props) => {
    useEffect(() => {
        api.getSportEvents().then(response => {
            console.log(response.videostandEvents);
        });
    }, []);

    return <div className={"wrapper"}>
        <DefaultWidget mode={DefaultWidget_mode.WithOtherEvents} />
    </div>;
};

export default App;

/*
        {new Array(60).fill(1).map((el, index) => (
            <TimeCounter
                timeCounterFormat={TimeCounterFormat.Seconds}
                value={index + 1}
            />)
        )}
 */
