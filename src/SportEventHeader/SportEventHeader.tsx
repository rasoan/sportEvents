'use strict';

import React from "react";

import "./SportEventHeader.scss";

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
    const dateStart = new Date(dateStart_string).toLocaleDateString('ru');

    return <div className={`sportEventHeader`}>
        <h3 className={"container__dateStart dateStart"}>{dateStart}</h3>
        <h2 className={`container__title title${sportEventHeaderMode === SportEventHeaderMode.WithoutSportEventContainer ? ' title-withoutSportEventContainer' : ''}`}>
            {title}
        </h2>
    </div>;
};

export default SportEventHeader;
