import {jsx, Component} from 'hv-jsx';
import {renderIn} from 'hv-dom';
import {Router, route} from 'hv-router';

import {App} from './components/main';

const router = new Router({
    hashPrefix: true,
    noRouteRedirect: {
        routeName: 'main',
        data: {filter: 'all'}
    }
}, {
    main: route([{$: 'filter'}], {
        component: App,
        params: {
            filter: {}
        }
    })
});

router.init();

class Wrapper extends Component<{}> {
    render() {
        return <div>
            {router.content}
        </div>;
    }
}

renderIn(document.body, {}, <Wrapper />);
