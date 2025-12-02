import { Sprite } from 'cc';
import { Prefab } from 'cc';
import { _decorator, Component, Node } from 'cc';
import Utils from '../../utils/Utils';
import { Label } from 'cc';
import { oops } from 'db://oops-framework/core/Oops';
import { GameData } from '../../GameData';
import { instantiate } from 'cc';
import { resources } from 'cc';
import { SpriteFrame } from 'cc';
import { v3 } from 'cc';
import { TouchCtorControllers } from './TouchCtorControllers';
import { GameEvent } from '../common/config/GameEvent';
import { UIID } from '../common/config/GameUIConfig';
const { ccclass, property } = _decorator;

@ccclass('prepare_view')
export class prepare_view extends Component {
    private config: any = {};
    @property(Node)
    level_name: Node = null;
    @property(Node)
    choose_panel: Node = null;//员工选择界面
    @property(Node)
    one_click_btn: Node = null;//一键上阵按钮
    @property(Node)
    ice_1: Node = null;//冰雕1
    @property(Node)
    ice_2: Node = null;//冰雕2
    @property(Node)
    enemy_slot_1: Node = null;//敌人站位槽1
    @property(Node)
    enemy_slot_2: Node = null;//敌人站位槽2
    @property(Node)
    player_slot_1: Node = null;//玩家站位槽1
    @property(Node)
    player_slot_2: Node = null;//玩家站位槽2
    @property(Prefab)
    staff_card: Prefab = null;//上阵员工卡片预制体
    @property({ type: Prefab })
    private staff_icon: Prefab = null;//待选择员工头像预制体
    @property(Node)
    staffWaitList: Node[] = [];//待选择员工列表节点
    objStaffList: any[];     //已上阵员工列表
    waitStaffList: any[];    //待选择员工列表
    choose_btn: Node = null;//上阵按钮
    onAdded(params: any) {
        this.config = params || {};
        this.initUI();
        this.ctorStaffList();
        this.node.active = true;
        return true;
    }
    onLoad() {
        // 监听全局事件
        oops.message.on(GameEvent.UpdateStaffChooseBtn, this.onHandler, this);
    }

