'use strict';

import React, {useEffect, useRef, useState} from "react";
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
    const [isSportEventNow, setIsSportEventNow] = useState<boolean>(false);
    const timeoutRef_startEvent = useRef<ReturnType<typeof setInterval>>();
    const timeoutRef_endEvent = useRef<ReturnType<typeof setInterval>>();

    useEffect(() => {
        const dateTime_now = new Date().getTime();
        const differenceTime_start = new Date(dt_start).getTime() - dateTime_now;
        const differenceTime_end = new Date(dt_end).getTime() - dateTime_now;
        const isSportEventNow = differenceTime_start < 0 && differenceTime_end > 0;

        setIsSportEventNow(isSportEventNow);

        if (differenceTime_start > 0) {
            timeoutRef_startEvent.current = setTimeout(() => {
                setIsSportEventNow(true);
            }, differenceTime_start);
        }

        timeoutRef_endEvent.current = setTimeout(() => {
            setIsSportEventNow(false);
        }, differenceTime_end);

        return () => {
            clearTimeout(timeoutRef_startEvent.current);
            clearTimeout(timeoutRef_endEvent.current);
        }
    }, []);

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
