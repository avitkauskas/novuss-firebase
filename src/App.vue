<template>
<div id="app">
    <h1>--- Novuss ---</h1>
    <new-user-modal :total-players="players.length"/>
    <new-match-modal/>
    <pyramid :players="players"/>
    <matches-list v-if="matches.length > 0" :matches="matches" :players="players"/>
    <players-stats v-if="matches.length > 0" :players="players"/>
</div>
</template>

<script>
import db from "./firebase"

import Pyramid from './components/Pyramid'
import NewUserModal from './components/NewUserModal'
import NewMatchModal from './components/NewMatchModal'
import MatchesList from "./components/MatchesList"
import PlayersStats from "./components/PlayersStats.vue"

export default {
    name: 'App',

    firebase: {
        players: db.ref('players').orderByChild('place'),
        matches: db.ref('matches').orderByChild('timestamp').limitToFirst(10)
    },

    components: {
        Pyramid,
        NewUserModal,
        NewMatchModal,
        MatchesList,
        PlayersStats
    }
}
</script>

<style>
#app {
    font-family: "Raleway", sans-serif;
    font-weight: 400;
    /*-webkit-font-smoothing: antialiased;*/
    /*-moz-osx-font-smoothing: grayscale;*/
    text-align: center;
    margin-top: 10px;
}

h1 {
    font-size: 40px;
    font-weight: 100;
    margin-bottom: 20px;
}

.pointer {
    cursor: pointer;
}
</style>
