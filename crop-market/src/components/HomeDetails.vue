<template>
    <v-container>
        <v-row no-gutters>
            <v-col cols="4">
                <v-card to="/listings" class="pa-2" outlined tile>
                    <v-card-title primary-title class="justify-center">
                        <div class="display-1">
                            Listings
                        </div>
                    </v-card-title>
                    <v-img
                        src="https://images.unsplash.com/photo-1536546025187-bad5bfc86628?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1302&h=890&q=80"
                        height="243.27"
                        width="369"
                    ></v-img>
                </v-card>
            </v-col>
            <v-col cols="4">
                <v-card to="/farmers" class="pa-2" outlined tile>
                    <v-card-title primary-title class="justify-center">
                        <div class="display-1">
                            Farmers
                        </div>
                    </v-card-title>
                    <v-img
                        src="https://images.unsplash.com/photo-1569880153113-76e33fc52d5f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&h=890&q=80"
                        height="243.27"
                        width="369"
                    ></v-img>
                </v-card>
            </v-col>
            <v-col cols="4">
                <v-card to="/service-providers" class="pa-2" outlined tile>
                    <v-card-title primary-title class="justify-center">
                        <div class="display-1">
                            Service Providers
                        </div>
                    </v-card-title>
                    <v-img
                        src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&h=890&q=80"
                        height="243.27"
                        width="369"
                    ></v-img>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: 'HomeDetails'
};
</script>

<style scoped></style>
