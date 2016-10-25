<template>
    <div>
        A custom component!
        <span v-for="n in dogs">🐶</span>
    </div>
</template>

<script>
export default {
    data: function () {
        return {
            dogs: 3
        }
    }
}
</script>

<style lang="css">
</style>
