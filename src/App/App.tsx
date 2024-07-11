'use strict';

import React, {useEffect, useState} from "react";

import './App.scss';
import {api, VideoStandEvent} from "../api/api";
import DefaultWidget from "../DefaultWidget/DefaultWidget";
import SportEvent from "../SportEvent/SportEvent";
import SportEventHeader, {SportEventHeaderMode} from "../SportEventHeader/SportEventHeader";
import {DefaultWidget_mode} from "./types/App";
import {COUNT_MILLISECONDS_IN_DAY} from "../utils/utils";

interface Props {}


const App: React.FC<Props> = (props: Props) => {
    const [ videoStandEventCurrent, setVideoStandEventCurrent ] = useState<VideoStandEvent>();
    const [ videoStandEventNext, setVideoStandEventNext ] = useState<VideoStandEvent>();

    useEffect(() => {
        /*
        api.getSportEvents().then(response => {
            const {
                videoStandEventCurrent,
                videoStandEventNext,
            } = _getCurrentAndNextVideoStandEvents(response.videostandEvents.current_and_upcoming)

            if (videoStandEventCurrent) {
                setVideoStandEventCurrent(videoStandEventCurrent);
            }

            if (videoStandEventNext) {
                setVideoStandEventNext(videoStandEventNext);
            }
        });
        */
        // Тестовый код, можно раскомментировать и проверить без сервера
        /**/
        const videoStandEvents: VideoStandEvent[] = [
            {
                dt_start: new Date(Date.now() + COUNT_MILLISECONDS_IN_DAY / 2).toString(),
                dt_end: new Date(Date.now() + COUNT_MILLISECONDS_IN_DAY).toString(),
                dt_create: "2024-01-31T02:39:01+03:00",
                is_main: false,
                title: "Чемпионат Москвы",
            },
            {
                dt_start: new Date(Date.now() + COUNT_MILLISECONDS_IN_DAY * 4).toString(),
                dt_end: new Date(Date.now() + COUNT_MILLISECONDS_IN_DAY * 5).toString(),
                dt_create: "2023-01-31T02:39:01+03:00",
                is_main: true,
                title: "Чемпионат Ярославля",
            },
        ];
        const {
            videoStandEventCurrent,
            videoStandEventNext,
        } = _getCurrentAndNextVideoStandEvents(videoStandEvents)

        if (videoStandEventCurrent) {
            setVideoStandEventCurrent(videoStandEventCurrent);
        }

        if (videoStandEventNext) {
            setVideoStandEventNext(videoStandEventNext);
        }
    }, []);

    const mode: DefaultWidget_mode = (videoStandEventCurrent || videoStandEventNext)
        ? DefaultWidget_mode.WithOtherEvents
        : DefaultWidget_mode.Solo
    ;

    return <div className={"app appWrapper"}>
        <div className={"app__row appRow"}>
            <DefaultWidget mode={mode} />
        </div>
        {mode === DefaultWidget_mode.WithOtherEvents ? <>
            <div className={"app__row appRow appRow-sportEvent"}>
                {videoStandEventCurrent ? <SportEvent sportEvent={videoStandEventCurrent} /> : null}
            </div>
            <div className={"app__row appRow"}>
                {videoStandEventNext ? <SportEventHeader
                    title={videoStandEventNext.title}
                    dateStart={videoStandEventNext.dt_start}
                    dateEnd={videoStandEventNext.dt_end}
                    sportEventHeaderMode={SportEventHeaderMode.WithoutSportEventContainer}
                /> : null}
            </div>
        </> : null}
    </div>;
};

export default App;

function _getCurrentAndNextVideoStandEvents(videoStandEvents: VideoStandEvent[]): {
    videoStandEventCurrent?: VideoStandEvent,
    videoStandEventNext?: VideoStandEvent,
} {
    const _videoStandEvents = videoStandEvents.sort(
        (videoStandEvents_prev, videoStandEvents_next) => {
            return new Date(videoStandEvents_prev.dt_start).getTime() - new Date(videoStandEvents_next.dt_start).getTime();
        }
    );
    const currentAndNextVideoStandEvents: {
        videoStandEventCurrent?: VideoStandEvent,
        videoStandEventNext?: VideoStandEvent,
    } = {};

    const mainEvent = videoStandEvents.find(({ is_main }) => is_main);

    if (mainEvent) {
        currentAndNextVideoStandEvents.videoStandEventCurrent = mainEvent;
    }
    else {
        currentAndNextVideoStandEvents.videoStandEventCurrent = _videoStandEvents[0];
    }

    if (_videoStandEvents.length > 1) {
        currentAndNextVideoStandEvents.videoStandEventNext = videoStandEvents.find(
            ({dt_create}) => dt_create !== currentAndNextVideoStandEvents.videoStandEventCurrent?.dt_create
        );
    }

    return currentAndNextVideoStandEvents;
}
