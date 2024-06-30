'use strict';

import React, {useEffect, useState} from "react";

import './App.scss';
import {api, VideoStandEvent} from "../api/api";
import DefaultWidget from "../DefaultWidget/DefaultWidget";
import SportEvent from "../SportEvent/SportEvent";
import SportEventHeader, {SportEventHeaderMode} from "../SportEventHeader/SportEventHeader";
import {DefaultWidget_mode} from "./types/App";

interface Props {}


const App: React.FC<Props> = (props: Props) => {
    const [ videoStandEventCurrent, setVideoStandEventCurrent ] = useState<VideoStandEvent>();
    const [ videoStandEventNext, setVideoStandEventNext ] = useState<VideoStandEvent>();

    useEffect(() => {
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

        // Тестовый код, можно раскомментировать и проверить без сервера
        /*
        const videoStandEvents: VideoStandEvent[] = [
            {
                dt_start: "2024-08-16T10:00:00+03:00",
                dt_end: "2024-08-20T23:59:00+03:00",
                dt_create: "2024-01-31T02:39:01+03:00",
                is_main: false,
                title: "Чемпионат Москвы",
            },
            {
                dt_start: "2024-07-01T11:13:00+03:00",
                dt_end: "2024-07-10T11:14:00+03:00",
                dt_create: "2023-01-31T02:39:01+03:00",
                is_main: true,
                title: "Чемпионат Ярославля",
            },
            {
                dt_start: "2024-10-16T10:00:00+03:00",
                dt_end: "2024-10-18T23:59:00+03:00",
                dt_create: "2024-01-31T02:39:01+03:00",
                is_main: false,
                title: "Чемпионат Нижнего Новгорода",
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
         */
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
