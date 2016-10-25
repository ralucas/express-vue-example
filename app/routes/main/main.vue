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
export default {
    data: function() {
        return {
            name: '$parent'.name,
            age: 10,
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
