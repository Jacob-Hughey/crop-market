<template>
    <v-container fluid fill-height class="hello">
        <v-layout column>
            <v-row style="height: 0px">
                <v-col cols="4" style="height: 0px"></v-col>
                <v-col cols="4" style="height: 0px">
                    <v-text-field 
                        single-line 
                        solo 
                        dense 
                        label="Location" 
                        v-model="location"
                        append-icon="mdi-magnify"
                        @click:append="Search"></v-text-field>
                </v-col>
                <v-col cols="4" style="height: 0px"></v-col>
            </v-row>
            <v-row>
                <v-col cols="4" v-for="farmer in farmers" :key="farmer.name">
                    <v-card>
                        <v-card-title>
                             <span class="headline">{{ farmer.name }}</span>
                        </v-card-title>
                        <v-card-text>
                            <h3>Location: {{ farmer.location }}</h3>
                            <h3>Rating: {{ farmer.rating }}</h3>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn @click="ViewFarmer(farmer.farmer_id)">
                                View Farmer
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-layout>
    </v-container>
</template>

<script>
import axios from 'axios';

export default {
    name: 'Farmers',
    data () {
        return {
            farmers: null,
            location: undefined
        }
    },
    methods: {
        async ViewFarmer(userId) {
            this.$store.dispatch('ViewUser', {
                userId: userId,
                type: 'Farmer'
            });
        },
        async Search() {
            let farmersList;
            if (this.location == '') {
                this.location = undefined;
            }
            await axios
                .get('http://localhost:3000/api/farmers', 
                    {
                        params: {
                            location: this.location
                        }
                    }
                )
                .then((response) => {
                    farmersList = response.data.response;
                })
                .catch(() => {
                    return null;
                });
            this.farmers = farmersList;
        }
    },
    async created () {
        let farmersList;
        await axios
            .get('http://localhost:3000/api/farmers', 
                {
                    params: {
                        location: this.location
                    }
                }
            )
            .then((response) => {
                farmersList = response.data.response;
            })
            .catch(() => {
                return null;
            });
        this.farmers = farmersList;
    }
}
</script>
<style>
.hello {
    background: url('https://drive.google.com/uc?id=16_Tl881mxHEWJimCNtkGUPQiJtEUXHvg');
    background-size: cover;
    color: blue;
    position: relative;
}
</style>