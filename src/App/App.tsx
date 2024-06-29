'use strict';

import React, {useEffect, useState} from "react";

import './App.scss';
import {Current_and_upcoming} from "../api/api";
import DefaultWidget from "../DefaultWidget/DefaultWidget";
import SportEvent from "../SportEvent/SportEvent";
import SportEventHeader, {SportEventHeaderMode} from "../SportEventHeader/SportEventHeader";
import {DefaultWidget_mode} from "./types/App";

interface Props {}


const App: React.FC<Props> = (props: Props) => {
    const [ videostandEvents, setVideostandEvents ] = useState<
        Current_and_upcoming[]
    >([]);

    useEffect(() => {
        // api.getSportEvents().then(response => {
        //     setVideostandEvents(response.videostandEvents.current_and_upcoming)
        // });
        setVideostandEvents([
            {
                dt_create: "2024-01-31T02:39:01+03:00",
                dt_start: "2024-06-28T13:00:00+03:00",
                dt_end: "2024-07-01T11:13:00+03:00",
                is_main: false,
                title: "Чемпионат Италии",
            },
            // {
            //     dt_create: "2024-01-31T02:39:01+03:00",
            //     dt_end: "2024-06-20T23:59:00+03:00",
            //     dt_start: "2024-06-16T10:00:00+03:00",
            //     is_main: false,
            //     title: "Чемпионат Китая",
            // },
            // {
            //     dt_create: "2024-01-31T02:39:01+03:00",
            //     dt_end: "2024-06-20T23:59:00+03:00",
            //     dt_start: "2024-06-16T10:00:00+03:00",
            //     is_main: false,
            //     title: "Чемпионат Москвы",
            // },
            // {
            //     dt_create: "2024-01-31T02:39:01+03:00",
            //     dt_end: "2024-06-20T23:59:00+03:00",
            //     dt_start: "2024-06-16T10:00:00+03:00",
            //     is_main: false,
            //     title: "Чемпионат Литвы",
            // },
        ]);
    }, []);

    const [ currentEvent ] = videostandEvents;

    const mode: DefaultWidget_mode = false ? DefaultWidget_mode.Solo : DefaultWidget_mode.WithOtherEvents;

    return <div className={"app appWrapper"}>
        <div className={"app__row appRow"}>
            <DefaultWidget mode={mode} />
        </div>
        {mode === DefaultWidget_mode.WithOtherEvents ? <>
            <div className={"app__row appRow appRow-sportEvent"}>
                {currentEvent ? <SportEvent sportEvent={currentEvent}/> : null}
            </div>
            <div className={"app__row appRow"}>
                {currentEvent ? <SportEventHeader
                    title={currentEvent.title}
                    dateStart={currentEvent.dt_start}
                    dateEnd={currentEvent.dt_end}
                    sportEventHeaderMode={SportEventHeaderMode.WithoutSportEventContainer}
                /> : null}
            </div>
        </> : null}
    </div>;
};

export default App;
