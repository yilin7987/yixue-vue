<template>
    <div id="app">
<!--        <div id="demo" v-html="content">-->
<!--        </div>-->
<!--        <side-catalog class="catalog" v-bind="catalogProps">-->
<!--        </side-catalog>-->
    </div>
</template>

<script>
import "vue-side-catalog/lib/vue-side-catalog.css";
// import SideCatalog from "vue-side-catalog";
export default {
    components: {
        // SideCatalog,
    },
    mounted() {
        setTimeout(() => {
            this.content =
                "<h1>JavaScript</h1><h2>History</h2><h3>Creation at Netscape</h3>";
        }, 2000);
    },
    data() {
        return {
            content: "",
            catalogProps: {
                container: "#demo",
                watch: true,
            },
        };
    },
}
</script>

<style scoped>

</style>
