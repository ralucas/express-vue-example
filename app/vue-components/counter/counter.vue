<template>
    <div class="counter-view">You have been here for {{ counter }} seconds.</div>
</template>

<script>
    export default {
        data: () => {
            return {
                counter: 0
            }
        },
        created() {
            var vm = this
            setInterval(function () {
              vm.counter += 1
            }, 1000)
        }
    }
</script>
