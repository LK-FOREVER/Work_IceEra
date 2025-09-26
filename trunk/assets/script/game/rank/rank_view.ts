import { Button } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { UIID } from '../common/config/GameUIConfig';
import { GameComponent } from '../../../../extensions/oops-plugin-framework/assets/module/common/GameComponent';
const { ccclass, property } = _decorator;

@ccclass('rank_view')
export class rank_view extends GameComponent {
    start() {
        const close_btn = this.node.getChildByName("close_btn");
        const mask = this.node.getChildByName("mask");
        close_btn.on(Button.EventType.CLICK, this.close_handler, this)
        mask.on(Node.EventType.TOUCH_END, this.close_handler, this)
    }

    close_handler(){
        oops.gui.remove(UIID.RankView);
    }
}


