<template>
<div class="container">

    <div class="row justify-content-center">
        <div class="col col-auto">
            <h5 id="list-title" class="pointer" @click="toggleMatches">
                Last 10 Matches
                <i class="pointer fa" :class="[visibleMatches ? 'fa-angle-up' : 'fa-angle-down']"></i>
            </h5>
            <table v-if="visibleMatches" class="table table-borderless table-sm">
                <tbody>
                <tr v-for="(match, index) in matches">
                    <td><small>{{datetime(match)}}</small></td>
                    <td class="text-right">{{match.player1}} <small>( {{match.place1}} )
                        {{match.rating1}} {{match.change1 | withPlusSign}}</small></td>
                    <td ><i class="fa" :class="[match.outcome ? 'fa-thumbs-o-up' : 'fa-thumbs-o-down']"></i></td>
                    <td class="text-left">{{match.player2}} <small>( {{match.place2}} )
                        {{match.rating2}} {{match.change2 | withPlusSign}}</small></td>
                    <td v-if="index === 0"
                        class="text-left pointer"
                        @click="deleteWarning">&nbsp;&nbsp;<i class="fa fa-trash-o"></i>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal" id="deleteMatchModal" tabindex="-1" role="dialog"
         aria-labelledby="DeleteMatchModalTitle" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="DeleteMatchModalTitle">Heads Up! Uwaga!</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div> Do you really want this match to be deleted?</div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary mr-auto" data-dismiss="modal">
                        Cancel
                    </button>
                    <button type="button" class="btn btn-danger" @click="deleteMatch">
                        YES Please - Delete it!
                    </button>
                </div>
            </div>
        </div>
    </div>

</div>
</template>

<script>
import db from "../firebase"

export default {
    name: 'MatchesList',

    props: [
        'matches',
        'players'
    ],

    data () {
        return {
            visibleMatches: true
        }
    },

    methods: {
        toggleMatches () {
            this.visibleMatches = !this.visibleMatches;
        },

        datetime (match) {
            let d = new Date(-1 * match.timestamp),
                year = d.getFullYear(),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                hours = '' + d.getHours(),
                minutes = '' + d.getMinutes();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;
            if (hours.length < 2) hours = '0' + hours;
            if (minutes.length < 2) minutes = '0' + minutes;

            return [year, month, day].join('-') + ' @ ' + [hours, minutes].join(':');
        },

        player1 (match) {
            return match.player1 + ' ( ' + match.place1 + ' )'
        },

        player2 (match) {
            return match.player2 + ' ( ' + match.place2 + ' )';
        },

        deleteWarning () {
            $('#deleteMatchModal').modal('show');
        },

        deleteMatch () {

            const player1 = this.players.filter(player => player['.key'] === this.matches[0].player1_id)[0];
            const player2 = this.players.filter(player => player['.key'] === this.matches[0].player2_id)[0];

            let updates = {};

            updates['/players/' + player1['.key'] + '/rating'] = this.matches[0].rating1;
            updates['/players/' + player2['.key'] + '/rating'] = this.matches[0].rating2;

            let player1_total_matches = player1.total_matches - 1;
            let player2_total_matches = player2.total_matches - 1;
            let player1_challenged = player1.challenged - 1;
            let player2_defended = player2.defended - 1;

            updates['/players/' + player1['.key'] + '/total_matches'] = player1_total_matches;
            updates['/players/' + player2['.key'] + '/total_matches'] = player2_total_matches;
            updates['/players/' + player1['.key'] + '/challenged'] = player1_challenged;
            updates['/players/' + player2['.key'] + '/defended'] = player2_defended;

            let player1_challenged_successfully = player1.challenged_successfully;
            let player2_defended_successfully = player2.defended_successfully;
            let player1_total_successfully = player1.total_successfully;
            let player2_total_successfully = player2.total_successfully;

            if (this.matches[0].outcome === 1) {
                player1_challenged_successfully -= 1;
                player1_total_successfully -= 1;
            } else {
                player2_defended_successfully -= 1;
                player2_total_successfully -= 1;
            }

            updates['/players/' + player1['.key'] + '/challenged_successfully'] = player1_challenged_successfully;
            updates['/players/' + player2['.key'] + '/defended_successfully'] = player2_defended_successfully;
            updates['/players/' + player1['.key'] + '/total_successfully'] = player1_total_successfully;
            updates['/players/' + player2['.key'] + '/total_successfully'] = player2_total_successfully;

            updates['/players/' + player1['.key'] + '/challenge_success_rate'] =
                player1_challenged
                    ? player1_challenged_successfully / player1_challenged * 100
                    : 0;

            updates['/players/' + player2['.key'] + '/defend_success_rate'] =
                player2_defended
                    ? player2_defended_successfully / player2_defended * 100
                    : 0;

            updates['/players/' + player1['.key'] + '/total_success_rate'] =
                player1_total_matches
                    ? player1_total_successfully / player1_total_matches * 100
                    : 0;

            updates['/players/' + player2['.key'] + '/total_success_rate'] =
                player2_total_matches
                    ? player2.total_successfully / player2_total_matches * 100
                    : 0;

            if (this.matches[0].outcome === 1) {
                const rangePlayers = this.players.filter(
                    player => player.place >= this.matches[0].place2 &&
                        player.place <= this.matches[0].place1
                );

                updates['/players/' + rangePlayers[0]['.key'] + '/place'] = rangePlayers[rangePlayers.length - 1].place;

                for (let i = 1, last = rangePlayers.length; i < last; i++) {
                    updates['/players/' + rangePlayers[i]['.key'] + '/place'] = rangePlayers[i].place - 1;
                }
            }

            db.ref().update(updates);

            db.ref('/matches/' + this.matches[0]['.key']).remove();

            $('#deleteMatchModal').modal('hide');
        }
    },

    filters: {
        withPlusSign (value) {
            return (value >= 0) ? "+" + value.toString() : value;
        }
    }
}
</script>

<style scoped>
#list-title {
    margin-top: 20px;
    font-weight: 100;
}

td {
    color: #555555;
    font-size: 0.95rem;
}
i {
    color: #999999;
    font-size: 0.8rem;
}
h5>i {
    font-size: 1rem;
}
</style>