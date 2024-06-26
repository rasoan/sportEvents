// progress - https://ant.design/components/progress#components-progress-demo-circle
'use strict';

import React from "react";

import {Flex, Progress} from "antd";
import {TimeCounterFormat} from "./types/TimeCounter";

const humanizeDuration = require("humanize-duration");

import './TimeCounter.scss';

interface Props {
    timeCounterFormat: TimeCounterFormat;
    /**
     * Текущее значение дня, часа, минуты или секунды в зависимости от {@link timeCounterFormat}
     */
    value: number;
}

const TimeCounter: React.FC<Props> = (props: Props) => {
    const {
        value,
        timeCounterFormat,
    } = props;
    const {
        percent,
        steps,
        labelWithoutNumber,
    } = _getProgressOptions({
        value,
        timeCounterFormat,
    })

    return <>
        <Flex align="center" wrap gap={30}>
            <Progress
                type="circle"
                steps={steps}
                percent={percent}
                strokeColor="green"
                format={() => <>
                    <div className={"antProgressTextCustom"}>
                        <span className={'antProgressTextCustom__label antProgressTextCustom__label-withNumber'}>
                            {value}
                        </span>
                        <br />
                        <span className={'antProgressTextCustom__label antProgressTextCustom__label-withText'}>
                            {labelWithoutNumber}
                        </span>
                    </div>
                </>}
            />
        </Flex>
    </>;
};

export default TimeCounter;

interface ProgressOptions {
    steps: number;
    percent: number;
    labelWithoutNumber: string;
}

const _getProgressOptions = (() => {
    // todo: глянуть ещё раз ТЗ
    // todo: учесть, что value может быть больше чем надо, тогда взять %
    const MAX_DAYS = 7;
    const MAX_HOURS = 24;
    const MAX_MINUTES = 60;
    const MAX_SECONDS = 60;

    return function (options: {
        value: number,
        timeCounterFormat: TimeCounterFormat,
    }): ProgressOptions {
        const {
            value,
            timeCounterFormat,
        } = options;

        let steps: number;
        let labelWithoutNumber: string;

        switch (timeCounterFormat) {
            case TimeCounterFormat.Days: {
                steps = MAX_DAYS;
                labelWithoutNumber = _normalizeLabelTextWitoutNumber(
                    humanizeDuration(
                        /* 86400 секунд в одном дне */
                        _convertValueToMilliseconds({value, seconds: 86400}),
                        {
                            units: ["d"],
                            language: "ru"
                        }
                    )
                );

                break;
            }
            case TimeCounterFormat.Hours: {
                steps = MAX_HOURS;
                labelWithoutNumber = _normalizeLabelTextWitoutNumber(humanizeDuration(
                        /* 3600 секунд в одном часу */
                        _convertValueToMilliseconds({value, seconds: 3600}),
                        {
                            units: ["h"],
                            language: "ru"
                        }
                    )
                );

                break;
            }
            case TimeCounterFormat.Minutes: {
                steps = MAX_MINUTES;
                labelWithoutNumber = _normalizeLabelTextWitoutNumber(humanizeDuration(
                        /* 60 секунд в одной минуте */
                        _convertValueToMilliseconds({value, seconds: 60}),
                        {
                            units: ["m"],
                            language: "ru"
                        }
                    )
                );

                break;
            }
            case TimeCounterFormat.Seconds: {
                steps = MAX_SECONDS;
                labelWithoutNumber = _normalizeLabelTextWitoutNumber(
                    humanizeDuration(
                        /* 1 секунда в одной секунде */
                        _convertValueToMilliseconds({value, seconds: 1}),
                        {
                            units: ["s"],
                            language: "ru"
                        }
                    )
                );

                break;
            }
            default: {
                throw new Error("Unknown format!");
            }
        }

        return {
            labelWithoutNumber,
            steps,
            // Формула вычисления процентов
            percent: Math.round(value / steps * 100),
        };
    }
})();

/**
 * Удалить из строки цифры и пробелы
 *
 * @param label
 */
function _normalizeLabelTextWitoutNumber(label: string) {
    return label.replace(/\d+\s+/g, '')
}

/** Конвертировать кол-во дней, часов, минут в миллисекунды
 *
 * @param options
 */
function _convertValueToMilliseconds(options: {
    value: number,
    seconds: number,
}) {
    const {
        value,
        seconds,
    } = options;

    return value * (seconds * 1000);
}
