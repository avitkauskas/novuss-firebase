<template>
<!-- Modal -->
<div class="modal" id="newPlayerModal" tabindex="-1" role="dialog"
     aria-labelledby="NewPlayerFormTitle" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="NewPlayerFormTitle">New Player</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form @submit.prevent="addPlayer">
                <div class="modal-body">
                    <div class="form-group row">
                        <label for="playerName" class="col-sm-2 col-form-label">Name:</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="playerName"
                                v-model="name">
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary mr-auto" data-dismiss="modal">
                        Cancel
                    </button>
                    <button type="submit" class="btn btn-primary">
                        Register Player
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
</template>

<script>
import db from "../firebase"

export default {
    name: 'NewUserModal',

    props: [
        'totalPlayers'
    ],

    data () {
        return {
            name: ''
        }
    },

    methods: {
        addPlayer () {
            if (this.name.trim() !== '') {
                db.ref('players').push({
                    name: this.name,
                    place: this.totalPlayers + 1
                });
                this.name = '';
                $('#newPlayerModal').modal('hide');
            }

            $('#playerName').trigger('focus');
        },

        clearName () {
            this.name = '';
        }
    },

    mounted () {
        $('#newPlayerModal').on('shown.bs.modal', () =>
            $('#playerName').trigger('focus'));
        $('#newPlayerModal').on('hidden.bs.modal', () =>
            this.clearName());
    }
}
</script>
