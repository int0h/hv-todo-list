import {HyperValue} from 'hyper-value';
import {jsx, Component} from 'hv-jsx';
import {RouteComponentProps} from 'hv-router';

import {keyCodes, FilterTypes} from '../common';
import {TodoItemView} from './item';
import {Footer} from './footer';

interface TodoItem {
    text: HyperValue<string>;
    completed: HyperValue<boolean>;
    editing: HyperValue<boolean>;
}

interface PlainTodoItem {
    text: string;
    completed: boolean;
}

export class App extends Component<RouteComponentProps> {
    items: HyperValue<Array<TodoItem>> = new HyperValue([]);
    newTodo = new HyperValue(this.createTodo());
    display = this.hs.auto(() => this.items.$.length > 0 ? 'block' : 'none');
    selectedFilter = this.hs.prop<any, string>(this.props.routeData, 'filter') as HyperValue<FilterTypes>;
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
