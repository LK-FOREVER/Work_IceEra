import { Label } from 'cc';
import { Sprite } from 'cc';
import { _decorator, Component, Node } from 'cc';
import Utils from '../../utils/Utils';
import { oops } from 'db://oops-framework/core/Oops';
import { UIID } from '../common/config/GameUIConfig';
import { GameData } from '../../GameData';
import { GameEvent } from '../common/config/GameEvent';
const { ccclass, property } = _decorator;

@ccclass('battle_win_view')
export class battle_win_view extends Component {
    config: any = {};
    @property(Node)
    icon_1: Node = null;
    @property(Node)
    icon_2: Node = null;
    @property(Node)
    icon_3: Node = null;
    @property(Node)
    num_1: Node = null;
    @property(Node)
    num_2: Node = null;
    @property(Node)
    num_3: Node = null;
    @property(Node)
    next_level_btn: Node = null; //下一关按钮
    @property(Node)
    back_main_btn: Node = null; //返回主界面按钮
    onAdded(params: any) {
        this.config = params || {};
        this.initUI();
        this.node.active = true;
        return true;
    }

    initUI() {
        //设置图标
        let icon_list = [this.icon_1, this.icon_2, this.icon_3];
        for (let i = 0; i < icon_list.length; i++) {
            let icon = icon_list[i];
            if (icon) {
                let reward_id = Object.keys(this.config.level_config.reward[i])[0];
                Utils.getSpriteFrame("ui/goods/" + reward_id, icon.getComponent(Sprite));
            }
        }
        //设置数量
        let num_list = [this.num_1, this.num_2, this.num_3];
        for (let i = 0; i < num_list.length; i++) {
            let num = num_list[i];
            if (num) {
                let reward_num = Object.values(this.config.level_config.reward[i])[0];
                num.getComponent(Label).string = Utils.formatNumber(reward_num ? Number(reward_num) : 0);
            }
        }

        this.next_level_btn.on(Node.EventType.TOUCH_END, this.onNextLevelBtnClick, this);
        this.back_main_btn.on(Node.EventType.TOUCH_END, this.onBackMainBtnClick, this);
    }

    onNextLevelBtnClick() {
        oops.gui.removeByNode(this.node);
        oops.gui.removeByNode(oops.gui.get(UIID.BattleView));
        oops.gui.removeByNode(oops.gui.get(UIID.PrepareView));

        //获取下一关配置
        let next_level_num = this.config.level_num + 1;
        let next_level_config = GameData.userData.level_config[next_level_num - 1];
        let params: any = {
            level_num: next_level_num,
            level_config: next_level_config,
        };
        //消耗体力（能量）
        let energy_num = GameData.userData.goods_list[1024];
        if (energy_num >= next_level_config.energy_cost) {
            GameData.userData.goods_list[1024] -= next_level_config.energy_cost;
            oops.message.dispatchEvent(GameEvent.UpdateGoodsList);
            oops.gui.open(UIID.PrepareView, params);
        } else {
            oops.gui.toast("体力不足");
        }
    }

    onBackMainBtnClick() {
        oops.gui.removeByNode(this.node);
        oops.gui.removeByNode(oops.gui.get(UIID.BattleView));
        oops.gui.removeByNode(oops.gui.get(UIID.PrepareView));
    }
}


