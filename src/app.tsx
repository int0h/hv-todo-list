import {HyperValue} from 'hv';
import {jsx, Component} from 'hv-jsx';
import {renderIn} from 'hv-dom';

const keyCodes = {
    enter: 13,
    escape: 27
};

interface TodoItem {
    text: HyperValue<string>;
    completed: HyperValue<boolean>;
    editing: HyperValue<boolean>;
}

class App extends Component<{}> {
    items: HyperValue<Array<TodoItem>> = new HyperValue([]);
    newTodo = new HyperValue(this.createTodo());
    display = this.hs.auto(() => this.items.$.length > 0 ? 'block' : 'none');
    selectedFilter = new HyperValue('all' as ('all' | 'active' | 'complited'));
    showedItems = this.hs.filter(this.items, item => {
        switch (this.selectedFilter.$) {
            case 'all': return true;
            case 'active': return !item.completed.$;
            case 'complited': return item.completed.$;
        }
    });

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
                <p>Created by <a href="http://sindresorhus.com">Sindre Sorhus</a></p>
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
    toggle = () => {
        this.props.completed.$ = !this.props.completed.$;
    }

    render() {
        return <li class={this.hs.auto(() => this.props.completed.$ ? 'completed' : '')} data-id="{{id}}">
            <div class="view">
                <input class="toggle" type="checkbox" checked={this.hs.auto(() => this.props.completed.$)} onChange={this.toggle}/>
                <label>{this.props.title}</label>
                <button class="destroy" onClick={() => this.props.onRemove()}></button>
            </div>
            <input class="edit" value={this.props.title} />
        </li>;
    }
}

interface FooterProps {
    activeTodoCount: HyperValue<number>;
    //activeTodoWord: HyperValue<string>;
    selectedFilter: HyperValue<'all' | 'active' | 'complited'>;
    completedTodos: HyperValue<boolean>;
    onClearComplited: () => void;
}

class Footer extends Component<FooterProps> {
    getClass = (type: 'all' | 'active' | 'complited') => {
        return this.hs.auto(() => this.props.selectedFilter.$ === type ? 'selected' : '')
    }

    getOnClick = (type: 'all' | 'active' | 'complited') => {
        return (e: Event) => {
            e.preventDefault();
            this.props.selectedFilter.$ = type;
        };
    }

    render() {
        return [
            // <span id="todo-count"><strong>{this.props.activeTodoCount}}</strong> {this.props.activeTodoWord} left</span>
            <span id="todo-count"><strong>{this.props.activeTodoCount}</strong> todos left</span>
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

renderIn(document.body, {}, <App />);
