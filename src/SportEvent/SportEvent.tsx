'use strict';

import React from "react";
import TimersList from "../TimersList/TimersList";

import "./SportEvent.scss";
import SportEventHeader, {SportEventHeaderMode} from "../SportEventHeader/SportEventHeader";
import {FieldTimeOutlined} from "@ant-design/icons";
import {VideoStandEvent} from "../api/api";

interface Props {
    sportEvent: VideoStandEvent;
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
    const dateTime_now = new Date().getTime();
    const differenceTime_start = dateTime_now - new Date(dt_start).getTime();
    const differenceTime_end = new Date(dt_end).getTime() - dateTime_now;
    // todo: здесь вычислить в useState и по setTimeout выставлять плашку, что идёт сейчас соревнование
    const isSportEventNow = differenceTime_start > 0 && differenceTime_end > 0;

    return <div className={"sportEvent"}>
        <SportEventHeader
            title={title}
            dateStart={dt_start}
            dateEnd={dt_end}
        />
        {!isSportEventNow ? <>
            <TimersList dateStart={sportEvent.dt_start}/>
        </> : <>
            <div className={"sportEvent__nowEventLabel nowEventLabelsContainer"}>
                <span>Идёт сейчас</span>
                <FieldTimeOutlined style={{ fontSize: '40px', fontWeight: 'bold' }} />
            </div>
        </>}
    </div>
};

export default SportEvent;
