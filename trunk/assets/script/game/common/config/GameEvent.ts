/*
 * @Author: dgflash
 * @Date: 2021-11-23 15:28:39
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-26 16:42:00
 */

/** 游戏事件 */
export enum GameEvent {
    /** 游戏服务器连接成功 */
    GameServerConnected = "GameServerConnected",
    /** 登陆成功 */
    LoginSuccess = "LoginSuccess",
    /** 更新员工选择列表 */
    UpdateStaffChooseList = "UpdateStaffChooseList",
    /** 更新上阵按钮 */
    UpdateStaffChooseBtn = "UpdateStaffChooseBtn",
    /** 主界面物品栏 */
    UpdateGoodsList = "UpdateGoodsList",
    /** 更新关卡 */
    UpdateLevel = "UpdateLevel",
    /** 关闭商店 */
    CloseShop = "CloseShop",
}