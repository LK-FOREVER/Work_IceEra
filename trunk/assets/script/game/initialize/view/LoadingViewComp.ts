import { _decorator } from "cc";
import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { CCVMParentComp } from "../../../../../extensions/oops-plugin-framework/assets/module/common/CCVMParentComp";
import { ModuleUtil } from "../../../../../extensions/oops-plugin-framework/assets/module/common/ModuleUtil";
import { smc } from "../../common/SingletonModuleComp";
import { UIID } from "../../common/config/GameUIConfig";
import { LoginView } from "../../account/view/LoginView";

const { ccclass, property } = _decorator;

/** 游戏资源加载 */
@ccclass('LoadingViewComp')
@ecs.register('LoadingView', false)
export class LoadingViewComp extends CCVMParentComp {
    /** VM 组件绑定数据 */
    data: any = {
        /** 加载资源当前进度 */
        finished: 0,
        /** 加载资源最大进度 */
        total: 0,
        /** 加载资源进度比例值 */
        progress: "0",
        /** 加载流程中提示文本 */
        prompt: ""
    };

    /** 加载文件夹的名称 要和loadGameRes一一对应 */
    private loadNameList: Array<string> = [
        "game",
        "ui",
        "texture",
        "config",
    ];

    private progress: number = 0;
    /** 加载完成数量 */
    private loadFinishNum: number = 0;

    start() {
        this.enter();
    }

    enter() {
        this.loadRes();
    }

    /** 加载资源 */
    private async loadRes() {
        this.data.progress = 0;
        await this.loadCustom();
        this.loadGameRes();
    }

    /** 加载游戏本地JSON数据（自定义内容） */
    private loadCustom() {
        // 加载游戏本地JSON数据的多语言提示文本
        this.data.prompt = oops.language.getLangByID("loading_load_json");
    }

    /** 加载初始游戏内容资源 */
    private loadGameRes() {
        // 加载初始游戏内容资源的多语言提示文本
        this.data.prompt = oops.language.getLangByID("loading_load_game");
        oops.res.loadDir("game", this.onProgressCallback.bind(this), this.onLoadFinishHandler.bind(this));
        oops.res.loadDir("bundle_1", "ui", this.onProgressCallback.bind(this), this.onLoadFinishHandler.bind(this));
        oops.res.loadDir("bundle_1", "texture", this.onProgressCallback.bind(this), this.onLoadFinishHandler.bind(this));
        oops.res.loadDir("config", this.onProgressCallback.bind(this), this.onLoadFinishHandler.bind(this));
    }

    /** 单个资源加载完成事件 */
    private onLoadFinishHandler() {
        this.loadFinishNum++
        if (this.loadNameList && this.loadFinishNum === this.loadNameList.length) {
            this.onCompleteCallback()
        }
    }

    /** 加载进度事件 */
    private onProgressCallback(finished: number, total: number, item: any) {
        // 计算当前资源加载进度
        var progress = finished / total;

        // 计算整体加载进度，结合已加载完成的资源数量和当前资源的加载进度
        const loadProgress = this.loadFinishNum * 100 / this.loadNameList.length + progress / this.loadNameList.length * 100;

        // 如果数据对象存在，则更新其完成进度和总进度
        if (this.data) {
            this.data.finished = loadProgress;
            this.data.total = 100;
        }

        // 如果当前计算的进度大于已记录的进度，则更新进度并格式化数据对象中的进度值
        if (loadProgress > this.progress) {
            this.progress = loadProgress;
            if (this.data) {
                this.data.progress = loadProgress.toFixed(2); // 保留两位小数
            }
        }
    }

    /** 加载完成事件 */
    private async onCompleteCallback() {
        // 获取用户信息的多语言提示文本
        this.data.prompt = oops.language.getLangByID("loading_load_player");
        await ModuleUtil.addViewUiAsync(smc.account, LoginView, UIID.LoginView);
        ModuleUtil.removeViewUi(this.ent, LoadingViewComp, UIID.Loading);
    }

    reset(): void { }
}