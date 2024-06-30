'use strict';

import TimeCounter from "../TimeCounter/TimeCounter";
import {TimeCounterFormat} from "../TimeCounter/types/TimeCounter";
import React, {useEffect, useRef, useState} from "react";
import {
    COUNT_HOURS_IN_DAY,
    COUNT_MILLISECONDS_IN_HOUR,
    COUNT_MILLISECONDS_IN_MINUTE,
    COUNT_MILLISECONDS_IN_SECOND,
    COUNT_MINUTES_IN_HOUR,
    COUNT_SECONDS_IN_MINUTE,
    getAllCountTimes,
    getCountDaysHoursMinutesSecondsBeforeEvent
} from "../utils/utils";

import "./TimersList.scss";

interface Props {
    dateStart: string;
}

const TimersList: React.FC<Props> = (props: Props) => {
    const {
        dateStart,
    } = props;

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
        return null;
    }

    const remaining = getRemaining({
        countHours,
        countMinutes,
        countSeconds,
    });

    const {
        allMinutes,
        allHours,
    } = getAllCountTimes(dateStart);

    return <div className={"timersList"}>
        {countDays.map((countDays, index) => (<div
                key={`timer-${index}`}
                className={"timersList timersList__item timersListItem"}
            >
                <TimeCounter
                    timeCounterFormat={TimeCounterFormat.Days}
                    value={countDays}
                    millisecondsRemaining={remaining.remainingForDay}
                />
            </div>)
        )}
            <div className={"timersList timersList__item timersListItem"}>
                <TimeCounter
                    timeCounterFormat={TimeCounterFormat.Hours}
                    value={countHours}
                    millisecondsRemaining={remaining.remainingForHour}
                    countReset={allCountDays}
                />
            </div>
            <div className={"timersList timersList__item timersListItem"}>
                <TimeCounter
                    timeCounterFormat={TimeCounterFormat.Minutes}
                    value={countMinutes}
                    millisecondsRemaining={remaining.remainingForMinute}
                    countReset={allHours}
                />
            </div>
        <div className={"timersList timersList__item timersListItem"}>
            <TimeCounter
                timeCounterFormat={TimeCounterFormat.Seconds}
                value={countSeconds}
                countReset={allMinutes}
            />
        </div>
    </div>;
}

export default TimersList;

function getRemaining(options: {
    countHours: number,
    countMinutes: number,
    countSeconds: number,
}): {
    remainingForDay: number,
    remainingForHour: number,
    remainingForMinute: number,
} {
    const {
        countSeconds,
        countHours,
        countMinutes,
    } = options;

    const remainingForMinute = countSeconds * COUNT_MILLISECONDS_IN_SECOND;
    const remainingForHour = remainingForMinute + countMinutes * COUNT_MILLISECONDS_IN_MINUTE;
    const remainingForDay = remainingForHour + countHours * COUNT_MILLISECONDS_IN_HOUR;

    return {
        remainingForMinute,
        remainingForHour,
        remainingForDay,
    }
}


