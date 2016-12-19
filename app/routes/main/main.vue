<template>
    <div class="clicker-view">
        <h1>{{name}}</h1>
        <input type="text" v-model="name" placeholder="edit me">
        <h2>age: {{age}} <button @click="plus">+1</button></h2>
    </div>
</template>

<script>
export default {
    data() {
        return {
            age: 0,
        }
    },
    created() {
        console.log('created > ' + this.age);
        ++this.age;
    },
    methods: {
        plus() {
            this.age++;
        },
    },
};
</script>
