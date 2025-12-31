import { _decorator, Component, Node, SpriteFrame, Sprite, Label } from 'cc';
import { GameComponent } from '../../../../extensions/oops-plugin-framework/assets/module/common/GameComponent';
import { GameData } from '../../GameData';
import { Prefab } from 'cc';
import { EventTouch } from 'cc';
import { oops } from 'db://oops-framework/core/Oops';
import { UIID } from '../common/config/GameUIConfig';
import { JsonAsset } from 'cc';
import { GameEvent } from '../common/config/GameEvent';
import { ProgressBar } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('adventure_view')
export class adventure_view extends GameComponent {
    //关卡通关状态
    @property(SpriteFrame)
    pass_sprite: SpriteFrame = null;
    //关卡未通关状态
    @property(SpriteFrame)
    not_pass_sprite: SpriteFrame = null;
    //关卡根节点
    @property(Node)
    root_level: Node = null;
    @property(Node)
    ProgressBar: Node = null;//进度条
    @property(Label)
    ProgressLabel: Label = null;//进度条文字
    config: any = {};//关卡配置

    onLoad() {
        // 监听全局事件
        oops.message.on(GameEvent.UpdateLevel, this.init_level_status, this);
    }

    onDestroy() {
        // 对象释放时取消注册的全局事件
        oops.message.off(GameEvent.UpdateLevel, this.init_level_status, this);
    }
    async start() {
        //获取关卡配置
        await this.get_level_config();
        //关卡点击
        for (let i = 0; i < this.root_level.children.length; i++) {
            let level_node = this.root_level.children[i];
            level_node.on(Node.EventType.TOUCH_END, this.on_level_click, this);
        }
        this.init_level_status();
    }

    //初始化关卡显示状态
    init_level_status() {
        let max_unlock_level = GameData.userData.max_unlock_level;
        for (let i = 0; i < this.root_level.children.length; i++) {
            let level_node = this.root_level.children[i];
            let sprite = level_node.getComponent(Sprite);
            if (i + 1 <= max_unlock_level) {
                sprite.spriteFrame = this.pass_sprite;
            } else {
                sprite.spriteFrame = this.not_pass_sprite;
            }
            //修改关卡名称
            let name = level_node.getChildByName("Label")
            name.getComponent(Label).string = "第" + (i + 1) + "关";
        }
        //更新进度条
        let progress = GameData.userData.max_unlock_level / this.root_level.children.length;
        this.ProgressBar.getComponent(ProgressBar).progress = progress;
        this.ProgressLabel.string = GameData.userData.max_unlock_level + "/" + this.root_level.children.length;
    }
    get_level_config(): Promise<void> {
        return new Promise((resolve, reject) => {
            const path = "config/data/adventure__get_level_conf"
            oops.res.load("bundle", path, JsonAsset, (err: { message: any }, jsonAsset: JsonAsset | null) => {
                if (err) {
                    console.warn(`Failed to load level config: ${err.message}`);
                    reject(err);
                    return;
                }
                if (!jsonAsset || !jsonAsset.json) {
                    console.warn(`Invalid level config loaded: ${path}`);
                    reject(new Error("Invalid config"));
                    return;
                }
                this.config = jsonAsset.json;
                GameData.userData.level_config = this.config;//保存关卡配置
                resolve();
            });
        });
    }

    on_level_click(event: EventTouch) {
        let level_node = event.target;
        let current_level_index = Number(level_node.name.split("level_")[1]);//第几关：1,2,3,4,...
        //判断是否已解锁
        if (current_level_index <= GameData.userData.max_unlock_level) {
            let params: any = {
                level_num: current_level_index,
                level_config: this.config[current_level_index - 1] || {},
            };
            oops.gui.open(UIID.LevelInfoView, params);
        } else {
            oops.gui.toast("该关卡未解锁");
        }
    }
}


