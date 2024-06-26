'use strict';

import axios from 'axios';

interface Current_and_upcoming {
    title: string;
    is_main: boolean;
    dt_start: string;
    dt_end: string;
    dt_create: string;
}

interface VideostandEvents {
    current_and_upcoming: Current_and_upcoming[];
}

interface SportsEventsDataRaw {
    data: {
        videostandEvents: VideostandEvents;
    };
}

export interface SportsEventsData {
    videostandEvents: VideostandEvents;
}

class Api {
    private _axios = axios.create({
        baseURL: 'https://beta.sosportom.ru',
    });

    public getSportEvents(): Promise<SportsEventsData> {
        return this._axios.post<any, { data: SportsEventsDataRaw }>( 'graphql', {
            "query": `query videostandEvents ($videostand_id: ID!) {
        videostandEvents(videostand_id: $videostand_id) {
        current_and_upcoming { title, is_main, dt_start, dt_end, dt_create
        }, finished { title, is_main, dt_start, dt_end, dt_create } } }`,
            "variables":{"videostand_id":"6"}
        }).then(({ data: { data } }) => data);
    }
}

export const api = new Api();
