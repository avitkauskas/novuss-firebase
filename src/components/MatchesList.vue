<template>
<div class="container">

    <div class="row  justify-content-center">
        <div class="col col-auto">
            <h5 id="list-title">Last 10 Matches</h5>
            <table class="table table-borderless table-sm">
                <tbody>
                <tr v-for="(match, index) in matches">
                    <td><small>{{datetime(match)}}</small></td>
                    <td class="float-right">{{match.player1}} <small>( {{match.place1}} )</small></td>
                    <td ><i class="fa" :class="[match.outcome ? 'fa-thumbs-o-up' : 'fa-thumbs-o-down']"></i></td>
                    <td class="float-left">{{match.player2}} <small>( {{match.place2}} )</small></td>
                    <td v-if="index === 0"
                        class="float-left pointer"
                        @click="deleteWarning">&nbsp;&nbsp;<i class="fa fa-trash-o"></i></td>
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

    methods: {
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
            if (this.matches[0].outcome === 1) {
                const rangePlayers = this.players.filter(
                    player => player.place >= this.matches[0].place2 &&
                        player.place <= this.matches[0].place1
                );

                let updates = {};

                updates['/players/' + rangePlayers[0]['.key']] =
                    {
                        name: rangePlayers[0].name,
                        place: rangePlayers[rangePlayers.length - 1].place
                    };

                for (let i = 1, last = rangePlayers.length; i < last; i++) {
                    updates['/players/' + rangePlayers[i]['.key']] =
                        {
                            name: rangePlayers[i].name,
                            place: rangePlayers[i].place - 1
                        }
                }

                db.ref().update(updates);
            }

            db.ref('/matches/' + this.matches[0]['.key']).remove();

            $('#deleteMatchModal').modal('hide');
        }
    }
}
</script>

<style scoped>
#list-title {
    margin-top: 25px;
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
</style>