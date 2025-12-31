import { _decorator, Component, Node, SpriteFrame, Prefab, Button, Sprite, Label, JsonAsset, RichText, sys, find, instantiate, resources } from 'cc';
import { oops } from 'db://oops-framework/core/Oops';
import { GameEvent } from '../common/config/GameEvent';
import Utils from '../../utils/Utils';
import { GameData } from '../../GameData';
import { ToastControllers } from '../common/ToastControllers';
const { ccclass, property } = _decorator;

@ccclass('recruit_view')
export class recruit_view extends Component {
    last_text: Node = null;
    invite_close: Node = null;
    invite_btn_box: Node = null;
    invite_btn_1: Node = null;
    invite_btn_5: Node = null;
    common_red_dot_1: Node = null;
    common_red_dot_5: Node = null;
    goods_has_num_1: Node = null;
    goods_has_num_2: Node = null;
    invite_details_btn: Node = null;
    tip_view: Node = null;
    tip_close: Node = null;
    recruit_ratio_info_1: any = null;
    recruit_ratio_info_2: any = null;
    recruit_ratio_show: any = null;
    recruit_type_info: any = null;
    recruit_type_show_info: any = null;
    get_tower_info: any = null;
    selected_recruit_type_info: any = null;
    selected_type: number = 0;
    invite_num: number = 0;
    isGuaranteedReward: boolean = false;//是否必得橙色奖励
    today_free: Node = null;
    btn_txt: Node = null;
    invite_limite: Node = null;
    build_view_root: Node = null;//招募结果弹窗的根节点
    rewardItemList: any[] = [];//存放招募结果，用于后续再招募结果弹窗展示
    @property(Prefab)
    invite_reward_box: Prefab = null;//招募结果弹窗的预制体
    protected onLoad(): void {
        // oops.message.on(GameEvent.CloseShop, this.updateUI, this);

    }
    protected onDestroy(): void {
        // oops.message.off(GameEvent.CloseShop, this.updateUI, this);
    }
    async start() {
        this.last_text = this.node.getChildByName("invite_last_text").getChildByName("last_text");
        this.invite_close = this.node.getChildByName("bottom_bg").getChildByName("invite_close");
        this.invite_btn_box = this.node.getChildByName("invite_btn_box");
        this.invite_btn_1 = this.invite_btn_box.getChildByName("invite_btn_1");
        this.invite_btn_5 = this.invite_btn_box.getChildByName("invite_btn_5");
        this.common_red_dot_1 = this.invite_btn_1.getChildByName("common_red_dot_1");
        this.common_red_dot_1.active = false;
        this.common_red_dot_5 = this.invite_btn_5.getChildByName("common_red_dot_5");
        this.common_red_dot_5.active = false;
        this.goods_has_num_1 = this.node.getChildByName("goods_has_num_1");
        this.goods_has_num_2 = this.node.getChildByName("goods_has_num_2");
        this.invite_details_btn = this.node.getChildByName("invite_details_btn");
        this.tip_view = this.node.getChildByName("tip_view");
        this.tip_close = this.tip_view.getChildByName("tip_close");
        this.today_free = this.invite_btn_1.getChildByName("today_free");
        this.btn_txt = this.invite_btn_1.getChildByName("btn_txt");
        this.invite_limite = this.node.getChildByName("invite_limite_bg").getChildByName("invite_limite");
        this.build_view_root = this.node.parent;
        // await this.get_recruit_config();
        const asset1 = await Utils.getJsonAsset("config/data/recruit__get_recruit_ratio_info_1");
        this.recruit_ratio_info_1 = asset1 ? asset1.json : [];
        const asset2 = await Utils.getJsonAsset("config/data/recruit__get_recruit_ratio_info_2");
        this.recruit_ratio_info_2 = asset2 ? asset2.json : [];
        const asset3 = await Utils.getJsonAsset("config/data/recruit__get_recruit_type_info");
        this.recruit_type_info = asset3 ? asset3.json : [];
        this.invite_btn_1.on(Button.EventType.CLICK, this.invite_btn_handler, this)
        this.invite_btn_5.on(Button.EventType.CLICK, this.invite_btn_handler, this)
        this.invite_close.on(Button.EventType.CLICK, this.on_back_btn_click, this)
        this.invite_details_btn.on(Button.EventType.CLICK, this.on_question_btn_click, this)
        this.tip_close.on(Button.EventType.CLICK, () => this.tip_view.active = false, this)
        // console.log('this.recruit_ratio_info_1:', this.recruit_ratio_info_1);
        // console.log('this.recruit_ratio_info_2:', this.recruit_ratio_info_2);
        // console.log('this.recruit_type_info:', this.recruit_type_info);
        this.updateUI();
    }
    updateUI() {
        this.invite_limite.getComponent(Label).string = `今日招募次数：${GameData.userData.inviteLimiteDailyNum}/${GameData.userData.inviteLimiteDailyTotalNum}`;
        this.common_red_dot_1.active = (GameData.userData.goods_list[1004] > 0 || GameData.userData.inviteTodayFreeLastNum > 0) && GameData.userData.inviteLimiteDailyNum < GameData.userData.inviteLimiteDailyTotalNum;
        this.common_red_dot_5.active = GameData.userData.goods_list[1004] >= 5 && GameData.userData.inviteLimiteDailyNum <= GameData.userData.inviteLimiteDailyTotalNum - 5;

        if (this.selected_type === 0) {
            //每日首次招募免费
            this.today_free.active = GameData.userData.inviteTodayFreeLastNum > 0;
            this.btn_txt.active = !this.today_free.active;

            this.last_text.getComponent(RichText).string =
                `<outline color=#131c26 width=2>累计<color=#ffffff>${GameData.userData.inviteNumTotalOrange}</color>次招募必出<color=#F3C259>橙色英雄</color></outline>`
            this.goods_has_num_1.getComponent(Label).string = `拥有:${GameData.userData.goods_list[1004]}`
            this.goods_has_num_2.getComponent(Label).string = `拥有:${GameData.userData.goods_list[1004]}`
        }
        // 表中招聘数据
        this.selected_recruit_type_info = this.recruit_type_info.find(type_info => type_info.id === this.selected_type + 1)
    }
    // 加载资源并返回 Promise 的函数
    loadResource(path: string, type: any) {
        return new Promise((resolve, reject) => {
            resources.load(path, type, (err, spriteFrame) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(spriteFrame);
                }
            });
        });
    };
    // 加载json并返回 Promise 的函数
    loadJsonAsset(path: string, type: any) {
        return new Promise((resolve, reject) => {
            resources.load(path, type, (err, res: JsonAsset) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    };
    invite_btn_handler(event: Event) {
        const target: Node = event.target as unknown as Node;
        if (target.name === "invite_btn_1") {
            if (this.selected_type === 0) {
                // 普通招聘
                // 先判断当日免费招募员工次数
                if (GameData.userData.inviteTodayFreeLastNum > 0) {
                    this.inviteStaff(true, 1);
                }
                // 判断招募券的数量
                else if (GameData.userData.goods_list[1004] > 0) {
                    this.inviteStaff(false, 1);
                } else {
                    //提示招募令不足
                }
            }
        } else if (target.name === "invite_btn_5") {
            if (this.selected_type === 0) {
                // 普通招聘
                // 判断招募券的数量
                if (GameData.userData.goods_list[1004] >= 5) {
                    this.inviteStaff(false, 5);
                } else {
                    //提示招募令不足
                }
            }
        }
        this.updateUI();
    }
    // 招聘员工
    inviteStaff(isAD: boolean = false, invite_num: number = 1) {
        this.invite_num = invite_num;
        if (GameData.userData.inviteLimiteDailyNum + this.invite_num > GameData.userData.inviteLimiteDailyTotalNum) {
            ToastControllers.Instance.showToast("今日剩余招募次数不足！");
            return;
        }
        GameData.userData.inviteLimiteDailyNum += this.invite_num;
        //任务
        // let id = GameData.taskData.continuousTaskId % TextUtils.Instance.task__get_continuous_task.length
        // if (id == 1) {
        //     GameData.taskData.continueTaskContentNumList[id]++;
        //     EventManager.Instance.emit(EventConst.UPDATE_CONTINUOUS_TASK)
        // }
        // GameData.taskData.dailyTaskContentNumList[0]++;
        const randomItemList: object[] = [];
        for (let index = 0; index < invite_num; index++) {
            // 减掉招聘次数
            if (this.selected_type === 0) {
                if (isAD) {
                    GameData.userData.inviteTodayFreeLastNum -= 1;
                } else {
                    GameData.userData.goods_list[1004] -= 1;
                }
                GameData.userData.inviteNumTotalOrange -= 1;
                this.isGuaranteedReward = GameData.userData.inviteNumTotalOrange <= 0
                if (this.isGuaranteedReward) {
                    GameData.userData.inviteNumTotalOrange = GameData.userData.inviteNumDefaultTotal;
                }
            }
            // 表中招聘数据
            this.selected_recruit_type_info = this.recruit_type_info.find(type_info => type_info.id === this.selected_type + 1)
            const randomItem: object = this.isGuaranteedReward ? this.getMinimumGuaranteedReward() : this.getRandomReward();
            randomItemList.push(randomItem);
        }
        GameData.userData.randomItemList = randomItemList;

        //五连抽，必得完整英雄
        if (this.invite_num === 5) {
            let haveCompleteStuff = false;
            this.rewardItemList = GameData.userData.randomItemList
            this.rewardItemList.forEach((reward_item) => {
                if (reward_item.group_id === 2 || reward_item.group_id === 3) {
                    haveCompleteStuff = true;
                }
            })
            if (!haveCompleteStuff) {
                // 生成一个随机索引
                const randomIndex = Math.floor(Math.random() * randomItemList.length);

                // 使用 splice 方法移除随机索引处的元素
                randomItemList.splice(randomIndex, 1);

                // 随机获取一个完整英雄
                const randomItem: object = this.getCompleteStuffReward();
                randomItemList.push(randomItem);
                GameData.userData.randomItemList = randomItemList;
            }
        }
        // 打开招聘结果
        // console.log("招聘员工", GameData.userData.randomItemList);
        const invite_reward_box = instantiate(this.invite_reward_box);
        invite_reward_box.setParent(this.build_view_root);
        invite_reward_box.setPosition(0, 0);
        //音频
        // if (this.audio_manager) {
        //     this.audio_manager.playSound("tower_invite", false);
        // }
    }

    // 随机奖励
    getRandomReward() {
        // 从第一层概率中找到对应抽卡类型的数据列表
        const ratio_info_1_list = this.recruit_ratio_info_1.filter(item => item.type_id === this.selected_recruit_type_info.id)
        // 根据权重获取随机的group_id
        const random_ratio_info_1_group_id = this.getRandomItemByWeight(ratio_info_1_list).group_id
        // 从第二层概率中找到对应抽卡类型的数据列表
        const ratio_info_2_list = this.recruit_ratio_info_2.filter(item => item.type_id === this.selected_recruit_type_info.id)
        // 根据group_id获取第二层概率对应的数据组列表
        const random_group_reward_list = ratio_info_2_list.filter(item => item.group_id === random_ratio_info_1_group_id)
        // 将筛选出的组列表根据权重获取随机奖励
        const random_reward_data = this.getRandomItemByWeight(random_group_reward_list)
        return random_reward_data
    }

    // 50次招募保底奖励
    getMinimumGuaranteedReward() {
        const selectedGroupId = this.getRandomGroupIdByWeight(this.selected_recruit_type_info.reward);//2
        const selected_reward_type_list = this.recruit_ratio_info_2.filter(item => item.type_id === this.selected_recruit_type_info.id)
        const random_group_reward_list = selected_reward_type_list.filter(item => item.group_id === selectedGroupId)
        const random_reward_data = this.getRandomItemByWeight(random_group_reward_list)
        return random_reward_data
    }
    //获取一个完整的英雄
    getCompleteStuffReward() {
        const selectedGroupId = 3
        const selected_reward_type_list = this.recruit_ratio_info_2.filter(item => item.type_id === this.selected_recruit_type_info.id)
        const random_group_reward_list = selected_reward_type_list.filter(item => item.group_id === selectedGroupId)
        const random_reward_data = this.getRandomItemByWeight(random_group_reward_list)
        return random_reward_data
    }
    // 通过权重大小随机获取组id
    getRandomItemByWeight(items: Array<{ ratio: number }>): any {
        let totalWeight = items.reduce((sum, item) => sum + item.ratio, 0);
        let randomNum = Math.random() * totalWeight;
        for (let item of items) {
            randomNum -= item.ratio;
            if (randomNum <= 0) {
                return item;
            }
        }
        // 如果因为浮点数运算误差导致未找到匹配项，返回最后一个（理论上不会发生）
        return items[items.length - 1];
    }
    // 通过权重大小随机获取组id
    getRandomGroupIdByWeight(weightedGroups: Array<{ k: string | number; v: number }>): string | number | undefined {
        let totalWeight = 0;
        let groupKeys: (string | number)[] = [];

        // 计算总权重并收集组ID
        for (let group of weightedGroups) {
            totalWeight += group.v;
            groupKeys.push(group.k);
        }

        if (totalWeight === 0) {
            console.warn('Total weight is zero, cannot select a group.');
            return undefined;
        }

        let randomNum = Math.random() * totalWeight;
        let currentWeight = 0;

        // 根据权重选择组ID
        for (let i = 0; i < weightedGroups.length; i++) {
            currentWeight += weightedGroups[i].v;
            if (randomNum <= currentWeight) {
                return groupKeys[i];
            }
        }

        console.error('Unexpected error in weight selection logic.');
        return undefined;
    }
    // 点击返回按钮
    on_back_btn_click() {
        //销毁界面
        this.node.destroy();
    }
    // 点击详情按钮
    on_question_btn_click() {
        //显示提示界面
        this.tip_view.active = true;
    }
}


