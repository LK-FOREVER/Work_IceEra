import { _decorator, Component, Node } from 'cc';
import { oops } from 'db://oops-framework/core/Oops';
import { GameComponent } from 'db://oops-framework/module/common/GameComponent';
import { UIID } from '../common/config/GameUIConfig';
import { Button } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('friend_view')
export class friend_view extends GameComponent {
    start() {
        // 绑定关闭窗口事件
        const close_btn = this.node.getChildByName("close_btn");
        const mask = this.node.getChildByName("mask");
        close_btn.on(Button.EventType.CLICK, this.close_handler, this);
        mask.on(Node.EventType.TOUCH_END, this.close_handler, this);
    }

    update(deltaTime: number) {

    }

    close_handler() {
        oops.gui.remove(UIID.FriendView);
    }
}


