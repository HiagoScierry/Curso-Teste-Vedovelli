module.exports.sum = (a, b) => {
    const numberA = parseInt(a, 10);
    const numberB = parseInt(b, 10);

    if (Number.isNaN(numberA) || Number.isNaN(numberB)) {
        throw new Error("sum() accepts only numbers");
    }
    return numberA + numberB;
}