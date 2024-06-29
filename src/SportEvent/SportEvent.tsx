'use strict';

import React from "react";
import TimersList from "../TimersList/TimersList";
import {Current_and_upcoming} from "../api/api";

import "./SportEvent.scss";
import SportEventHeader, {SportEventHeaderMode} from "../SportEventHeader/SportEventHeader";

interface Props {
    sportEvent: Current_and_upcoming;
}

const SportEvent: React.FC<Props> = (props: Props) => {
    const {
        sportEvent,
    } = props;
    const {
        dt_start,
        title,
        dt_end,
    } = sportEvent;

    return <div className={"sportEvent"}>
        <SportEventHeader
            dateStart={dt_start}
            title={title}
            dateEnd={dt_end}
        />
        <TimersList dateStart={sportEvent.dt_start} />
    </div>
};

export default SportEvent;
