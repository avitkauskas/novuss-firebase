<template>
<div class="row justify-content-center flex-nowrap">
    <player-card v-for="player in players"
                 :player="player"
                 :total-players="totalPlayers"
                 :key="player.place"
    />
    <player-card v-for="slot in emptySlots"
                 :player="slot"
                 :total-players="totalPlayers"
                 :key="slot.place"
    />
</div>
</template>

<script>
import PlayerCard from './PlayerCard'

export default {
    name: 'PyramidRow',

    props: [
        'players',
        'emptySlots',
        'totalPlayers'
    ],

    components: {
        PlayerCard
    }
}
</script>
