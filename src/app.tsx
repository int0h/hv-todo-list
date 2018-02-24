import {HyperValue} from 'hv';
import {jsx, Component, HvNode} from 'hv-jsx';
import {renderIn} from 'hv-dom';
import {Router, route, RouteComponentProps} from 'hv-router';

const keyCodes = {
    enter: 13,
    escape: 27
};

interface TodoItem {
    text: HyperValue<string>;
    completed: HyperValue<boolean>;
    editing: HyperValue<boolean>;
}

interface PlainTodoItem {
    text: string;
    completed: boolean;
}

type FilterTypes = 'all' | 'active' | 'complited';

class App extends Component<RouteComponentProps> {
    items: HyperValue<Array<TodoItem>> = new HyperValue([]);
    newTodo = new HyperValue(this.createTodo());
    display = this.hs.auto(() => this.items.$.length > 0 ? 'block' : 'none');
    selectedFilter = this.hs.prop(this.props.routeData, 'filter') as HyperValue<FilterTypes>;
    showedItems = this.hs.filter(this.items, item => {
        switch (this.selectedFilter.$) {
            case 'all': return true;
            case 'active': return !item.completed.$;
            case 'complited': return item.completed.$;
        }
    });

    init() {
        this.loadData();
        this.hs.auto(() => this.saveData());
    }

    saveData() {
        const plain: PlainTodoItem[] = this.items.$.map(item => ({
            text: item.text.$,
            completed: item.completed.$
        }));

        localStorage.setItem('todos', JSON.stringify(plain));
    }

    loadData() {
        const stored = localStorage.getItem('todos');

        if (!stored) {
            return;
        }

        const plain = JSON.parse(stored) as PlainTodoItem[];
        this.items.$ = plain.map(item => ({
            text: new HyperValue(item.text),
            completed: new HyperValue(item.completed),
            editing: new HyperValue(false)
        }));
    }

    createTodo(): TodoItem {
        return {
            text: new HyperValue(''),
            completed: new HyperValue(false),
            editing: new HyperValue(false)
        };
    }

    pushTodo() {
        this.hs.insert(this.items, Infinity, this.newTodo.$);
        this.newTodo.$ = this.createTodo();
    }

    removeTodo(id: number) {
        this.hs.remove(this.items, id, 1);
    }

    handleKeyUp = (e: KeyboardEvent) => {
        const input = e.target as HTMLInputElement;
        const text = input.value.trim();

        this.newTodo.$.text.$ = text;

        if (e.which !== keyCodes.enter || !text) {
            return;
        }

        this.pushTodo();
    }

    checkAll = (e: Event) => {
        const cb = e.target as HTMLInputElement;
        this.items.$.forEach(item => item.completed.$ = cb.checked);
    }

    removeAllComplited = () => {
        this.items.$ = this.items.$.filter(item => !item.completed.$);
    }

    render() {
        return [
            <section id="todoapp">
                <header id="header">
                    <h1>todos</h1>
                    <input
                        id="new-todo"
                        placeholder="What needs to be done?"
                        autoFocus
                        value={this.hs.auto(() => this.newTodo.$.text.$)}
                        onKeyUp={this.handleKeyUp}
                    />
                </header>
                <section id="main" style={{display: this.display}}>
                    <input id="toggle-all" type="checkbox" onChange={this.checkAll}/>
                    <label for="toggle-all">Mark all as complete</label>
                    <ul id="todo-list">
                        {
                            this.hs.map(this.showedItems, (item, index) => {
                                return <TodoItemView
                                    completed={item.completed}
                                    title={item.text}
                                    onRemove={() => this.removeTodo(index)}
                                />;
                            })
                        }
                    </ul>
                </section>
                <footer id="footer" style={{display: this.display}}>
                    <Footer
                        selectedFilter={this.selectedFilter}
                        activeTodoCount={this.hs.length(this.hs.filter(this.items, item => !item.completed.$))}
                        completedTodos={this.hs.some(this.items, item => item.completed.$)}
                        onClearComplited={this.removeAllComplited}
                    />
                </footer>
            </section>
            ,
            <footer id="info">
                <p>Double-click to edit a todo</p>
                <p>Created by <a href="https://github.com/int0h">int0h</a></p>
                <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
            </footer>
        ];
    }
}

interface TodoItemProps {
    completed: HyperValue<boolean>;
    title: HyperValue<string>;
    onRemove: () => void;
}

class TodoItemView extends Component<TodoItemProps> {
    editing = new HyperValue(false);
    editText = new HyperValue(this.props.title.$);
    editElem: HvNode;

    className = this.hs.auto(() => {
        const classes = [];

        if (this.props.completed.$) {
            classes.push('complited');
        }

        if (this.editing.$) {
            classes.push('editing');
        }

        return classes.join(' ');
    });

    toggle = () => {
        this.props.completed.$ = !this.props.completed.$;
    }

    save = () => {
        this.props.title.$ = this.editText.$;
        this.toggleEditMode();
    }

    toggleEditMode = () => {
        this.editing.$ = !this.editing.$;
        this.editText.$ = this.props.title.$;
        this.editElem.targetNodes[0].focus();
    }

    handleKey = (e: KeyboardEvent) => {
        this.editText.$ = this.editElem.targetNodes[0].value;

        switch (e.which) {
            case keyCodes.escape:
                this.editText.$ = this.props.title.$;
            case keyCodes.enter:
                this.editElem.targetNodes[0].blur();
                break;
        }
    }

    render() {
        return <li class={this.className}>
            <div class="view">
                <input class="toggle" type="checkbox" checked={this.hs.auto(() => this.props.completed.$)} onChange={this.toggle}/>
                <label onDblClick={this.toggleEditMode}>{this.props.title}</label>
                <button class="destroy" onClick={() => this.props.onRemove()}></button>
            </div>
            <input class="edit" value={this.editText} onBlur={this.save} onKeyUp={this.handleKey} ref={elem => this.editElem = elem} />
        </li>;
    }
}

interface FooterProps {
    activeTodoCount: HyperValue<number>;
    selectedFilter: HyperValue<FilterTypes>;
    completedTodos: HyperValue<boolean>;
    onClearComplited: () => void;
}

class Footer extends Component<FooterProps> {
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
