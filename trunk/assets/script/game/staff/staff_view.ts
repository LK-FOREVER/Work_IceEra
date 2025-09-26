import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('staff_view')
export class staff_view extends Component {
    staff_scroll: Node = null;
    start() {
        this.staff_scroll = this.node.getChildByName("staff_scroll");
    }

    update(deltaTime: number) {

    }
}


