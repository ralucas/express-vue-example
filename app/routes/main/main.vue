<template>
    <div>
        <myheader></myheader>
        <h1>{{name}}</h1>
        <input type="text" v-model="name" placeholder="edit me">
        <h2>age: {{age}} <button @click="plus">+1</button></h2>
        <span v-for="n in age">🎂</span>
        <myfooter></myfooter>
    </div>
</template>

<script>
var moment = require('moment');
export default {
    data: function() {
        return {
            name: 'george',
            age: 10,
            time: moment().toISOString()
        }
    },
    created: function() {
        console.log('created > ' + this.age);
    },
    methods: {
        plus: function() {
            this.age++;
        },
    }
};
</script>
