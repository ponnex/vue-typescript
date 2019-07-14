<template>
<div>
    <h1>This is homepage</h1>
</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import * as moment from 'moment';
import './home.component.scss';

@Component({
    
})
export default class HomeComponent extends Vue {
    mounted() {
        console.log(moment().toDate());
    }
}
</script>

<style lang="scss">

</style>