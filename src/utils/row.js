const row = function (position) {
    let current_position = 0;
    let increment = 1;
    let row = 0;

    while (current_position < position) {
        current_position += increment;
        increment++;
        row++;
    }

    return row;
};

export default row;