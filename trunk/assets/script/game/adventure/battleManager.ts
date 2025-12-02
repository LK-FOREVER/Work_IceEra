import { ProgressBar } from 'cc';
import { _decorator, Component, Node } from 'cc';
import Utils from '../../utils/Utils';
import { Sprite } from 'cc';
import { GameData } from '../../GameData';
import { oops } from 'db://oops-framework/core/Oops';
import { JsonAsset } from 'cc';
import { UIID } from '../common/config/GameUIConfig';
import { GameEvent } from '../common/config/GameEvent';
const { ccclass, property } = _decorator;

@ccclass('battleManager')
export class battleManager extends Component {
    config: any = {};
    staff_config: any = {};//员工配置
    enemy_ability: number = 0;//敌人能力值
    staff_ability: number = 0;//员工能力值
    @property(Node)
    skip_btn: Node = null;//跳过按钮
    @property(Node)
    enemy_1: Node = null;//敌人1
    @property(Node)
    enemy_2: Node = null;//敌人2
    @property(Node)
    ice_1: Node = null;//冰雕1
    @property(Node)
    ice_2: Node = null;//冰雕2
    @property(Node)
    staff_1: Node = null;//员工1
    @property(Node)
    staff_2: Node = null;//员工2
    @property(Node)
    clickArea: Node = null;  // 点击区域

    @property(ProgressBar)
    enemyProgressBar: ProgressBar = null;//敌人进度条
    @property(ProgressBar)
    staffProgressBar: ProgressBar = null;//员工进度条
    enemyProgress: number = 0;  // 敌人进度条变化值（0-1）
    staffProgress: number = 0;  // 员工进度条变化值（0-1）
    currentEnemyProgress: number = 0;//当前敌人进度（0-totalLength）
    currentStaffProgress: number = 0;//当前员工进度（0-totalLength）
    progressSpeed: number = 10;  // 进度增加速度10/秒
    enemyProgressInterval: any = null;  // 敌人定时器ID
    staffProgressInterval: any = null;  // 员工定时器ID
    maxAbility: number = 0;//最大能力值
    isClickUpdate: boolean = false;  // 标记是否是点击更新


