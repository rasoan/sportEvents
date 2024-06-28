'use strict';

import React, {useEffect} from "react";

import './DefaultWidget.scss';
import {Space} from "antd";

export const enum DefaultWidget_mode {
    Solo = 1,
    WithOtherEvents = 2,
}

interface Props {
    mode: DefaultWidget_mode;
}

const DefaultWidget: React.FC<Props> = (props: Props) => {
    const {
        mode,
    } = props;
    const {
        time,
        dayAndMonth,
        dayOfWeek,
    } = getDateLabels();

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
        'понедельник', 'вторник', 'среда',
        'четверг', 'пятница', 'суббота', 'воскресенье'
    ];

    return () => {
        const date = new Date();
        const time = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;

        // С единицы подсчёт начинается, а массив с нуля
        const dayOfWeek = daysOfWeek[date.getDay() - 1];
        const dayAndMonth = `${date.getDate()} ${monthNames[date.getMonth()]}`;

        return {
            time,
            dayAndMonth,
            dayOfWeek,
        }
    }
})()
