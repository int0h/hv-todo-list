import {HyperValue} from 'hyper-value';
import {jsx, Component} from 'hv-jsx';

import {FilterTypes} from '../common';

interface FooterProps {
    activeTodoCount: HyperValue<number>;
    selectedFilter: HyperValue<FilterTypes>;
    completedTodos: HyperValue<boolean>;
    onClearComplited: () => void;
}

export class Footer extends Component<FooterProps> {
    todosWord = this.hs.auto(() => this.props.activeTodoCount.$ === 1 ? 'todo' : 'todos');

    getClass = (type: FilterTypes) => {
        return this.hs.auto(() => this.props.selectedFilter.$ === type ? 'selected' : '')
    }

    getOnClick = (type: FilterTypes) => {
        return (e: Event) => {
            e.preventDefault();
            this.props.selectedFilter.$ = type;
        };
    }

    render() {
        return [
            <span id="todo-count"><strong>{this.props.activeTodoCount}</strong> {this.todosWord} left</span>
            ,
            <ul id="filters">
                <li>
                    <a class={this.getClass('all')} onClick={this.getOnClick('all')}>
                        All
                    </a>
                </li>
                <li>
                    <a class={this.getClass('active')} onClick={this.getOnClick('active')}>
                        Active
                    </a>
                </li>
                <li>
                    <a class={this.getClass('complited')} onClick={this.getOnClick('complited')}>
                        Complited
                    </a>
                </li>
            </ul>
            ,
            this.hs.auto(() => {
                return this.props.completedTodos.$ &&
                    <button id="clear-completed" onClick={() => this.props.onClearComplited()}>Clear completed</button>;
            })
        ];
    }
}
