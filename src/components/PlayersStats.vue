<template>
<div class="container">
    <div class="row justify-content-center">
        <div class="col col-auto">
            <h5 id="list-title" class="pointer" @click="toggleStats">
                Best of the Best
                <i class="pointer fa" :class="[visibleStats ? 'fa-angle-up' : 'fa-angle-down']"></i>
            </h5>
            <table v-if="visibleStats" class="table table-borderless table-sm">
                <tbody>
                <tr class="pointer" @click="toggleBestRatedPlayers">
                    <td class="text-right">
                        <small>Best rated players</small>
                    </td>
                    <td>
                        <i class="fa" :class="[visibleBestRatedPlayers ? 'fa-angle-up' : 'fa-angle-down']"></i>
                    </td>
                    <td v-if="bestRatedPlayer.total_matches >= required">
                        {{bestRatedPlayer.name}}
                    </td>
                    <td v-if="bestRatedPlayer.total_matches < required">
                        - no one -
                    </td>
                    <td class="text-left" v-if="bestRatedPlayer.total_matches >= required">
                        <small>
                            {{bestRatedPlayer.rating}} rating points
                            ( {{bestRatedPlayer.total_matches}} matches )
                        </small>
                    </td>
                    <td class="text-left" v-if="bestRatedPlayer.total_matches < required">
                        <small>
                            at least {{required}} matches required
                        </small>
                    </td>
                </tr>
                <tr class="pointer" @click="toggleBestRatedPlayers"
                    v-if="visibleBestRatedPlayers && player.total_matches >= required"
                    v-for="(player, index) in otherRatedPlayers"
                >
                    <td></td>
                    <td class="dimmed">
                        <small>{{index + 2}}</small>
                    </td>
                    <td>
                        {{player.name}}
                    </td>
                    <td class="text-left">
                        <small>
                            {{player.rating}} ( {{player.total_matches}} matches )
                        </small>
                    </td>
                </tr>
                <tr class="pointer" @click="toggleMostSuccessfulPlayers">
                    <td class="text-right">
                        <small>Most successful players</small>
                    </td>
                    <td>
                        <i class="fa" :class="[visibleMostSuccessfulPlayers ? 'fa-angle-up' : 'fa-angle-down']"></i>
                    </td>
                    <td v-if="mostSuccessfulPlayer.total_matches >= required">
                        {{mostSuccessfulPlayer.name}}
                    </td>
                    <td v-if="mostSuccessfulPlayer.total_matches < required">
                        - no one -
                    </td>
                    <td class="text-left" v-if="mostSuccessfulPlayer.total_matches >= required">
                        <small>
                            {{mostSuccessfulPlayer.total_success_rate | roundUp(0)}}%
                            ( {{mostSuccessfulPlayer.total_successfully}}/{{mostSuccessfulPlayer.total_matches}} )
                            matches won
                        </small>
                    </td>
                    <td class="text-left" v-if="mostSuccessfulPlayer.total_matches < required">
                        <small>
                            at least {{required}} matches required
                        </small>
                    </td>
                </tr>
                <tr class="pointer" @click="toggleMostSuccessfulPlayers"
                    v-if="visibleMostSuccessfulPlayers && player.total_matches >= required"
                    v-for="(player, index) in otherSuccessfulPlayers"
                >
                    <td></td>
                    <td class="dimmed">
                        <small>{{index + 2}}</small>
                    </td>
                    <td>
                        {{player.name}}
                    </td>
                    <td class="text-left">
                        <small>
                            {{player.total_success_rate | roundUp(0)}}%
                            ( {{player.total_successfully}}/{{player.total_matches}} )
                        </small>
                    </td>
                </tr>
                <tr class="pointer" @click="toggleMostSuccessfulChallengers">
                    <td class="text-right">
                        <small>Most successful challengers</small>
                    </td>
                    <td class="pointer" @click="toggleMostSuccessfulChallengers">
                        <i class="fa" :class="[visibleMostSuccessfulChallengers ? 'fa-angle-up' : 'fa-angle-down']"></i>
                    </td>
                    <td v-if="mostSuccessfulChallenger.challenged >= required">
                        {{mostSuccessfulChallenger.name}}
                    </td>
                    <td v-if="mostSuccessfulChallenger.challenged < required">
                        - no one -
                    </td>
                    <td class="text-left" v-if="mostSuccessfulChallenger.challenged >= required">
                        <small>
                            {{mostSuccessfulChallenger.challenge_success_rate | roundUp(0)}}%
                            (
                            {{mostSuccessfulChallenger.challenged_successfully}}/{{mostSuccessfulChallenger.challenged}}
                            ) challenges successful
                        </small>
                    </td>
                    <td class="text-left" v-if="mostSuccessfulChallenger.challenged < required">
                        <small>
                            at least {{required}} challenges required
                        </small>
                    </td>
                </tr>
                <tr class="pointer" @click="toggleMostSuccessfulChallengers"
                    v-if="visibleMostSuccessfulChallengers && player.challenged >= required"
                    v-for="(player, index) in otherSuccessfulChallengers"
                >
                    <td></td>
                    <td class="dimmed">
                        <small>{{index + 2}}</small>
                    </td>
                    <td>
                        {{player.name}}
                    </td>
                    <td class="text-left">
                        <small>
                            {{player.challenge_success_rate | roundUp(0)}}%
                            ( {{player.challenged_successfully}}/{{player.challenged}} )
                        </small>
                    </td>
                </tr>
                <tr class="pointer" @click="toggleMostSuccessfulDefenders">
                    <td class="text-right">
                        <small>Most successful defenders</small>
                    </td>
                    <td class="pointer" @click="toggleMostSuccessfulDefenders">
                        <i class="fa" :class="[visibleMostSuccessfulDefenders ? 'fa-angle-up' : 'fa-angle-down']"></i>
                    </td>
                    <td v-if="mostSuccessfulDefender.defended >= required">
                        {{mostSuccessfulDefender.name}}
                    </td>
                    <td v-if="mostSuccessfulDefender.defended < required">
                        - no one -
                    </td>
                    <td class="text-left" v-if="mostSuccessfulDefender.defended >= required">
                        <small>
                            {{mostSuccessfulDefender.defend_success_rate | roundUp(0)}}%
                            (
                            {{mostSuccessfulDefender.defended_successfully}}/{{mostSuccessfulDefender.defended}}
                            ) defences successful
                        </small>
                    </td>
                    <td class="text-left" v-if="mostSuccessfulDefender.defended < required">
                        <small>
                            at least {{required}} defences required
                        </small>
                    </td>
                </tr>
                <tr class="pointer" @click="toggleMostSuccessfulDefenders"
                    v-if="visibleMostSuccessfulDefenders && player.defended >= required"
                    v-for="(player, index) in otherSuccessfulDefenders"
                >
                    <td></td>
                    <td class="dimmed">
                        <small>{{index + 2}}</small>
                    </td>
                    <td>
                        {{player.name}}
                    </td>
                    <td class="text-left">
                        <small>{{player.defend_success_rate | roundUp(0)}}%
                            ( {{player.defended_successfully}}/{{player.defended}} )
                        </small>
                    </td>
                </tr>
                <tr class="pointer" @click="toggleMostActivePlayers">
                    <td class="text-right">
                        <small>Most active players</small>
                    </td>
                    <td>
                        <i class="fa" :class="[visibleMostActivePlayers ? 'fa-angle-up' : 'fa-angle-down']"></i>
                    </td>
                    <td>
                        {{mostActivePlayer.name}}
                    </td>
                    <td class="text-left">
                        <small>
                            {{mostActivePlayer.total_matches}} matches played
                        </small>
                    </td>
                </tr>
                <tr class="pointer" @click="toggleMostActivePlayers"
                    v-if="visibleMostActivePlayers"
                    v-for="(player, index) in otherActivePlayers"
                >
                    <td></td>
                    <td class="dimmed">
                        <small>{{index + 2}}</small>
                    </td>
                    <td>
                        {{player.name}}
                    </td>
                    <td class="text-left">
                        <small>
                            {{player.total_matches}} matches
                        </small>
                    </td>
                </tr>
                <tr class="pointer" @click="toggleMostActiveChallengers">
                    <td class="text-right">
                        <small>Most active challengers</small>
                    </td>
                    <td>
                        <i class="fa" :class="[visibleMostActiveChallenges ? 'fa-angle-up' : 'fa-angle-down']"></i>
                    </td>
                    <td>
                        {{mostActiveChallenger.name}}
                    </td>
                    <td class="text-left">
                        <small>
                            {{mostActiveChallenger.challenged}} matches challenged
                        </small>
                    </td>
                </tr>
                <tr class="pointer" @click="toggleMostActiveChallengers"
                    v-if="visibleMostActiveChallenges"
                    v-for="(player, index) in otherActiveChallengers"
                >
                    <td></td>
                    <td class="dimmed">
                        <small>{{index + 2}}</small>
                    </td>
                    <td>
                        {{player.name}}
                    </td>
                    <td class="text-left">
                        <small>
                            {{player.challenged}} challenges
                        </small>
                    </td>
                </tr>
                <tr class="pointer" @click="toggleMostActiveDefenders">
                    <td class="text-right">
                        <small>Most active defenders</small>
                    </td>
                    <td>
                        <i class="fa" :class="[visibleMostActiveDefenders ? 'fa-angle-up' : 'fa-angle-down']"></i>
                    </td>
                    <td>
                        {{mostActiveDefender.name}}
                    </td>
                    <td class="text-left">
                        <small>
                            {{mostActiveDefender.defended}} matches defended
                        </small>
                    </td>
                </tr>
                <tr class="pointer" @click="toggleMostActiveDefenders"
                    v-if="visibleMostActiveDefenders"
                    v-for="(player, index) in otherActiveDefenders"
                >
                    <td></td>
                    <td class="dimmed">
                        <small>{{index + 2}}</small>
                    </td>
                    <td>
                        {{player.name}}
                    </td>
                    <td class="text-left">
                        <small>
                            {{player.defended}} defences
                        </small>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
