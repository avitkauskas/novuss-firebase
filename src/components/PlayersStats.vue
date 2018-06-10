<template>
<div class="container">
    <div class="row justify-content-center">
        <div class="col col-auto">
            <h5 id="list-title">Best of the Best</h5>
            <table class="table table-borderless table-sm">
                <tbody>
                <tr>
                    <td class="text-right"><small>Most active player</small></td>
                    <td>{{mostActivePlayer.name}}</td>
                    <td class="text-left">
                        <small>
                            {{mostActivePlayer.total_matches}} matches played
                            with {{mostActivePlayer.total_success_rate | roundUp(0)}}%
                            ( {{mostActivePlayer.challenged_successfully
                            + mostActivePlayer.defended_successfully}}/{{mostActivePlayer.total_matches}} )
                            success
                        </small>
                    </td>
                </tr>
                <tr>
                    <td class="text-right"><small>Most active challenger</small></td>
                    <td>{{mostActiveChallenger.name}}</td>
                    <td class="text-left">
                        <small>
                            {{mostActiveChallenger.challenged}} matches challenged
                            with {{mostActiveChallenger.challenge_success_rate | roundUp(0)}}%
                            ( {{mostActiveChallenger.challenged_successfully}}/{{mostActiveChallenger.challenged}} )
                            success
                        </small>
                    </td>
                </tr>
                <tr>
                    <td class="text-right"><small>Most active defender</small></td>
                    <td>{{mostActiveDefender.name}}</td>
                    <td class="text-left">
                        <small>
                            {{mostActiveDefender.defended}} matches defended
                            with {{mostActiveDefender.defend_success_rate | roundUp(0)}}%
                            ( {{mostActiveDefender.defended_successfully}}/{{mostActiveDefender.defended}} )
                            success
                        </small>
                    </td>
                </tr>
                <tr>
                    <td class="text-right"><small>Most successful player</small></td>
                    <td>{{mostSuccessfulPlayer.name}}</td>
                    <td class="text-left">
                        <small>{{mostSuccessfulPlayer.total_success_rate | roundUp(0)}}%
                        ( {{mostSuccessfulPlayer.challenged_successfully
                            + mostSuccessfulPlayer.defended_successfully}}/{{mostSuccessfulPlayer.total_matches}} )
                        of total matches won</small>
                    </td>
                </tr>
                <tr>
                    <td class="text-right"><small>Most successful challenger</small></td>
                    <td>{{mostSuccessfulChallenger.name}}</td>
                    <td class="text-left">
                        <small>{{mostSuccessfulChallenger.challenge_success_rate | roundUp(0)}}%
                            (
                            {{mostSuccessfulChallenger.challenged_successfully}}/{{mostSuccessfulChallenger.challenged}}
                            ) of challenges successful</small>
                    </td>
                </tr>
                <tr>
                    <td class="text-right"><small>Most successful defender</small></td>
                    <td>{{mostSuccessfulDefender.name}}</td>
                    <td class="text-left">
                        <small>{{mostSuccessfulDefender.defend_success_rate | roundUp(0)}}%
                            (
                            {{mostSuccessfulDefender.defended_successfully}}/{{mostSuccessfulDefender.defended}}
                            ) of defences successful</small>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: 'PlayersStats',

    props: [
        'players'
    ],

    computed: {
        mostActivePlayer () {
            return this.bestOnProperty('total_matches');
        },

        mostActiveChallenger () {
            return this.bestOnProperty('challenged');
        },

        mostActiveDefender () {
            return this.bestOnProperty('defended');
        },

        mostSuccessfulPlayer () {
            return this.bestOnProperty('total_success_rate');
        },

        mostSuccessfulChallenger () {
            return this.bestOnProperty('challenge_success_rate');
        },

        mostSuccessfulDefender () {
            return this.bestOnProperty('defend_success_rate');
        },
    },

    methods: {
        bestOnProperty (property) {
            let max = {};
            for (let i = 0, len = this.players.length; i < len; i++) {
                if (this.players[i][property] > (max[property] || -1))
                    max = this.players[i];
            }
            return max;
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
    /*margin-top: 10px;*/
    font-weight: 100;
}

td {
    color: #555555;
    font-size: 0.95rem;
}
</style>