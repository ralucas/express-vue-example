<template>
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
            <title>{{title}}</title>
            <script src="assets/scripts/vue.js" charset="utf-8"></script>
        </head>
        <body>
            <div class="content">
                <div class="content-inner">
                    {{{body}}}
                </div>
            </div>
            {{{script}}}
        </body>
    </html>
</template>

<script>
export default {
    el: 'head',
    data () {
        return {
            title: '$parent'.title
        }
    },
    computed: {},
    ready () {},
    attached () {},
    methods: {},
    components: {}
}
</script>

<style>
</style>
