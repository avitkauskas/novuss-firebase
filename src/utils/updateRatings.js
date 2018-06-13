// Extracted into separate file for technical support only.

// Should be copied into MatchesList.vue methods and
// used there as @click event on some element
//
// Should also change 'matches' firebase element in App.vue
// to give full list of matches to MatchesList

updateRatings () {
    let updates = {};

    this.players.forEach(player =>
        updates['/players/' + player['.key'] + '/rating'] = 1500
    );

    db.ref().update(updates);

    this.matches.reverse();

    this.matches.forEach(match => {
        updates = {};

        const player1 = this.players.filter(player => player['.key'] === match.player1_id)[0];
        const player2 = this.players.filter(player => player['.key'] === match.player2_id)[0];

        const K = 30;

        let player1Expected = 1 / (1 + Math.pow(10, (player2.rating - player1.rating) / 400));

        let player1Change = Math.round(K * (match.outcome - player1Expected));
        let player2Change = -player1Change;

        updates['/matches/' + match['.key'] + '/rating1'] = player1.rating;
        updates['/matches/' + match['.key'] + '/rating2'] = player2.rating;
        updates['/matches/' + match['.key'] + '/change1'] = player1Change;
        updates['/matches/' + match['.key'] + '/change2'] = player2Change;

        updates['/players/' + player1['.key'] + '/rating'] = player1.rating + player1Change;
        updates['/players/' + player2['.key'] + '/rating'] = player2.rating + player2Change;

        db.ref().update(updates);
    });
}