</template>

<script>
const REQUIRED = 5;

export default {
    name: 'PlayersStats',

    props: [
        'players'
    ],

    data () {
      return {
          visibleBestRatedPlayers: false,
          visibleMostSuccessfulPlayers: false,
          visibleMostSuccessfulChallengers: false,
          visibleMostSuccessfulDefenders: false,
          visibleMostActivePlayers: false,
          visibleMostActiveChallenges: false,
          visibleMostActiveDefenders: false,
          visibleStats: false
      }
    },

    computed: {
        required () {
            return REQUIRED;
        },

        bestRatedPlayer () {
            return this.playersSortedBy('rating', 'total_matches', REQUIRED)[0];
        },

        mostSuccessfulPlayer () {
            return this.playersSortedBy('total_success_rate', 'total_matches', REQUIRED)[0];
        },

        mostSuccessfulChallenger () {
            return this.playersSortedBy('challenge_success_rate', 'challenged', REQUIRED, 'challenged')[0];
        },

        mostSuccessfulDefender () {
            return this.playersSortedBy('defend_success_rate', 'defended', REQUIRED, 'defended')[0];
        },

        mostActivePlayer () {
            return this.playersSortedBy('total_matches', 'total_success_rate')[0];
        },

        mostActiveChallenger () {
            return this.playersSortedBy('challenged', 'challenge_success_rate')[0];
        },

        mostActiveDefender () {
            return this.playersSortedBy('defended', 'defend_success_rate')[0];
        },

        otherRatedPlayers () {
            return this.playersSortedBy('rating', 'total_matches', REQUIRED).slice(1);
        },

        otherSuccessfulPlayers () {
            return this.playersSortedBy('total_success_rate', 'total_matches', REQUIRED).slice(1);
        },

        otherSuccessfulChallengers () {
            return this.playersSortedBy('challenge_success_rate', 'challenged', REQUIRED, 'challenged').slice(1);
        },

        otherSuccessfulDefenders () {
            return this.playersSortedBy('defend_success_rate', 'defended', REQUIRED, 'defended').slice(1);
        },

        otherActivePlayers () {
            return this.playersSortedBy('total_matches', 'total_success_rate').slice(1);
        },

        otherActiveChallengers () {
            return this.playersSortedBy('challenged', 'challenge_success_rate').slice(1);
        },

        otherActiveDefenders () {
            return this.playersSortedBy('defended', 'defend_success_rate').slice(1);
        }
    },

    methods: {
        playersSortedBy (prop1, prop2, required = 0, propRequired = 'total_matches') {
            let arr = this.players.slice();
            arr.sort((a, b) => {
                if (a[propRequired] < required && b[propRequired] >= required ||
                    b[propRequired] < required && a[propRequired] >= required) {
                    return b[propRequired] - a[propRequired]
                } else {
                    if (a[prop1] === b[prop1]) {
                        return b[prop2] - a[prop2];
                    } else {
                        return b[prop1] - a[prop1];
                    }
                }
            });
            return arr;
        },

        toggleBestRatedPlayers () {
            this.visibleBestRatedPlayers = !this.visibleBestRatedPlayers;
        },

        toggleMostActivePlayers () {
            this.visibleMostActivePlayers = !this.visibleMostActivePlayers;
        },

        toggleMostActiveChallengers () {
            this.visibleMostActiveChallenges = !this.visibleMostActiveChallenges;
        },

        toggleMostActiveDefenders () {
            this.visibleMostActiveDefenders = !this.visibleMostActiveDefenders;
        },

        toggleMostSuccessfulPlayers () {
            this.visibleMostSuccessfulPlayers = !this.visibleMostSuccessfulPlayers;
        },

        toggleMostSuccessfulChallengers () {
            this.visibleMostSuccessfulChallengers = !this.visibleMostSuccessfulChallengers;
        },

        toggleMostSuccessfulDefenders () {
            this.visibleMostSuccessfulDefenders = !this.visibleMostSuccessfulDefenders;
        },

        toggleStats () {
            this.visibleStats = !this.visibleStats;
        }
    },

    filters: {
        roundUp (value, places) {
            return value.toFixed(places);
        }
    }
}
</script>

<style scoped>
#list-title {
    font-weight: 100;
}

td {
    color: #555555;
    font-size: 0.95rem;
}
i {
    color: #999999;
}
h5>i {
    font-size: 1rem;
}
.dimmed {
    color: #999999;
}
</style>