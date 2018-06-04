<template>
<div>
    <pyramid-row v-for="row in rows"
                 :players="rowPlayers(row)"
                 :empty-slots="emptySlots(row)"
                 :total-players="players.length"
                 :key="row"/>
</div>
</template>

<script>
import PyramidRow from './PyramidRow'

export default {
    name: 'Pyramid',

    props: [
        'players'
    ],

    components: {
        PyramidRow
    },

    computed: {
        rows: function() {
            const total_players = this.players.length;
            let pyramid_elements = 0;
            let increment = 1;
            let rows = 0;

            while (pyramid_elements < total_players) {
                pyramid_elements += increment;
                increment++;
                rows++;
            }

            if (pyramid_elements === total_players) rows++;

            return rows;
        },
    },

    methods: {
        firstInARow: function(row) {
            let first = 0;

            for (let i = 0; i < row; i++) {
                first += i;
            }

            return first;
        },

        rowPlayers: function(row) {
            return this.players.slice(this.firstInARow(row), this.firstInARow(row) + row);
        },

        emptySlots: function(row) {
            let emptySlots = [];

            for (let i = 0; i < row - this.rowPlayers(row).length; i++) {
                emptySlots.push({
                    "place": this.players.length + i + 1,
                    "name": "_ _ _ _"});
            }

            return emptySlots;
        }
    }
}
</script>
