import {HyperValue} from 'hyper-value';
import {jsx, Component, HvNode} from 'hv-jsx';

import {keyCodes} from '../common';

interface TodoItemProps {
    completed: HyperValue<boolean>;
    title: HyperValue<string>;
    onRemove: () => void;
}

export class TodoItemView extends Component<TodoItemProps> {
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
