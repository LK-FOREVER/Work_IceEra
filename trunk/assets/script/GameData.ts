import { sys } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { oops } from '../../extensions/oops-plugin-framework/assets/core/Oops';
const { ccclass, property } = _decorator;

@ccclass('GameData')
export class GameData extends Component {
    static _Instance = null;

    static get Instance() {
        if (this._Instance === null) {
            this._Instance = new GameData()
        }
        return this._Instance
    }

    static userData = {
        account: "111",
        nickName: "玩家_111",
        goods_list: [
            { id: 1001, number: 0 },
            { id: 1002, number: 0 },
            { id: 1003, number: 0 },
            { id: 1004, number: 0 },
            { id: 1005, number: 0 },
            { id: 1006, number: 0 },
            { id: 1007, number: 0 },
            { id: 1008, number: 0 },
            { id: 1009, number: 0 },
            { id: 1010, number: 0 },
            { id: 1011, number: 0 },
            { id: 1012, number: 0 },
            { id: 1013, number: 0 },
            { id: 1014, number: 0 },
            { id: 1015, number: 0 },
            { id: 1016, number: 0 },
            { id: 1017, number: 0 },
            { id: 1018, number: 0 },
            { id: 1019, number: 0 },
            { id: 1020, number: 0 },
            { id: 1021, number: 0 },
            { id: 1022, number: 0 },
            { id: 1023, number: 0 },
        ]
    }

    //获取玩家数据
    static getLocalUserData() {
        //获取一个key
        let strValue = sys.localStorage.getItem("userData");
        // console.log("strValue", sys.localStorage.getItem("userData"));

        if (strValue != "undefined" && strValue != null) {
            try {
                const data = JSON.parse(strValue);
                return data;
                // 处理解析后的数据
            } catch (error) {
                console.error("解析 JSON 失败:", error);
                return null;
            }
        } else {
            return null;
        }
    }

    // 默认数据
    static defaultUserData = JSON.parse(JSON.stringify(GameData.userData));

    // 替换数据
    static replaceData() {
        GameData.userData = GameData.defaultUserData;
    }

    /** 存储玩家数据 */
    static setUserData() {
        let userStr = JSON.stringify(GameData.userData);
        //添加一个存储，key，value
        sys.localStorage.setItem("userData", userStr);
        // oops.message.dispatchEvent(EventCounts.UPDATE_SHOP)
    }
}


