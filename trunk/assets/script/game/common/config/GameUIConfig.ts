/*
 * @Date: 2021-08-12 09:33:37
 * @LastEditors: dgflash
 * @LastEditTime: 2023-02-15 09:38:36
 */

import { LayerType } from "db://oops-framework/core/gui/layer/LayerEnum";
import { UIConfig } from "db://oops-framework/core/gui/layer/UIConfig";

/** 界面唯一标识（方便服务器通过编号数据触发界面打开） */
export enum UIID {
    /** 资源加载界面 */
    Loading = 1,
    /** 提示弹出窗口 */
    Alert,
    /** 确认弹出窗口 */
    Confirm,
    /** 登录 */
    LoginView,
    /** 主页 */
    MainView,
    /** 员工 */
    StaffView,
    /** 排行榜 */
    RankView,
    /** 设置 */
    SettingView,
    /** 任务 */
    TaskView,
    /** 好友 */
    FriendView,
    /** 关卡挑战提示 */
    LevelInfoView,
    /** 准备选择员工界面 */
    PrepareView,
    /** 战斗界面 */
    BattleView,
    /** 战斗胜利界面 */
    BattleWinView,
    /** 战斗失败界面 */
    BattleFailView,
}

/** 打开界面方式的配置数据 */
export var UIConfigData: { [key: number]: UIConfig } = {
    [UIID.Loading]: { layer: LayerType.UI, prefab: "gui/loading/loading" },
    [UIID.Alert]: { layer: LayerType.Dialog, prefab: "common/prefab/alert" },
    [UIID.Confirm]: { layer: LayerType.Dialog, prefab: "common/prefab/confirm" },
    [UIID.LoginView]: { layer: LayerType.UI, prefab: "gui/login/login_view" },
    [UIID.MainView]: { layer: LayerType.UI, prefab: "gui/main/main_view" },
    [UIID.StaffView]: { layer: LayerType.UI, prefab: "gui/staff/staff_view" },
    [UIID.RankView]: { layer: LayerType.UI, prefab: "gui/rank/rank_view" },
    [UIID.SettingView]: { layer: LayerType.UI, prefab: "gui/setting/setting_view" },
    [UIID.TaskView]: { layer: LayerType.UI, prefab: "gui/task/task_view" },
    [UIID.FriendView]: { layer: LayerType.UI, prefab: "gui/friend/friend_view" },
    [UIID.LevelInfoView]: { layer: LayerType.UI, prefab: "gui/adventure/level_info_view" },
    [UIID.PrepareView]: { layer: LayerType.UI, prefab: "gui/adventure/prepare_view" },
    [UIID.BattleView]: { layer: LayerType.UI, prefab: "gui/adventure/battle_view" },
    [UIID.BattleWinView]: { layer: LayerType.UI, prefab: "gui/adventure/battle_win_view" },
    [UIID.BattleFailView]: { layer: LayerType.UI, prefab: "gui/adventure/battle_fail_view" },
}