    protected onDestroy() {
        // 对象释放时取消注册的全局事件
        oops.message.off(GameEvent.UpdateStaffChooseBtn, this.onHandler, this);
    }
    private initUI() {
        //返回按钮
        let back_btn = this.node.getChildByName("root").getChildByName("back_btn");
        back_btn.on(Node.EventType.TOUCH_END, this.close, this);
        //上阵/替换按钮
        this.choose_btn = this.node.getChildByName("root").getChildByName("choose_btn");
        this.choose_btn.active = this.choose_panel.active;
        this.choose_btn.on(Node.EventType.TOUCH_END, () => {
            let choose_staff_data = GameData.userDataProxy.selectedStaff;
            if (!choose_staff_data) {
                oops.gui.toast("请选择员工后再上阵");
            } else {
                if (choose_staff_data.id === GameData.battleData.StaffObj[0]?.id || choose_staff_data.id === GameData.battleData.StaffObj[1]?.id) {
                    if (choose_staff_data.id === GameData.battleData.StaffObj[0]?.id) {
                        //移除GameData.battleData.StaffObj的第一个元素
                        GameData.battleData.StaffObj.splice(0, 1);
                        if (GameData.battleData.StaffObj.length == 0) {
                            //两个站位槽都为空
                            Utils.getSpriteFrame("ui/prepare/prepare_empty_slot", this.player_slot_1.getComponent(Sprite));
                            Utils.getSpriteFrame("ui/prepare/prepare_empty_slot", this.player_slot_2.getComponent(Sprite));
                        } else {
                            Utils.getSpriteFrame("ui/prepare/prepare_empty_slot", this.player_slot_1.getComponent(Sprite));
                        }
                    }
                    if (choose_staff_data.id === GameData.battleData.StaffObj[1]?.id) {
                        //移除GameData.battleData.StaffObj的第二个元素
                        GameData.battleData.StaffObj.splice(1, 1);
                        Utils.getSpriteFrame("ui/prepare/prepare_empty_slot", this.player_slot_2.getComponent(Sprite));
                    }
                } else {
                    if (GameData.battleData.StaffObj.length == 0) {
                        //两个站位槽都为空
                        Utils.getSpriteFrame("ui/staff_card/" + choose_staff_data.icon_id, this.player_slot_1.getComponent(Sprite));
                        GameData.battleData.StaffObj.push(choose_staff_data);
                    } else if (GameData.battleData.StaffObj.length == 1) {
                        //只有一个站位槽为空
                        //检查第一个槽位是否被占用
                        if (this.player_slot_1.getComponent(Sprite).spriteFrame?.name == "prepare_empty_slot") {
                            Utils.getSpriteFrame("ui/staff_card/" + choose_staff_data.icon_id, this.player_slot_1.getComponent(Sprite));
                            //始终保持GameData.battleData.StaffObj[0]对应第一个站位槽
                            GameData.battleData.StaffObj[1] = GameData.battleData.StaffObj[0];
                            GameData.battleData.StaffObj[0] = choose_staff_data;
                        }
                        else {
                            Utils.getSpriteFrame("ui/staff_card/" + choose_staff_data.icon_id, this.player_slot_2.getComponent(Sprite));
                            GameData.battleData.StaffObj.push(choose_staff_data);
                        }
                    } else {
                        //两个站位槽都已满，替换第一个槽位
                        Utils.getSpriteFrame("ui/staff_card/" + choose_staff_data.icon_id, this.player_slot_1.getComponent(Sprite));
                        GameData.battleData.StaffObj[0] = choose_staff_data;
                    }
                    GameData.userDataProxy.selectedStaff = null;
                }
                oops.message.dispatchEvent(GameEvent.UpdateStaffChooseList, choose_staff_data.id);
                if (GameData.battleData.StaffObj.length == 2) {
                    //已满员
                    this.one_click_btn.getChildByName("Label").getComponent(Label).string = "开始战斗";
                } else {
                    this.one_click_btn.getChildByName("Label").getComponent(Label).string = "一键上阵";
                }
            }
        });
        this.player_slot_1.on(Node.EventType.TOUCH_END, () => {
            this.choose_panel.active = true;
            this.choose_btn.active = true;
            oops.message.dispatchEvent(GameEvent.UpdateStaffChooseList);
        });
        this.player_slot_2.on(Node.EventType.TOUCH_END, () => {
            this.choose_panel.active = true;
            this.choose_btn.active = true;
            oops.message.dispatchEvent(GameEvent.UpdateStaffChooseList);
        });
        //一键上阵按钮
        this.one_click_btn.on(Node.EventType.TOUCH_END, () => {
            if (this.waitStaffList.length == 0) {
                this.waitStaffList = GameData.userDataProxy.stafflist;
            }
            if (GameData.battleData.StaffObj.length == 2) {
                //已满员,可以战斗
                oops.gui.open(UIID.BattleView, this.config);
                return;
            } else if (GameData.battleData.StaffObj.length == 1) {
                //从待选列表中移除已上阵的员工
                this.waitStaffList = this.waitStaffList.filter(item => {
                    // 检查是否已上阵
                    for (let staff of GameData.battleData.StaffObj) {
                        if (item.id === staff.id) {
                            return false;
                        }
                    }
                    return true;
                });
            }

            //从GameData.battleData.WaitStaffList中随机选择员工
            for (let i = GameData.battleData.StaffObj.length; i < 2; i++) {
                let staff_data = this.waitStaffList[Math.floor(Math.random() * this.waitStaffList.length)];
                if (GameData.battleData.StaffObj.length == 0) {
                    Utils.getSpriteFrame("ui/staff_card/" + staff_data.icon_id, this.player_slot_1.getComponent(Sprite));
                    GameData.battleData.StaffObj.push(staff_data);
                    //从待选择列表中移除该员工
                    this.waitStaffList = this.waitStaffList.filter(item => item.id !== staff_data.id);
                } else if (GameData.battleData.StaffObj.length == 1) {
                    if (this.player_slot_2.getComponent(Sprite).spriteFrame?.name == "prepare_empty_slot") {
                        Utils.getSpriteFrame("ui/staff_card/" + staff_data.icon_id, this.player_slot_2.getComponent(Sprite));
                        GameData.battleData.StaffObj[1] = staff_data;
                    } else {
                        Utils.getSpriteFrame("ui/staff_card/" + staff_data.icon_id, this.player_slot_1.getComponent(Sprite));
                        GameData.battleData.StaffObj[1] = GameData.battleData.StaffObj[0];
                        GameData.battleData.StaffObj[0] = staff_data;
                    }
                }
            }
            this.waitStaffList = [];
            this.one_click_btn.getChildByName("Label").getComponent(Label).string = "开始战斗";
        })

        // 设置关卡名称
        if (this.level_name) {
            this.level_name.getComponent(Label).string = "第" + this.config.level_num + "关";
        }
        this.InitIce();
        this.InitEnemy();
    }

