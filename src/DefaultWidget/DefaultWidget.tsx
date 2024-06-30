'use strict';

import React, {useEffect, useMemo, useRef, useState} from "react";

import './DefaultWidget.scss';
import {Space} from "antd";
import {DefaultWidget_mode} from "../App/types/App";
import {normalizeDateItem} from "../utils/utils";

interface Props {
    mode?: DefaultWidget_mode;
}

const DefaultWidget: React.FC<Props> = (props: Props) => {
    const {
        mode = DefaultWidget_mode.WithOtherEvents,
    } = props;
    const {
        time: _time,
        dayAndMonth: _dayAndMonth,
        dayOfWeek: _dayOfWeek,
    } = getDateLabels();
    const intervalRef = useRef<ReturnType<typeof setInterval>>();
    const [ time, setTime ] = useState<string>(_time);
    const [ dayAndMonth, setDayAndMonth ] = useState<string>(_dayAndMonth);
    const [ dayOfWeek, setDayOfWeek ] = useState<string>(_dayOfWeek);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            const {
                time,
                dayAndMonth,
                dayOfWeek,
            } = getDateLabels();

            setTime(time);
            setDayAndMonth(dayAndMonth);
            setDayOfWeek(dayOfWeek);
        }, 1000);

        return () => clearInterval(intervalRef.current);
    }, []);

    return <div className={"DefaultWidget"}>
        <div className={`DefaultWidget__timeWrapper wrapper timeWrapper${mode === DefaultWidget_mode.Solo ? ' timeWrapper-solo' : ''}`}>
            <span className={"timeWrapper__timeLabel timeLabel"}>{time}</span>
        </div>
        <div className={`DefaultWidget__dateWrapper wrapper dateWrapper${mode === DefaultWidget_mode.Solo ? ' dateWrapper-solo' : ''}`}>
            <span className={"dateWrapper__dayAndMonthLabel dayAndMonthLabel"}>{dayAndMonth}</span>
            {mode === DefaultWidget_mode.Solo ? '' : <span className={"dayAndMonthLabel__separatorMonthDay"}>&nbsp;·&nbsp;</span>}
            <span className={"dateWrapper__dayOfWeekLabel dayOfWeekLabel"}>{dayOfWeek}</span>
        </div>
    </div>;
};

export default DefaultWidget;

const getDateLabels = (() => {
    const monthNames = [
        "января", "февраля", "марта", "апреля", "мая", "июня",
        "июля", "августа", "сентября", "октября", "ноября", "декабря"
    ];
    const daysOfWeek = [
        'воскресенье', 'понедельник', 'вторник', 'среда',
        'четверг', 'пятница', 'суббота',
    ];

    return () => {
        const date = new Date();
        const time = `${date.getHours()}:${normalizeDateItem(date.getMinutes())}`;

        // С единицы подсчёт начинается, а массив с нуля
        const dayOfWeek = daysOfWeek[date.getDay()];
        const dayAndMonth = `${date.getDate()} ${monthNames[date.getMonth()]}`;

        return {
            time,
            dayAndMonth,
            dayOfWeek,
        }
    }
})()
