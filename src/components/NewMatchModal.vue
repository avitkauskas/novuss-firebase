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
                player1: this.player1.name,
                player2: this.player2.name,
                place1: this.player1.place,
                place2: this.player2.place,
                outcome: outcome
            });

            if (outcome === 1) {
                const rangePlayers = this.allPlayers.filter(
                    player => player.place >= this.player2.place &&
                        player.place <= this.player1.place
                );

                let updates = {};

                updates['/players/' + this.player1['.key']] =
                    {
                        name: this.player1.name,
                        place: this.player2.place
                    };

                for (let i = 0, last = rangePlayers.length - 1; i < last; i++) {
                    updates['/players/' + rangePlayers[i]['.key']] =
                        {
                            name: rangePlayers[i].name,
                            place: rangePlayers[i].place + 1
                        }
                }

                db.ref().update(updates);
            }

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
