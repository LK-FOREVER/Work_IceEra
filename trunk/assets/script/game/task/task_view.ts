import { Button } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { UIID } from '../common/config/GameUIConfig';
import { GameComponent } from '../../../../extensions/oops-plugin-framework/assets/module/common/GameComponent';
import { ProgressBar } from 'cc';
import { Slider } from 'cc';
import { Prefab } from 'cc';
import Utils from '../../utils/Utils';
import { instantiate } from 'cc';
import { task_item } from './task_item';
import { ScrollView } from 'cc';
import { Sprite } from 'cc';
import { resources } from 'cc';
import { SpriteFrame } from 'cc';
import { Label } from 'cc';
import { Color } from 'cc';
import { color } from 'cc';
const { ccclass, property } = _decorator;

// 任务类型的枚举
enum TaskType {
    Daily, // 日常任务
    Weekly // 周常任务
};

@ccclass('task_view')
export class task_view extends GameComponent {
    // 任务标签
    @property(Prefab)
    task_items: Prefab = null;


    // 当前显示的任务类型
    task_type_currently: TaskType = TaskType.Daily;
    // 当每日任务奖励进度条对象
    task_daily_progress: Node = null;
    // 当前任务空列表
    task_scroll: Node = null;

    // 记录宝箱开启状态图
    @property(SpriteFrame)
    close_sprite: SpriteFrame = null;
    @property(SpriteFrame)
    open_sprite: SpriteFrame = null;
    // 存储所有宝箱的数组
    daily_reward_box_array: Node[] = [];
    weekly_reward_box_array: Node[] = [];
    start() {

        // 关闭按钮逻辑
        const close_btn = this.node.getChildByName("close_btn");
        close_btn.on(Button.EventType.CLICK, this.close_handler, this);
        // 点击边缘mask区域关闭窗口
        const mask = this.node.getChildByName("mask");
        mask.on(Node.EventType.TOUCH_END, this.close_handler, this);

        // 根据当前任务类型初始化窗口
        this.swicth_task_type(this.task_type_currently);

        // 初始化日常与周常任务的配表信息
        this.update_task_scroll(TaskType.Daily);
        this.update_task_scroll(TaskType.Weekly);
        // 初始化当前进度条对象
        // this.task_daily_progress = this.node.getChildByName("task_daily_layer").getChildByName("task_box_bg").getChildByName("task_item_progress_bg");

        // 初始化宝箱状态
        this.init_reward_state();

    }

    /**
    * 点击日常任务按钮时触发
    */
    daily_btn_clicked_hander() {
        if (this.task_type_currently === TaskType.Daily) {
            return;
        }
        this.swicth_task_type(TaskType.Daily);// 切换窗口
    }
    /**
     * 点击周常任务时触发
     */
    weekly_btn_clicked_hander() {
        if (this.task_type_currently === TaskType.Weekly) {
            return;
        }
        this.swicth_task_type(TaskType.Weekly);// 切换窗口
    }

    /**
     * 日常/周常窗口切换
     * @param task_type 要切换到的任务类型的枚举
     */
    swicth_task_type(task_type: TaskType) {
        // 切换图层
        this.switch_task_layer(task_type);
        // 切换按钮的ui
        this.switch_btn_ui(task_type);
        // 记录当前界面状态
        this.task_type_currently = task_type;
    }

    /**
     * 获取并更新任务的配表信息
     * @param task_type 任务类型的枚举
     */
    update_task_scroll(task_type: TaskType) {
        let task_conf_list: Record<string, any> = null;
        // 判断任务类型，获取不同的任务列表与json
        switch (task_type) {
            case TaskType.Daily:
                // 获取任务列表区域
                this.task_scroll = this.node.getChildByName("task_daily_layer").getChildByName("task_scroll");
                // 获取任务json
                task_conf_list = Utils.getJsonAsset("config/data/task__get_task_daily_conf").json;
                break;
            case TaskType.Weekly:
                this.task_scroll = this.node.getChildByName("task_weekly_layer").getChildByName("task_scroll");
                task_conf_list = Utils.getJsonAsset("config/data/task__get_task_weekly_conf").json;
                break;
        }
        // 再放置
        task_conf_list.forEach(tasks_conf => {
            const task_daily_node = instantiate(this.task_items);
            task_daily_node.getComponent(task_item).init(tasks_conf.task_name, tasks_conf.task_reward_num);
            task_daily_node.setParent(this.task_scroll.getComponent(ScrollView).content);
        });
    }

