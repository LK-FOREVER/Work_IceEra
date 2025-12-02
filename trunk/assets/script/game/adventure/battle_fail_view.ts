import { _decorator, Component, Node } from 'cc';
import { oops } from 'db://oops-framework/core/Oops';
import { UIID } from '../common/config/GameUIConfig';
import { GameData } from '../../GameData';
const { ccclass, property } = _decorator;

@ccclass('battle_fail_view')
export class battle_fail_view extends Component {
    config: any = {};
    @property(Node)
    again_btn: Node = null; //再次挑战按钮
    @property(Node)
    back_main_btn: Node = null; //返回主界面按钮
    onAdded(params: any) {
        this.config = params || {};
        this.initUI();
        this.node.active = true;
        return true;
    }
    initUI() {
        this.again_btn.on(Node.EventType.TOUCH_END, this.onAgainBtnClick, this);
        this.back_main_btn.on(Node.EventType.TOUCH_END, this.onBackMainBtnClick, this);
    }
    onAgainBtnClick() {
        oops.gui.removeByNode(this.node);
        oops.gui.removeByNode(oops.gui.get(UIID.BattleView));
    }

    onBackMainBtnClick() {
        GameData.battleData.StaffObj = []; //重置战斗数据
        oops.gui.removeByNode(this.node);
        oops.gui.removeByNode(oops.gui.get(UIID.BattleView));
        oops.gui.removeByNode(oops.gui.get(UIID.PrepareView));
    }
}


