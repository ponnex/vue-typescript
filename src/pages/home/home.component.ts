import { Vue, Component } from 'vue-property-decorator';
import * as moment from 'moment';
import './home.component.scss';

@Component({
    template: require('./home.component.html')
})
export default class HomeComponent extends Vue {
    mounted() {
        console.log(moment().toDate());
    }
}