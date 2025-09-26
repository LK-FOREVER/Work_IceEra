import { _decorator, Node, sys, EditBox, Button } from "cc";
import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { CCComp } from "../../../../../extensions/oops-plugin-framework/assets/module/common/CCComp";
import { GameStorageConfig } from "../../common/config/GameStorageConfig";
import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { EventTouch } from "cc";
import { UIID } from "../../common/config/GameUIConfig";
import { GameData } from "../../../GameData";

const { ccclass, property } = _decorator;

/** 视图层对象 */
@ccclass('LoginView')
@ecs.register('LoginView', false)
export class LoginView extends CCComp {
    login_btn: Node = null;
    protected onLoad(): void {
        this.add_listener();
    }
    protected onDestroy(): void {
        this.remove_listener();
    }
    private add_listener() {
        // oops.message.on(GameEvent.OPEN_MAIN_VIEW, this.open_main_view, this);
    }
    private remove_listener() {
        // oops.message.off(GameEvent.OPEN_MAIN_VIEW, this.open_main_view, this);
    }
    start() {
        this.login_btn = this.node.getChildByName("login_btn")

        this.login_btn.on(Button.EventType.CLICK, this.btn_handler, this)
    }
    btn_handler(event: EventTouch) {
        const event_target: Node = event.target as Node;
        if (event_target.name == "login_btn"){
            // 判断缓存中是否有玩家数据 如果有数据并且账号一致则用缓存数据替换gamedata中的数据
            if (GameData.getLocalUserData() && GameStorageConfig.accountName === GameData.getLocalUserData().account){
                const userData = GameData.getLocalUserData();
                GameData.userData = userData;
            }else{
                // 使用gamedata中的数据
                GameData.replaceData();
            }

            // 测试数据
            GameData.userData.goods_list.find(item => item.id === 1001).number = 1;
            GameData.userData.goods_list.find(item => item.id === 1011).number = 99;

            oops.gui.open(UIID.MainView);

            // 将数据保存到本地
            GameData.setUserData();
        }
    }

    reset() {
        this.node.destroy();
    }
}