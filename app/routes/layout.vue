<template>
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
            <title>{{{title}}}</title>
            <script src="assets/scripts/vue.js" charset="utf-8"></script>
        </head>
        <body>
            {{{app}}}
            {{{script}}}
            <script>app.$mount('#app')</script>
        </body>
    </html>
</template>

<script>
</script>

<style>
</style>
