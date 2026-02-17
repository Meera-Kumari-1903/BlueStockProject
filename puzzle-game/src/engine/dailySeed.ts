export function getTodaySeed(): number {
    const today = new Date();

    const seed =
        today.getUTCFullYear() * 10000 +
        (today.getUTCMonth() + 1) * 100 +
        today.getUTCDate();

    return seed;
}


