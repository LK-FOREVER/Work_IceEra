import { _decorator, Component, Node, EventTouch, instantiate, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('build_control')
export class build_control extends Component {
    //建筑列表
    build_list: Node = null!;
    //建筑列表界面根节点
    build_view_root: Node = null!;
    //建筑列表界面
    @property({ type: Prefab })
    build_view_list: Array<Prefab> = [];
    start() {
        this.build_view_root = this.node.parent.parent.getChildByName("build_view_root");
        this.build_list = this.node.getChildByName("RootMapNode").getChildByName("map_bg").getChildByName("build_list");
        this.build_list.children.forEach(build_item => {
            build_item.on(Node.EventType.TOUCH_END, this.on_build_item_click, this);
        })
    }
    //建筑列表点击事件
    on_build_item_click(event: EventTouch) {
        if (event != null) {
            const build_item = event.target as Node;
            const build_index = build_item.getSiblingIndex();//获取建筑索引
            console.log("build_index", build_index);
            // 实例化界面
            const selected_view = instantiate(this.build_view_list[build_index])
            selected_view.setParent(this.build_view_root)
        }
    }
}


