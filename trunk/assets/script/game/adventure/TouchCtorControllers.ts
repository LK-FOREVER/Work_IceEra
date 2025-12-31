import { _decorator, Component, Node, v3, Vec3, UITransform, find, Collider2D, Contact2DType, BoxCollider2D, IPhysics2DContact, resources, Prefab, instantiate, SpriteFrame, Sprite, macro, Label } from "cc";
import { GameData } from "../../GameData";
import { oops } from "db://oops-framework/core/Oops";
import { GameEvent } from "../common/config/GameEvent";
const { ccclass, property } = _decorator;
//拖动生成
@ccclass("TouchCtorControllers")
export class TouchCtorControllers extends Component {
    staff_data: any;
    staffList: any[];    //待选择员工列表
    onLoad() {
        // 监听全局事件
        oops.message.on(GameEvent.UpdateStaffChooseList, this.onHandler, this);
    }

    protected onDestroy() {
        // 对象释放时取消注册的全局事件
        oops.message.off(GameEvent.UpdateStaffChooseList, this.onHandler, this);
    }
    init(index, data) {
        this.staff_data = data;
        //获取待选择员工列表
        this.staffList = this.node.parent.parent.parent.children;

        this.node.on(Node.EventType.TOUCH_END, this._touchend, this);
    }

    _touchend(event) {
        GameData.userData.selectedStaff = this.staff_data;//将当前待选择员工数据保存到全局变量中

        //显示选中框,只显示当前选中的员工，其他员工的选中框隐藏
        for (let i = 0; i < this.staffList.length; i++) {
            let staff = this.staffList[i];//获取员工节点
            if (staff.children.length > 0) {
                let select_frame = staff.getChildByName("staff_icon").getChildByName("select_frame");//获取选中框节点
                select_frame.active = staff === this.node.parent.parent;//如果是当前员工，选中框显示，否则隐藏
            }
        }
        //选中的是已上阵员工
        if (this.staff_data.id === GameData.battleData.StaffObj[0]?.id || this.staff_data.id === GameData.battleData.StaffObj[1]?.id) {
            oops.message.dispatchEvent(GameEvent.UpdateStaffChooseBtn, "替换");
        } else {
            oops.message.dispatchEvent(GameEvent.UpdateStaffChooseBtn, "上阵");
        }
    }

    private onHandler(event: string, choose_staff_id: number) {
        //处理事件，更新待选择员工列表
        if (this.staff_data.id === GameData.battleData.StaffObj[0]?.id || this.staff_data.id === GameData.battleData.StaffObj[1]?.id) {
            this.node.parent.getChildByName("select_frame").active = false;//隐藏选中框
            this.node.parent.getChildByName("sign").active = true;//显示已上阵标志
            return;
        } else {
            this.node.parent.getChildByName("select_frame").active = false;//隐藏选中框
            this.node.parent.getChildByName("sign").active = false;//隐藏已上阵标志
        }
    }
}