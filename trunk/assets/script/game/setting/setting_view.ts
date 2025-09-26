import { Button } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { UIID } from '../common/config/GameUIConfig';
import { GameComponent } from '../../../../extensions/oops-plugin-framework/assets/module/common/GameComponent';
import { ProgressBar } from 'cc';
import { Slider } from 'cc';
const { ccclass, property } = _decorator;


@ccclass('setting_view')
export class setting_view extends GameComponent {
    BGM_progressBar: Node = null;
    SFX_progressBar: Node = null;
    start() {
        this.BGM_progressBar = this.node.getChildByName("BGM").getChildByName("BGM_slider").getChildByName("ProgressBar");
        this.SFX_progressBar = this.node.getChildByName("SFX").getChildByName("SFX_slider").getChildByName("ProgressBar");


        // 关闭按钮逻辑
        const close_btn = this.node.getChildByName("close_btn");
        close_btn.on(Button.EventType.CLICK, this.close_handler, this);
        // 点击边缘mask区域关闭窗口
        const mask = this.node.getChildByName("mask");
        mask.on(Node.EventType.TOUCH_END, this.close_handler, this);
    }
    

    close_handler() {
        oops.gui.remove(UIID.SettingView);
    }

    // 背景音乐滑动条发生改变时调用的函数
    BGM_slider_handler(event: Slider) {
        // 这里加0.03是为了ui显示
        this.BGM_progressBar.getComponent(ProgressBar).progress = event.progress + 0.03;
    }
    // 音效滑动条发生改变时调用的函数
    SFX_slider_handler(event: Slider) {
        // 这里加0.03是为了ui显示
        this.SFX_progressBar.getComponent(ProgressBar).progress = event.progress + 0.03;
    }
    update(deltaTime: number) {

    }

}


