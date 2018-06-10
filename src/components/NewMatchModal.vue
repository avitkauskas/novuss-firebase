<template>
<!-- Modal -->
<div class="modal" id="newMatchModal" tabindex="-1" role="dialog"
     aria-labelledby="NewMatchModalTitle" aria-hidden="true"
     @player-selected="playerSelected($event)">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="NewMatchModalTitle">Was the Challenge successful?</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
              <p class="h3">
                  {{player1.name}}
                  <small>
                      <i class="fa fa-bolt" style="color: indianred"></i>
                     </small>
                  {{player2.name}}
              </p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary mr-auto" data-dismiss="modal">
                    Cancel
                </button>
                <button type="button" class="btn btn-warning" @click="addMatch(0)">
                    NO Luck
                </button>
                <button type="button" class="btn btn-success" @click="addMatch(1)">
                    YES! Successful!
                </button>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import db from "../firebase"
import eventbus from '../eventbus'
import row from '../utils/row'

export default {
    name: 'NewMatchModal',

    data () {
        return {
            players: [],
            player1: '',
            player2: ''
        }
    },

    firebase: {
        allPlayers: db.ref('players').orderByChild('place')
    },

    methods: {
        playerSelected: function (player) {
            if (player) {
                this.players.push(player);
                if (this.players.length === 2) {
                    if (this.players[0].place > this.players[1].place) {
                        [this.player1, this.player2] = this.players;
                    } else {
                        [this.player2, this.player1] = this.players;
                    }
                    const row_diff = row(this.player1.place) - row(this.player2.place);
                    if ( this.player2.place !== 1 && row_diff > 1 || row_diff > 2) {
                        this.players = [];
                        eventbus.$emit('clear-selections');
                    } else {
                        $('#newMatchModal').modal('show');
                    }

                }
            } else {
                this.players = [];
            }
        },

        addMatch (outcome) {
            db.ref('matches').push({
                timestamp: -1 * Date.now(),
                player1_id: this.player1['.key'],
                player2_id: this.player2['.key'],
                player1: this.player1.name,
                player2: this.player2.name,
                place1: this.player1.place,
                place2: this.player2.place,
                outcome: outcome
            });

            let updates = {};

            let player1_total_matches = this.player1.total_matches + 1;
            let player2_total_matches = this.player2.total_matches + 1;
            let player1_challenged = this.player1.challenged + 1;
            let player2_defended = this.player2.defended + 1;

            updates['/players/' + this.player1['.key'] + '/total_matches'] = player1_total_matches;
            updates['/players/' + this.player2['.key'] + '/total_matches'] = player2_total_matches;
            updates['/players/' + this.player1['.key'] + '/challenged'] = player1_challenged;
            updates['/players/' + this.player2['.key'] + '/defended'] = player2_defended;

            let player1_challenged_successfully = this.player1.challenged_successfully;
            let player2_defended_successfully = this.player2.defended_successfully;

            if (outcome === 1) {
                player1_challenged_successfully += 1;
            } else {
                player2_defended_successfully += 1;
            }

            updates['/players/' + this.player1['.key'] + '/challenged_successfully'] = player1_challenged_successfully;
            updates['/players/' + this.player2['.key'] + '/defended_successfully'] = player2_defended_successfully;

            updates['/players/' + this.player1['.key'] + '/challenge_success_rate'] =
                player1_challenged_successfully / player1_challenged * 100;
            updates['/players/' + this.player2['.key'] + '/defend_success_rate'] =
                player2_defended_successfully / player2_defended * 100;
            updates['/players/' + this.player1['.key'] + '/total_success_rate'] =
                (player1_challenged_successfully + this.player1.defended_successfully) /
                    player1_total_matches * 100;
            updates['/players/' + this.player2['.key'] + '/total_success_rate'] =
                (this.player2.challenged_successfully + player2_defended_successfully) /
                    player2_total_matches * 100;

            if (outcome === 1) {
                const rangePlayers = this.allPlayers.filter(
                    player => player.place >= this.player2.place &&
                              player.place <= this.player1.place
                );

                updates['/players/' + this.player1['.key'] + '/place'] = this.player2.place;

                for (let i = 0, last = rangePlayers.length - 1; i < last; i++) {
                    updates['/players/' + rangePlayers[i]['.key'] + '/place'] = rangePlayers[i].place + 1;
                }
            }

            db.ref().update(updates);

            $('#newMatchModal').modal('hide');
        },
    },

    created: function () {
        eventbus.$on('player-selected', this.playerSelected);
    },

    beforeDestroy: function () {
        eventbus.$off('player-selected', this.playerSelected);
    },


    mounted () {
    $('#newMatchModal').on('hidden.bs.modal', () => {
        this.players = [];
        eventbus.$emit('clear-selections');
    })
  }
}
</script>
