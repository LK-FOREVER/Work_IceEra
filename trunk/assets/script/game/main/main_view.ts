import { _decorator, Component, Node } from 'cc';
import Utils from '../../utils/Utils';
import { Sprite } from 'cc';
import { Prefab } from 'cc';
import { instantiate } from 'cc';
import { Label } from 'cc';
import { sys } from 'cc';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { UIID } from '../common/config/GameUIConfig';
import { GameData } from '../../GameData';
import { EventTouch } from 'cc';
import { GameEvent } from '../common/config/GameEvent';
const { ccclass, property } = _decorator;

@ccclass('main_view')
export class main_view extends Component {
    @property(Array(Prefab))
    private tab_view_list: Array<Prefab> = [];
    private tab_list: Node = null!;
    private function_btn_list_R: Node = null!;
    private function_btn_list_L: Node = null!;
    private ui_layer: Node = null!;
    private main_player_info: Node = null!;
    private default_goods: Node = null!;
    private default_tab_index: number = 1;
    onLoad() {
        // 监听全局事件
        oops.message.on(GameEvent.UpdateGoodsList, this.UpdateGoodsList, this);
    }

    onDestroy() {
        // 对象释放时取消注册的全局事件
        oops.message.off(GameEvent.UpdateGoodsList, this.UpdateGoodsList, this);
    }
    start() {
        this.tab_list = this.node.getChildByName("tab_list")
        this.ui_layer = this.node.getChildByName("ui_layer")
        this.function_btn_list_R = this.node.getChildByName("function_btn_list_R")
        this.function_btn_list_L = this.node.getChildByName("function_btn_list_L")
        this.main_player_info = this.node.getChildByName("main_player_info")
        this.default_goods = this.node.getChildByName("default_goods")

        this.function_btn_list_R.children.forEach(tab_item => {
            tab_item.on(Node.EventType.TOUCH_END, this.open_function_handler, this)
        })

        this.function_btn_list_L.children.forEach(tab_item => {
            tab_item.on(Node.EventType.TOUCH_END, this.open_function_handler, this)
        })

        this.tab_list.children.forEach(tab_item => {
            tab_item.on(Node.EventType.TOUCH_END, this.switch_view_handler, this)

            const tab_index = tab_item.getSiblingIndex();
            if (tab_index === this.default_tab_index) {
                Utils.getSpriteFrame("ui/main/main_tab_item_2", tab_item.getComponent(Sprite))
            }
        })

        this.switch_view_handler(null)

        this.default_goods.children.forEach(goods_item_bg => {
            goods_item_bg.children.forEach(goods_item => {
                const goods_id = Number(goods_item.name.split("_")[2]);
                const has_goods_info = GameData.userDataProxy.goods_list.find(item => item.id === goods_id)
                goods_item.getComponent(Label).string = Utils.formatNumber(has_goods_info?.number || 0)
            })
        })

        this.main_player_info.getChildByName("player_name").getComponent(Label).string = sys.localStorage.getItem("nickName")
    }

    open_function_handler(event) {
        const event_target: Node = event.target as Node;
        if (event_target.name === "rank_btn") {
            oops.gui.open(UIID.RankView);
        } else if (event_target.name === "setting_btn") {
            oops.gui.open(UIID.SettingView);
        } else if (event_target.name === "task_btn") {
            oops.gui.open(UIID.TaskView);
        } else if (event_target.name === "friend_btn") {
            oops.gui.open(UIID.FriendView);
        }
    }

    switch_view_handler(event: EventTouch) {
        if (event !== null) {
            const event_tab_item: Node = event.target as Node;
            const tab_index = event_tab_item.getSiblingIndex();
            if (tab_index === this.default_tab_index) {
                return;
            }
            this.default_tab_index = tab_index;

            // 全部变为未选中状态
            this.tab_list.children.forEach(tab_item => {
                Utils.getSpriteFrame("ui/main/main_tab_item_1", tab_item.getComponent(Sprite))
            })
            Utils.getSpriteFrame("ui/main/main_tab_item_2", event_tab_item.getComponent(Sprite))
            // 清空所有界面
            this.ui_layer.children.forEach(layer => {
                layer.removeFromParent();
            })
            // if (this.default_tab_index === 0) return;
            // 实例化界面
            const selected_view = instantiate(this.tab_view_list[this.default_tab_index])
            selected_view.setParent(this.ui_layer)
        } else {
            // 实例化界面
            const selected_view = instantiate(this.tab_view_list[this.default_tab_index])
            selected_view.setParent(this.ui_layer);
        }
        // 让功能图标只有在地图模块中显示
        this.main_player_info.active = true;
        this.default_goods.active = true;
        this.function_btn_list_R.active = this.default_tab_index === 1;
        this.function_btn_list_L.active = this.default_tab_index === 1;
    }

    UpdateGoodsList() {
        this.default_goods.children.forEach(goods_item_bg => {
            goods_item_bg.children.forEach(goods_item => {
                const goods_id = Number(goods_item.name.split("_")[2]);
                const has_goods_info = GameData.userDataProxy.goods_list.find(item => item.id === goods_id)
                goods_item.getComponent(Label).string = Utils.formatNumber(has_goods_info?.number || 0)
            })
        })
    }
}