    async onAdded(params: any) {
        this.config = params || {};
        await this.get_staff_config();
        this.initUI();
        this.node.active = true;
        return true;
    }
    initUI() {
        this.skip_btn.on(Node.EventType.TOUCH_END, this.skipBattle, this);//跳过战斗
        Utils.getSpriteFrame("ui/staff_whole/" + this.config.level_config.enemy_id[0], this.enemy_1.getComponent(Sprite));
        Utils.getSpriteFrame("ui/staff_whole/" + this.config.level_config.enemy_id[1], this.enemy_2.getComponent(Sprite));
        Utils.getSpriteFrame("ui/staff_whole/" + GameData.battleData.StaffObj[0].id, this.staff_1.getComponent(Sprite));
        Utils.getSpriteFrame("ui/staff_whole/" + GameData.battleData.StaffObj[1].id, this.staff_2.getComponent(Sprite));
        Utils.getSpriteFrame("ui/ice/" + this.config.level_config.ice_id[0], this.ice_1.getComponent(Sprite));
        Utils.getSpriteFrame("ui/ice/" + this.config.level_config.ice_id[1], this.ice_2.getComponent(Sprite));

        // 初始化敌人进度条
        this.enemyProgressBar.progress = 0;
        // 初始化员工进度条
        this.staffProgressBar.progress = 0;
        //获取敌人的能力值
        this.enemy_ability = this.config.level_config.enemy_ablility[0] + this.config.level_config.enemy_ablility[1];
        //获取员工的等级和品质
        const lv_staff_1 = GameData.userDataProxy.staffLv[GameData.battleData.StaffObj[0].id];
        const lv_staff_2 = GameData.userDataProxy.staffLv[GameData.battleData.StaffObj[1].id];
        const quality_1 = GameData.battleData.StaffObj[0].quality;
        const quality_2 = GameData.battleData.StaffObj[1].quality;
        // 获取员工1的配置数据
        const staff1Config = this.staff_config[quality_1 - 1][quality_1.toString()].find(item => item.level === lv_staff_1);
        // 获取员工2的配置数据
        const staff2Config = this.staff_config[quality_2 - 1][quality_2.toString()].find(item => item.level === lv_staff_2);
        if (staff1Config && staff2Config) {
            this.staff_ability = GameData.battleData.StaffObj[0].ability
                + GameData.battleData.StaffObj[1].ability
                + staff1Config.ability_add
                + staff2Config.ability_add;// 员工1能力值 + 员工2能力值 + 员工1能力加成 + 员工2能力加成
        }
        // 进度条最大值为最大能力值
        this.maxAbility = this.enemy_ability >= this.staff_ability ? this.enemy_ability : this.staff_ability;
        console.log("敌人能力值：" + this.enemy_ability);
        console.log("员工能力值：" + this.staff_ability);
        // 添加屏幕点击事件
        this.clickArea.on(Node.EventType.TOUCH_END, this.onScreenClick, this);

        // 启动进度更新
        this.startProgressUpdate();
    }
    //获取员工配置信息
    get_staff_config(): Promise<void> {
        return new Promise((resolve, reject) => {
            const path = "config/data/adventure__get_staff_upgrade_conf"
            oops.res.load(path, JsonAsset, (err: { message: any }, jsonAsset: JsonAsset | null) => {
                if (err) {
                    console.warn(`Failed to load task config: ${err.message}`);
                    reject(err);
                    return;
                }
                if (!jsonAsset || !jsonAsset.json) {
                    console.warn(`Invalid task config loaded: ${path}`);
                    reject(new Error("Invalid config"));
                    return;
                }
                this.staff_config = jsonAsset.json;
                resolve();
            });
        });
    }
    private startProgressUpdate() {
        // 清除可能存在的旧定时器
        if (this.enemyProgressInterval) {
            clearInterval(this.enemyProgressInterval);
        }
        if (this.staffProgressInterval) {
            clearInterval(this.staffProgressInterval);
        }
        // 敌人和员工的进度变化速率
        let enemyProgressChange = this.progressSpeed / this.maxAbility;
        let staffProgressChange = this.progressSpeed / this.maxAbility;

        // 敌人进度条更新
        this.enemyProgressInterval = setInterval(() => {
            //停止进度条更新
            if (this.currentEnemyProgress >= this.enemy_ability) {
                this.currentEnemyProgress = this.enemy_ability;
                clearInterval(this.enemyProgressInterval);
                this.enemyProgressInterval = null;
                //员工能力值等于敌人能力值时，判定员工胜利
                if (this.staff_ability == this.enemy_ability)
                    return;
                if (this.currentEnemyProgress >= this.maxAbility) {
                    //战斗失败
                    oops.gui.open(UIID.BattleFailView, this.config);
                }
            } else {
                // 更新敌人进度
                if (this.currentEnemyProgress + this.progressSpeed >= this.enemy_ability) {
                    this.currentEnemyProgress = this.enemy_ability;
                } else {
                    this.currentEnemyProgress += this.progressSpeed;
                }
                this.enemyProgress = this.currentEnemyProgress / this.maxAbility;
                this.enemyProgressBar.progress = this.enemyProgress;
            }
        }, 1000);  // 每1000毫秒（1秒）更新一次敌人进度条

        // 员工进度条更新
        this.staffProgressInterval = setInterval(() => {
            //停止进度条更新
            if (!this.isClickUpdate) {
                if (this.currentStaffProgress >= this.staff_ability) {
                    this.currentStaffProgress = this.staff_ability;
                    clearInterval(this.staffProgressInterval);
                    this.staffProgressInterval = null;
                    if (this.currentStaffProgress >= this.maxAbility) {
                        //战斗胜利
                        GameData.battleData.StaffObj = []; //重置战斗数据
                        oops.gui.open(UIID.BattleWinView, this.config);
                        //获取奖励
                        this.getBattleReward();
                        //更新关卡
                        this.updateLevel();
                    }
                } else {
                    // 更新员工进度
                    if (this.currentStaffProgress + this.progressSpeed >= this.staff_ability) {
                        this.currentStaffProgress = this.staff_ability;
                    } else {
                        this.currentStaffProgress += this.progressSpeed;
                    }
                    this.staffProgress = this.currentStaffProgress / this.maxAbility;
                    this.staffProgressBar.progress = this.staffProgress;
                }
            }
        }, 1000);  // 每1000毫秒（1秒）更新一次员工进度条
    }
    //清除进度条更新定时器
    clearProgressUpdate() {
        if (this.enemyProgressInterval) {
            clearInterval(this.enemyProgressInterval);
            this.enemyProgressInterval = null;
        }
        if (this.staffProgressInterval) {
            clearInterval(this.staffProgressInterval);
            this.staffProgressInterval = null;
        }
    }
    //屏幕点击事件
    private onScreenClick() {
        if (this.currentStaffProgress < this.staff_ability) {
            this.isClickUpdate = true;
            // 增加进度值
            this.currentStaffProgress = Math.min(this.currentStaffProgress + 1, this.staff_ability);
            this.staffProgress = this.currentStaffProgress / this.maxAbility;
            // 更新进度条
            this.staffProgressBar.progress = this.staffProgress;
            this.isClickUpdate = false;
        }
    }

    //跳过战斗
    /**
     * 跳过战斗的方法
     * 该方法用于跳过当前战斗场景，直接进入战斗结果界面
     */
    skipBattle() {
        // 停止进度条更新
        this.clearProgressUpdate();
        //判断输赢
        if (this.staff_ability >= this.enemy_ability) {
            //战斗胜利
            // 跳转到战斗结果界面
            GameData.battleData.StaffObj = []; //重置战斗数据
            //获取奖励
            this.getBattleReward();
            //更新关卡
            this.updateLevel();
            oops.gui.open(UIID.BattleWinView, this.config);
        } else {
            //战斗失败
            oops.gui.open(UIID.BattleFailView, this.config);
        }
    }
    //获取战斗奖励
    getBattleReward() {
        for (let i = 0; i < this.config.level_config.reward.length; i++) {
            let reward_id = Object.keys(this.config.level_config.reward[i])[0];
            let reward_num = Object.values(this.config.level_config.reward[i])[0];
            GameData.userDataProxy.goods_list.forEach((item) => {
                if (item.id == Number(reward_id)) {
                    item.number += Number(reward_num);
                }
            });
        }

        //更新UI
        oops.message.dispatchEvent(GameEvent.UpdateGoodsList);
    }
    //更新关卡
    updateLevel() {
        GameData.userDataProxy.max_unlock_level += 1;
        oops.message.dispatchEvent(GameEvent.UpdateLevel);
    }
}


