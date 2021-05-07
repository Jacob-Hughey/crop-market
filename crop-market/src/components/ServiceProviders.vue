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
                <v-col cols="4" v-for=" provider in providers" :key="provider.name">
                    <v-card>
                        <v-card-title>
                             <span class="headline">{{ provider.name }}</span>
                        </v-card-title>
                        <v-card-text>
                            <h3>Location: {{ provider.location }}</h3>
                            <h3>Rating: {{ provider.rating }}</h3>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn @click="ViewProvider(provider.provider_id)">
                                View Service Provider
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
    name: 'Providers',
    data () {
        return {
            providers: null,
            location: undefined
        }
    },
    methods: {
        async ViewProvider(userId) {
            this.$store.dispatch('ViewUser', {
                userId: userId,
                type: 'Service Provider'
            });
        },
        async Search() {
            let providersList;
            if (this.location == '') {
                this.location = undefined;
            }
            await axios
                .get('http://localhost:3000/api/service-providers',
                    {
                        params: {
                            location: this.location
                        }
                    }
                )
                .then((response) => {
                    providersList = response.data.response;
                })
                .catch(() => {
                    return null;
                });
            this.providers = providersList;
        }
    },
    async created () {
        let providersList;
        await axios
            .get('http://localhost:3000/api/service-providers',
                {
                    params: {
                        location: this.location
                    }
                }
            )
            .then((response) => {
                providersList = response.data.response;
            })
            .catch(() => {
                return null;
            });
        this.providers = providersList;
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