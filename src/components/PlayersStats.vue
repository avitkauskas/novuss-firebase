<template>
    <div class="row justify-content-center">
        <div class="col col-auto">
            <h5 id="list-title" class="pointer" @click="toggleStats">
                Player Statistics
                <i class="pointer fa" :class="[visibleStats ? 'fa-angle-up' : 'fa-angle-down']"></i>
            </h5>
            <table v-if="visibleStats" class="table table-borderless table-sm table-responsive">
                <thead>
                <tr>
                    <th scope="col">
                        #
                    </th>
                    <th scope="col">
                        Player
                    </th>
                    <th scope="col" class="pointer" @click="sortByRating"
                        :class="{selected : sortIndex === 0}">
                        Rating
                    </th>
                    <th scope="col" class="pointer" @click="sortByMatchesSuccess"
                        :class="{selected : sortIndex === 1}">
                        Matches
                    </th>
                    <th scope="col" class="pointer" @click="sortByChallengeSuccess"
                        :class="{selected : sortIndex === 2}">
                        Challenges
                    </th>
                    <th scope="col" class="pointer" @click="sortByDefenceSuccess"
                        :class="{selected : sortIndex === 3}">
                        Defences
                    </th>
                    <th scope="col" class="pointer" @click="sortByMatches"
                        :class="{selected : sortIndex === 4}">
                        M
                    </th>
                    <th scope="col" class="pointer" @click="sortByChallenges"
                        :class="{selected : sortIndex === 5}">
                        C
                    </th>
                    <th scope="col" class="pointer" @click="sortByDefences"
                        :class="{selected : sortIndex === 6}">
                        D
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(player, index) in sortedPlayers">
                    <td><small>{{index + 1}}</small></td>
                    <td>{{player.name}}</td>
                    <td :class="{selected : sortIndex === 0}"><small>{{rating(player)}}</small></td>
                    <td :class="{selected : sortIndex === 1}">
                        <small>{{matchesSuccess(player)}}</small>
                    </td>
                    <td :class="{selected : sortIndex === 2}">
                        <small>{{challengesSuccess(player)}}</small>
                    </td>
                    <td :class="{selected : sortIndex === 3}">
                        <small>{{defencesSuccess(player)}}</small>
                    </td>
                    <td :class="{selected : sortIndex === 4}">
                        <small>{{player.total_matches}}</small>
                    </td>
                    <td :class="{selected : sortIndex === 5}">
                        <small>{{player.challenged}}</small>
                    </td>
                    <td :class="{selected : sortIndex === 6}">
                        <small>{{player.defended}}</small>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    const VOID = '---';
    const REQUIRED = 5;
    const sortFields = [
        ['rating', 'total_matches', REQUIRED, 'total_matches'],
        ['total_success_rate', 'total_matches', REQUIRED, 'total_matches'],
        ['challenge_success_rate', 'challenged', REQUIRED, 'challenged'],
        ['defend_success_rate', 'defended', REQUIRED, 'defended'],
        ['total_matches', 'total_success_rate', 0, 'total_matches'],
        ['challenged', 'challenge_success_rate', 0, 'challenged'],
        ['defended', 'defend_success_rate', 0, 'defended'],
    ];

    export default {
        name: 'PlayersStats',

        props: [
            'players'
        ],

        data () {
          return {
              visibleStats: false,
              sortIndex: 0
          }
        },

        computed: {
            sortedPlayers () {
                return this.playersSortedBy(this.sortIndex);
            }
        },

        methods: {
            playersSortedBy (index) {

                let [prop1, prop2, required, propRequired] = sortFields[index];
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

            sortByRating () {
                this.sortIndex = 0;
            },

            sortByMatchesSuccess () {
                this.sortIndex = 1;
            },

            sortByChallengeSuccess () {
                this.sortIndex = 2;
            },

            sortByDefenceSuccess () {
                this.sortIndex = 3;
            },

            sortByMatches () {
                this.sortIndex = 4;
            },

            sortByChallenges () {
                this.sortIndex = 5;
            },

            sortByDefences () {
                this.sortIndex = 6;
            },

            toggleStats () {
                this.visibleStats = !this.visibleStats;
            },

            rating (player) {
                if (player.total_matches < REQUIRED) {
                    return VOID;
                } else {
                    return player.rating;
                }
            },

            matchesSuccess (player) {
                if (player.total_matches < REQUIRED) {
                    return VOID;
                } else {
                    return player.total_success_rate.toFixed(0) + '%' +
                        ' ( ' + player.total_successfully + '/' + player.total_matches + ' )';
                }
            },

            challengesSuccess (player) {
                if (player.challenged < REQUIRED) {
                    return VOID;
                } else {
                    return player.challenge_success_rate.toFixed(0) + '%' +
                        ' ( ' + player.challenged_successfully + '/' + player.challenged + ' )';
                }
            },

            defencesSuccess (player) {
                if (player.defended < REQUIRED) {
                    return VOID;
                } else {
                    return player.defend_success_rate.toFixed(0) + '%' +
                        ' ( ' + player.defended_successfully + '/' + player.defended + ' )';
                }
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

    th {
        color: #999999;
        font-size: 0.95rem;
        font-weight: normal;
    }

    th.selected {
        color: #666666;
        font-weight: normal;
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

    .selected {
        color: black;
    }
</style>