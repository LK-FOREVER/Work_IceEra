import { _decorator, Component, Node, UITransform, Prefab, instantiate, Layout } from 'cc';
import { GameData } from '../../GameData';
import { recruitIconController } from './recruitIconController';
const { ccclass, property } = _decorator;

@ccclass('recruitEmployeeController')
export class recruitEmployeeController extends Component {
    mask: Node = null
    invite_reward_bg: Node = null
    inviteRewardContainer: Node = null
    rewardItemList: any[] = [];
    @property(Prefab)
    employee_icon: Prefab = null
    async start() {
        this.mask = this.node.getChildByName("mask");
        this.mask.on(Node.EventType.TOUCH_END, this.onMaskClick, this);
        this.invite_reward_bg = this.node.getChildByName("invite_reward_bg");
        this.inviteRewardContainer = this.invite_reward_bg.getChildByName("inviteRewardContainer");
        this.rewardItemList = GameData.userData.randomItemList

        let rewardCount = 0;
        const layout = this.inviteRewardContainer.getComponent(Layout);
        // layout.paddingLeft = this.rewardItemList.length == 1 ? 240: -200;

        // Use for..of so we can await async init calls
        for (const reward_item of this.rewardItemList) {
            rewardCount++;
            const employee_icon = instantiate(this.employee_icon);
            if (rewardCount % 2 == 0) {
                employee_icon.setPosition(employee_icon.position.x, -100);
            } else {
                employee_icon.setPosition(employee_icon.position.x, 0);
            }
            await employee_icon.getComponent(recruitIconController).init(reward_item.reward.k, reward_item.reward.v, reward_item.reward.stuff_id);
            employee_icon.setParent(this.inviteRewardContainer);
        }
    }
    onMaskClick() {
        this.node.active = false;
    }
}


