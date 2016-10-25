<template>
    <footer>
        A custom footer!
        <span v-for="n in cats">😻</span>
    </footer>
</template>

<script>
export default {
    data: function () {
        return {
            cats: 3
        }
    }
}
</script>

<style lang="css">
</style>
