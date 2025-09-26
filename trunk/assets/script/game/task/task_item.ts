import { Label } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { GameComponent } from 'db://oops-framework/module/common/GameComponent';
const { ccclass, property } = _decorator;

@ccclass('task_item')
export class task_item extends GameComponent {
    private task_name_node: Node = null;
    private task_reward_num_node: Node = null;
    /**
     * 初始化任务标签
     * @param task_name 任务条件
     * @param task_reward_num 任务奖励
     */
    init(task_name: string,task_reward_num:number)
    {
        this.task_name_node = this.node.getChildByName('task_item_name_label');
        this.task_reward_num_node = this.node.getChildByName('task_item_reward_label');

        this.task_name_node.getComponent(Label).string = task_name;
        this.task_reward_num_node.getComponent(Label).string = task_reward_num.toString();
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}


