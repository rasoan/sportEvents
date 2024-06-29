'use strict';

import TimeCounter from "../TimeCounter/TimeCounter";
import {TimeCounterFormat} from "../TimeCounter/types/TimeCounter";
import React, {useEffect, useRef, useState} from "react";
import {getCountDaysHoursMinutesSecondsBeforeEvent} from "../utils/utils";

import "./TimersList.scss";

interface Props {
    dateStart: string;
}

const TimersList: React.FC<Props> = (props: Props) => {
    const [, setIsRerenderListFlag] = useState<
        boolean
    >(false);
    const rerenderComponent = () => setIsRerenderListFlag(rerenderListFlag => !rerenderListFlag);
    const intervalRef = useRef<ReturnType<typeof setInterval>>();
    const {
        dateStart,
    } = props;

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            rerenderComponent();
        }, 1000);
        return () => clearInterval(intervalRef.current);
    }, []);

    const {
        countDays,
        allCountDays,
        countHours,
        countMinutes,
        countSeconds,
    } = getCountDaysHoursMinutesSecondsBeforeEvent(dateStart);

    if (
        allCountDays < 0
        || countHours < 0
        || countMinutes < 0
        || countSeconds < 0
    ) {
        clearInterval(intervalRef.current)

        console.warn("Value should be more than 0!");

        return null;
    }

    return <div className={"timersList"}>
        {countDays.map((countDays, index) => (countDays > 0 ?
            <div
                key={`timer-${index}`}
                className={"timersList timersList__item timersListItem"}
            >
                <TimeCounter
                    timeCounterFormat={TimeCounterFormat.Days}
                    value={countDays}
                />
            </div>
            : null)
        )}
        {countHours > 0 ?
            <div className={"timersList timersList__item timersListItem"}>
                <TimeCounter
                    timeCounterFormat={TimeCounterFormat.Hours}
                    value={countHours}
                />
            </div>
            : null}
        {countMinutes > 0 ?
            <div className={"timersList timersList__item timersListItem"}>
                <TimeCounter
                    timeCounterFormat={TimeCounterFormat.Minutes}
                    value={countMinutes}
                />
            </div>
            : null}
        <div className={"timersList timersList__item timersListItem"}>
            <TimeCounter
                timeCounterFormat={TimeCounterFormat.Seconds}
                value={countSeconds}
            />
        </div>
    </div>;
}

export default TimersList;
