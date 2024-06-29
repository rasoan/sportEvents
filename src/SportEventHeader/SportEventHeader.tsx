'use strict';

import React from "react";

import "./SportEventHeader.scss";
import {normalizeDateItem} from "../utils/utils";

interface Props {
    title: string;
    dateStart: string;
    dateEnd: string;
    sportEventHeaderMode?: SportEventHeaderMode;
}

export const enum SportEventHeaderMode {
    Default = 1,
    WithoutSportEventContainer = 2,
}

const SportEventHeader: React.FC<Props> = (props: Props) => {
    const {
        dateStart: dateStart_string,
        dateEnd: dateEnd_string,
        title,
        sportEventHeaderMode = SportEventHeaderMode.Default,
    } = props;
    const dateStart = _getDateLabel({
        dateStart_string,
        dateEnd_string,
    });

    return <div className={`sportEventHeader`}>
        <h3 className={"container__dateStart dateStart"}>{dateStart}</h3>
        <h2 className={`container__title title${sportEventHeaderMode === SportEventHeaderMode.WithoutSportEventContainer ? ' title-withoutSportEventContainer' : ''}`}>
            {title}
        </h2>
    </div>;
};

export default SportEventHeader;

function _getDateLabel(options: {
    dateStart_string: string,
    dateEnd_string: string,
}): string {
    const {
        dateStart_string,
        dateEnd_string,
    } = options;

    const dateStart = new Date(dateStart_string);
    const dateStart_day = normalizeDateItem(dateStart.getDate());
    const dateStart_month = normalizeDateItem(dateStart.getMonth() + 1);
    const dateStart_year = normalizeDateItem(dateStart.getFullYear());
    //
    const dateEnd = new Date(dateEnd_string);
    const dateEnd_day = normalizeDateItem(dateEnd.getDate());
    const dateEnd_month = normalizeDateItem(dateEnd.getMonth() + 1);
    const dateEnd_year = normalizeDateItem(dateEnd.getFullYear());

    if (dateStart_year !== dateEnd_year) {
        return `${dateStart_day}.${dateStart_month}.${dateStart_year} - ${dateEnd_day}.${dateEnd_month}.${dateEnd_year}`;
    }

    if (dateStart_month !== dateEnd_month) {
        return `${dateStart_day}.${dateStart_month} - ${dateEnd_day}.${dateEnd_month}.${dateEnd_year}`;
    }

    if (dateStart_day !== dateEnd_day) {
        return `${dateStart_day}-${dateEnd_day}.${dateEnd_month}.${dateEnd_year}`;
    }

    return dateStart.toLocaleDateString('ru');
}