    /**
     * 切换按钮的ui
     * @param task_type 任务类型的枚举
     */
    switch_btn_ui(task_type: TaskType) {
        // 获取两个按钮节点
        let daily_btn = this.node.getChildByName("task_daily_btn");
        let weekly_btn = this.node.getChildByName("task_weekly_btn");
        let selected_color = new Color(255, 255, 255);
        let unselected_color = new Color(63, 159, 255);
        switch (task_type) {
            case TaskType.Daily:
                // 改变图片样式
                Utils.getSpriteFrame("ui/task/task_selected_tag", daily_btn.getComponent(Sprite));
                Utils.getSpriteFrame("ui/task/task_unselected_tag", weekly_btn.getComponent(Sprite));
                // 改变文字颜色
                daily_btn.getChildByName("task_daily_label").getComponent(Label).color = selected_color;
                weekly_btn.getChildByName("task_weekly_label").getComponent(Label).color = unselected_color;
                break;
            case TaskType.Weekly:
                Utils.getSpriteFrame("ui/task/task_unselected_tag", daily_btn.getComponent(Sprite));
                Utils.getSpriteFrame("ui/task/task_selected_tag", weekly_btn.getComponent(Sprite));
                daily_btn.getChildByName("task_daily_label").getComponent(Label).color = unselected_color;
                weekly_btn.getChildByName("task_weekly_label").getComponent(Label).color = selected_color;
                break;
        }
    }

    /**
     * 切换界面的活动状态
     * @param task_type 任务类型的枚举
     */
    switch_task_layer(task_type: TaskType) {
        // 设置界面的活动状态
        this.node.getChildByName("task_daily_layer").active = (task_type === TaskType.Daily ? true : false);
        this.node.getChildByName("task_weekly_layer").active = (task_type === TaskType.Weekly ? true : false);
    }

    /**
     * 初始化宝箱状态，并绑定点击事件
     */
    init_reward_state() {
        // 遍历所有日常任务的奖励宝箱，置入数组中，并依次绑定点击事件函数
        this.node.getChildByName("task_daily_layer").getChildByName("task_box_bg")
            .getChildByName("task_reward").children.forEach(child => {
                if (child.getComponent(Button)) {
                    this.daily_reward_box_array.push(child);
                    const button = child.getComponent(Button);
                    button.node.on(Button.EventType.CLICK, () => this.on_box_clicked(child), this);
                }
            });
        this.node.getChildByName("task_weekly_layer").getChildByName("task_box_bg")
            .getChildByName("task_reward").children.forEach(child => {
                if (child.getComponent(Button)) {
                    this.daily_reward_box_array.push(child);
                    const button = child.getComponent(Button);
                    button.node.on(Button.EventType.CLICK, () => this.on_box_clicked(child), this);
                }
            });
        // 获取所有子节点的宝箱

        // // 获取当前奖励进度条的进度 *100 方便后续阅读
        // let tempnum: number = this.task_daily_progress.getComponent(ProgressBar).progress * 100;

        // // 整除20可以知道要打开多少个宝箱
        // tempnum = ~~(tempnum / 20);
        // for (let i = 0; i < tempnum; i++) {
        //     let task_reward_box = this.node.getChildByName("task_daily_layer").getChildByName('task_box_bg').getChildByName('task_reward').getChildByName(`task_box${i * 20 + 20}`);
        //     Utils.getSpriteFrame("ui/task/task_box_open", task_reward_box.getComponent(Sprite));
        // }
    }

    /**
     * 宝箱点击事件
     * @param box_node 宝箱节点
     */
    on_box_clicked(box_node: Node) {
        box_node.getComponent(Sprite).spriteFrame = this.open_sprite;
    }
    /**
     *  关闭当前任务窗口
     */
    close_handler() {
        oops.gui.remove(UIID.TaskView);
    }

    update(deltaTime: number) {

    }
}


