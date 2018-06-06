<template>
<div class="col-auto mb-1 pl-1 pr-0" @click="playerClicked">
    <div class="input-group pointer">
        <div class="input-group-prepend">
            <span class="input-group-text bg-light"
                  :class="{selected: selected}"
                  id="inputGroupPrepend">
                {{player.place}}
            </span>
        </div>
        <input type="text"
               class="form-control bg-white pl-0 pr-0 text-center pointer"
               :class="{selected: selected}"
               aria-describedby="inputGroupPrepend"
               disabled
               :placeholder="player.name"
               :size="player.name.length + 2">
    </div>
</div>
</template>

<script>
import eventbus from '../eventbus'

export default {
    name: 'PlayerCard',

    props: [
        'player',
        'totalPlayers'
    ],

    data () {
        return {
            selected: false
        }
    },

    created: function () {
        eventbus.$on('clear-selections', this.clearSelections);
    },

    beforeDestroy: function () {
        eventbus.$off('clear-selections', this.clearSelections);
    },

    methods: {
        playerClicked: function () {
            if (this.player.place > this.totalPlayers) {
                $('#newPlayerModal').modal('show');
            } else {
                this.selected = !this.selected;
                const eventData = this.selected ? this.player : null;
                eventbus.$emit('player-selected', eventData);
            }
        },

        clearSelections: function () {
          this.selected = false;
        }
    }
}
</script>

<style scoped>
input::placeholder {
    color: #555555;
    font-size: 0.95rem;
}

.selected {
    border-color: red;
}

/*.pointer {*/
    /*cursor: pointer;*/
/*}*/
</style>
