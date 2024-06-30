// progress - https://ant.design/components/progress#components-progress-demo-circle
'use strict';

import React, {useEffect, useRef, useState} from "react";

import {Flex, Progress} from "antd";
import {TimeCounterFormat} from "./types/TimeCounter";
import './TimeCounter.scss';
import {
    COUNT_HOURS_IN_DAY,
    COUNT_MILLISECONDS_IN_DAY,
    COUNT_MILLISECONDS_IN_HOUR,
    COUNT_MILLISECONDS_IN_MINUTE,
    COUNT_MILLISECONDS_IN_SECOND,
    COUNT_MINUTES_IN_HOUR,
    COUNT_SECONDS_IN_MINUTE,
    MAX_DAYS
} from "../utils/utils";

const humanizeDuration = require("humanize-duration");

interface Props {
    timeCounterFormat: TimeCounterFormat;
    /**
     * Текущее значение дня, часа, минуты или секунды в зависимости от {@link timeCounterFormat}
     */
    value: number;
    /** Кол-во миллисекунд через которое надо декрементить таймер */
    millisecondsRemaining?: number;
    /** Кол-во раз, которое мы можем восстановить таймер */
    countReset?: number;
}

const TimeCounter: React.FC<Props> = (props: Props) => {
    const {
        value: _value,
        timeCounterFormat,
        millisecondsRemaining = 0,
        countReset = 0,
    } = props;
    const [value, setValue] = useState<number>(_value);
    const intervalRef_decrementValue = useRef<ReturnType<typeof setInterval>>();
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

    const {
        percent,
        steps,
        labelWithoutNumber,
    } = _getProgressOptions({
        value,
        timeCounterFormat,
    });

    useEffect(() => {
        let {
            intervalTimeDecrementTimer,
            valueResetTimer,
        } = getIntervalTime(timeCounterFormat);
        let _countReset = countReset;

        timeoutRef.current = setTimeout(() => {
            // Декремент
            const intervalCallback = () => {
                setValue(value => {
                    // Если значение счётчика таймера упало до нуля
                    if (value <= 0) {
                        // То смотрим, есть ли ещё заряды для reset его
                        if (_countReset > 0) {
                            --_countReset;

                            return valueResetTimer;
                        }
                        // Если зарядов нет, то этот таймер "всё", сносим все таймауты и интервалы
                        else {
                            clearInterval(intervalRef_decrementValue.current);
                            clearTimeout(timeoutRef.current);
                        }
                    }

                    return --value;
                });
            };

            intervalCallback();

            intervalRef_decrementValue.current = setInterval(intervalCallback, intervalTimeDecrementTimer);
        }, millisecondsRemaining);
        return () => {
            clearInterval(intervalRef_decrementValue.current);
            clearInterval(timeoutRef.current);
        };
    }, []);

    // Все таймеры кроме секунд с нулём будем прятать (что бы не скакало раз в минуту)
    const isHiddenTimer = value === 0 && timeCounterFormat !== TimeCounterFormat.Seconds
        // Любой таймер с отрицательным значением прячем
        || value < 0
    ;

    let progressColor: string;

    switch (timeCounterFormat) {
        case TimeCounterFormat.Days: {
            progressColor = "#0062b5";

            break;
        }
        case TimeCounterFormat.Hours: {
            progressColor = "#d62f0d";

            break;
        }
        case TimeCounterFormat.Minutes: {
            progressColor = "#fdae47";

            break;
        }
        case TimeCounterFormat.Seconds: {
            progressColor = "#51acd8";

            break;
        }
    }

    return <div className={`timeCounter ${isHiddenTimer ? ' timeCounter-hidden' : ''}`}>
        <Flex align="center" wrap gap={30}>
            <Progress
                type="circle"
                trailColor={progressColor}
                steps={steps}
                percent={percent}
                strokeColor="none"
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
    </div>;
};

export default TimeCounter;

interface ProgressOptions {
    steps: number;
    percent: number;
    labelWithoutNumber: string;
}

const _getProgressOptions = (() => {
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
            percent: 100 - Math.round(value / steps * 100),
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

function getIntervalTime(timeCounterFormat: TimeCounterFormat): {
    intervalTimeDecrementTimer: number,
    /** Число к которому надо сбросить таймер */
    valueResetTimer: number,
} {
    switch (timeCounterFormat) {
        case TimeCounterFormat.Days: {
            return {
                intervalTimeDecrementTimer: COUNT_MILLISECONDS_IN_DAY,
                valueResetTimer: 0,
            };
        }
        case TimeCounterFormat.Hours: {
            return {
                intervalTimeDecrementTimer: COUNT_MILLISECONDS_IN_HOUR,
                valueResetTimer: COUNT_HOURS_IN_DAY - 1,
            };
        }
        case TimeCounterFormat.Minutes: {
            return {
                intervalTimeDecrementTimer: COUNT_MILLISECONDS_IN_MINUTE,
                valueResetTimer: COUNT_MINUTES_IN_HOUR - 1,
            };
        }
        case TimeCounterFormat.Seconds: {
            return {
                intervalTimeDecrementTimer: COUNT_MILLISECONDS_IN_SECOND,
                valueResetTimer: COUNT_SECONDS_IN_MINUTE - 1,
            };
        }
        default: {
            throw new Error("Unknown format!");
        }
    }
}

function logs(options: {
    timeCounterFormat: TimeCounterFormat,
    countReset: number,
    millisecondsRemaining: number,
}) {
    const {
        timeCounterFormat,
        countReset,
        millisecondsRemaining,
    } = options;

    let {
        intervalTimeDecrementTimer,
        valueResetTimer,
    } = getIntervalTime(timeCounterFormat);

    if (timeCounterFormat !== TimeCounterFormat.Seconds) {
        console.table([
            ["Перерендерился таймер", timeCounterFormat],
            ["Исходное кол-во зарядов (сброса таймера) было", countReset],
            ["Восстановит таймер до value", valueResetTimer],
            ["Сбросится через кол-во сек ", millisecondsRemaining / COUNT_MILLISECONDS_IN_SECOND],
            ["Интервал сброса таймера сек ", intervalTimeDecrementTimer / COUNT_MILLISECONDS_IN_SECOND],
            ["Текущее время ререндера этого таймера", new Date().toLocaleTimeString()],
        ])
    }
}