    //生成待选择员工列表
    ctorStaffList() {
        for (let i = 0; i < this.staffWaitList.length; i++) {
            this.staffWaitList[i].destroyAllChildren();
        }
        //所有已拥有员工
        GameData.battleData.WaitStaffList = GameData.userDataProxy.stafflist;
        //排序
        this.waitStaffList = this.sortWaitStaffList(GameData.battleData.WaitStaffList);
        GameData.battleData.WaitStaffList = this.waitStaffList;
        for (let index = 0; index < this.waitStaffList.length; index++) {
            let staff_data = this.waitStaffList[index];
            // console.log("staff_data -->", JSON.stringify(staff_data));
            //创建员工icon
            this.StaffIcon(staff_data, index);
        }

    }
    //待选择列表排序,按照品质和等级排序
    sortWaitStaffList(array) {
        //插入等级
        let lvlist = GameData.userDataProxy.staffLv;
        for (let index = 0; index < array.length; index++) {
            const staff = array[index];
            for (const key in lvlist) {
                if (key == staff.id) {
                    staff.lv = lvlist[key];
                }
            }
        }

        //插入排序
        function insertionSort(arr: any[]): any[] {
            // 对于数组的每一个元素，从它开始到0位置，比较该元素和前一个元素的大小
            for (let i = 1; i < arr.length; i++) {
                let current = arr[i];
                let j = i - 1;
                // 如果该元素大于前一个元素，那么前一个元素向后移动，并继续向前比较
                while (j >= 0 && current.quality > arr[j].quality) {
                    arr[j + 1] = arr[j];
                    j--;
                }
                while (
                    j >= 0 &&
                    current.quality == arr[j].quality &&
                    current.lv > arr[j].lv
                ) {
                    arr[j + 1] = arr[j];
                    j--;
                }
                // 如果该元素小于前一个元素，那么它将放到合适的位置
                arr[j + 1] = current;
            }
            return arr;
        }
        let waitlist = insertionSort(array);
        return waitlist;
    }
    //生成待选择员工icon
    public StaffIcon(data: any, index) {
        //实例化预制体
        let staff = instantiate(this.staff_icon);

        //图标
        let staff_sp = staff.getChildByName("icon").getComponent(Sprite);
        let icon_id = data.icon_id;
        Utils.getSpriteFrame("ui/staff_head/" + icon_id, staff_sp);
        //名称文本
        let name_txt = staff.getChildByName("name").getComponent(Label);
        name_txt.string = data.name;
        //上阵标示
        let sign = staff.getChildByName("sign");
        sign.active = false;
        //选中框
        let select_frame = staff.getChildByName("select_frame");
        select_frame.active = false;

        //添加到列表节点下
        this.staffWaitList[index].addChild(staff);
        staff.position = v3(0, 0, 0);

        //添加触摸事件
        let staff_ctr = staff.getChildByName("icon").addComponent(TouchCtorControllers);
        staff_ctr.init(index, data);
    }
    // 加载冰雕图片
    private InitIce() {
        // 检查节点是否存在
        if (!this.ice_1 || !this.ice_2) {
            console.error("冰雕节点未正确绑定");
            return;
        }

        // 检查Sprite组件是否存在
        const sprite1 = this.ice_1.getComponent(Sprite);
        const sprite2 = this.ice_2.getComponent(Sprite);
        if (!sprite1 || !sprite2) {
            console.error("冰雕节点缺少Sprite组件");
            return;
        }
        try {
            Utils.getSpriteFrame("ui/ice/" + this.config.level_config.ice_id[0], sprite1);
            Utils.getSpriteFrame("ui/ice/" + this.config.level_config.ice_id[1], sprite2);
        } catch (e) {
            console.error("加载冰雕图片失败:", e);
        }
        //设置content的位置
        let content = this.ice_1.parent
        if (content) {
            content.setPosition(0, 125);
        }
    }
    //加载敌人图片
    private InitEnemy() {
        Utils.getSpriteFrame("ui/staff_card/" + this.config.level_config.enemy_id[0], this.enemy_slot_1.getComponent(Sprite));
        Utils.getSpriteFrame("ui/staff_card/" + this.config.level_config.enemy_id[1], this.enemy_slot_2.getComponent(Sprite));
    }
    private close() {
        if (this.choose_panel.active) {
            this.choose_panel.active = false;
            this.choose_btn.active = false;
            return;
        }
        GameData.battleData.StaffObj = [];
        GameData.battleData.WaitStaffList = [];
        GameData.userDataProxy.selectedStaff = null;
        oops.gui.removeByNode(this.node);
    }
    private onHandler(event: string, args: any) {
        //处理事件，更新上阵按钮状态
        this.choose_btn.getChildByName("Label").getComponent(Label).string = args;
    }
}