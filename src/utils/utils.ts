'use strict';

export const MAX_DAYS = 7;

export function getCountDaysHoursMinutesSecondsBeforeEvent(dateStart: string) {
    const date_startEvent = new Date(dateStart);
    const date_now = new Date();
    const difference = date_startEvent.getTime() - date_now.getTime();
    const countDays = _getCountersOfDays(difference);
    const countHours = _getRemainderOfHours(difference);
    const countMinutes = _getRemainderOfMinutes(difference);
    const countSeconds = _getRemainderOfSeconds(difference);

    const allCountDays = countDays.reduce((previousValue, nextValue) => {
        return previousValue + nextValue;
    }, 0);

    return {
        countDays,
        allCountDays,
        countHours,
        countMinutes,
        countSeconds,
    };
}

function _getCountersOfDays(milliseconds: number): number[] {
    const countDays = _getCountDaysByMilliseconds(milliseconds);

    if (countDays <= MAX_DAYS) {
        return [ countDays ];
    }

    const bundleOfDaysList: number[] = [];

    {
        const remainingDays_or_zero = countDays % MAX_DAYS;

        if (remainingDays_or_zero > 0) {
            bundleOfDaysList.push(remainingDays_or_zero);
        }
    }

    for (let i = 0; i < Math.floor(countDays / MAX_DAYS); i++) {
        bundleOfDaysList.push(MAX_DAYS);
    }

    return bundleOfDaysList;
}

function _getRemainderOfHours(milliseconds: number): number {
    const countHours = _getCountHoursByMilliseconds(milliseconds);

    // Сутки выкидываем и оставляем часы
    return countHours % COUNT_HOURS_IN_DAY;
}

function _getRemainderOfMinutes(milliseconds: number): number {
    const countMinutes = _getCountMinutesByMilliseconds(milliseconds);

    // Часы выкидываем и оставляем минуты
    return countMinutes % COUNT_MINUTES_IN_HOUR;
}

function _getRemainderOfSeconds(milliseconds: number): number {
    const countSeconds = _getCountSecondsByMilliseconds(milliseconds);

    // Минуты выкидываем и оставляем секунды
    return countSeconds % COUNT_SECONDS_IN_MINUTE;
}

const COUNT_HOURS_IN_DAY = 24;
const COUNT_MINUTES_IN_HOUR = 60;
const COUNT_SECONDS_IN_MINUTE = 60;
const COUNT_MILLISECONDS_IN_SECOND = 1000;
const COUNT_MILLISECONDS_IN_MINUTE = COUNT_MILLISECONDS_IN_SECOND * COUNT_SECONDS_IN_MINUTE;
const COUNT_MILLISECONDS_IN_HOUR = COUNT_MILLISECONDS_IN_MINUTE * COUNT_MINUTES_IN_HOUR;
const COUNT_MILLISECONDS_IN_DAY = COUNT_MILLISECONDS_IN_HOUR * COUNT_HOURS_IN_DAY;

function _getCountDaysByMilliseconds(milliseconds: number) {
    // 86400 секунд в одном дне, а поскольку работаем с миллисекундами, то докидываем 1000 поскольку в одной сек 1000 милсек.
    return Math.floor(milliseconds / COUNT_MILLISECONDS_IN_DAY);
}

function _getCountHoursByMilliseconds(milliseconds: number) {
    return Math.floor(milliseconds / COUNT_MILLISECONDS_IN_HOUR);
}

function _getCountMinutesByMilliseconds(milliseconds: number) {
    return Math.floor(milliseconds / COUNT_MILLISECONDS_IN_MINUTE);
}

function _getCountSecondsByMilliseconds(milliseconds: number) {
    return Math.floor(milliseconds / COUNT_MILLISECONDS_IN_SECOND);
}

export function normalizeDateItem(dateItem: number): string {
    return String(dateItem).padStart(2, '0');
}
