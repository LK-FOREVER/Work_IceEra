import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('recruit_view')
export class recruit_view extends Component {
    back_btn: Node = null!; // 返回按钮
    question_btn: Node = null!; // 详情按钮
    recruit_one_btn: Node = null!; // 招募一个按钮
    recruit_five_btn: Node = null!; // 招募五个按钮
    today_recruit_num: Node = null!; // 今日招募数量
    resume_num: Node = null!; // 简历数量
    tip_view: Node = null!; // 详情提示界面
    tip_close_btn: Node = null!; // 提示界面关闭按钮
    start() {
        this.back_btn = this.node.getChildByName("back_btn");
        this.question_btn = this.node.getChildByName("question_btn");
        this.recruit_one_btn = this.node.getChildByName("recruit_one_btn");
        this.recruit_five_btn = this.node.getChildByName("recruit_five_btn");
        this.today_recruit_num = this.node.getChildByName("today_recruit_num");
        this.resume_num = this.node.getChildByName("resume_bg").getChildByName("resume_num");
        this.tip_view = this.node.getChildByName("tip_view");
        this.tip_close_btn = this.tip_view.getChildByName("tip_close");
        // 绑定按钮点击事件
        this.back_btn.on(Node.EventType.TOUCH_END, this.on_back_btn_click, this);
        this.question_btn.on(Node.EventType.TOUCH_END, this.on_question_btn_click, this);
        this.recruit_one_btn.on(Node.EventType.TOUCH_END, this.on_recruit_one_btn_click, this);
        this.recruit_five_btn.on(Node.EventType.TOUCH_END, this.on_recruit_five_btn_click, this);
        this.tip_close_btn.on(Node.EventType.TOUCH_END, () => { this.tip_view.active = false; },);
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
    // 点击招募一个按钮
    on_recruit_one_btn_click() {
    }
    // 点击招募五个按钮
    on_recruit_five_btn_click() {
    }
}


