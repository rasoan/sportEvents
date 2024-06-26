'use strict';

export function getCountersOfDays(options: {
    countDays: number,
    maxDays: number,
}): number[] {
    const {
        countDays,
        maxDays,
    } = options;

    if (countDays <= maxDays) {
        return [ countDays ];
    }

    const bundleOfDaysList: number[] = [];

    {
        const remainingDays_or_zero = countDays % maxDays;

        if (remainingDays_or_zero > 0) {
            bundleOfDaysList.push(remainingDays_or_zero);
        }
    }

    for (let i = 0; i < Math.floor(countDays / maxDays); i++) {
        bundleOfDaysList.push(maxDays);
    }

    return bundleOfDaysList;
}
