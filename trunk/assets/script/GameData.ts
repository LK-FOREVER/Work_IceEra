import { sys } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { oops } from '../../extensions/oops-plugin-framework/assets/core/Oops';
import { GameStorageConfig } from './game/common/config/GameStorageConfig';
const { ccclass, property } = _decorator;

type GameStruct = {
    //战斗中已站位员工
    StaffObj: any[];
    //待选择员工列表
    WaitStaffList: any[];
}

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
            { id: 1024, number: 10 }//体力，能量
        ],
        //已解锁建筑
        builds: [
            {
                lock: true,
            },
            {
                lock: true,
            },
            {
                lock: true,
            },
            {
                lock: true,
            },
            {
                lock: false,
            },
            {
                lock: false,
            },
            {
                lock: false,
            },
            {
                lock: false,
            },
        ],
        // 员工碎片数量
        staffDebris: {
            4001: 0,
            4002: 0,
            4003: 0,
            4004: 0,
            4005: 0,
            4006: 0,
            4007: 0,
            4008: 0,
            4009: 0,
            4010: 0,
            4011: 0,
            4012: 0,
            4013: 0,
            4014: 0,
        },
        // 员工的等级
        staffLv: {
            4001: 1,
            4002: 1,
            4003: 1,
            4004: 1,
            4005: 1,
            4006: 0,
            4007: 0,
            4008: 0,
            4009: 0,
            4010: 0,
            4011: 0,
            4012: 0,
            4013: 0,
            4014: 0,
        },
        //拥有员工列表
        stafflist: [
            { "id": 4001, "name": "红帽爱娜", "quality": 1, "icon_id": 4001, "ability": 57 },
            { "id": 4002, "name": "眼镜龙", "quality": 1, "icon_id": 4002, "ability": 59 },
            { "id": 4003, "name": "玩偶小贝", "quality": 1, "icon_id": 4003, "ability": 60 },
            { "id": 4004, "name": "蓝发艾琳", "quality": 1, "icon_id": 4004, "ability": 61 },
            { "id": 4005, "name": "冒险家咕噜", "quality": 2, "icon_id": 4005, "ability": 78 },
        ],

        //冒险
        max_unlock_level: 1, //当前解锁的最大关卡数量
        selectedStaff: null, //当前选中的员工
        level_config: null, //所有的关卡配置adventure__get_level_conf
    }

    //战斗数据
    static battleData: GameStruct = {
        StaffObj: [],
        WaitStaffList: [],
    };

    //获取玩家数据
    static getLocalUserData() {
        //获取一个key
        let strValue = sys.localStorage.getItem(GameData.userDataProxy.account + "userData");
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
    // static replaceData() {
    //     GameData.userData = GameData.defaultUserData;
    // }
    // 合并数据
    /**
     * 合并本地数据与默认用户数据的方法
     * @param localData 本地存储的用户数据
     * @returns 合并后的用户数据
     */
    static mergeData(localData: any) {
        // 保留本地数据中的关键信息，同时使用默认数据作为基础
        const mergedData = {
            // 使用默认用户数据作为基础
            ...this.defaultUserData,
            // 覆盖默认数据中与本地数据相同的部分
            ...localData,
            // 特殊处理列表：合并默认和本地商品数据
            goods_list: this.defaultUserData.goods_list.map(item => {
                // 在本地数据中查找与当前默认商品ID相同的商品
                const localItem = localData.goods_list?.find(l => l.id === item.id);
                return localItem || item;
            })
        };
        this.userData = mergedData;
    }

    // 替换数据，如果本地数据存在，则合并数据，否则使用默认数据
    static replaceData() {
        // const localData = this.getLocalUserData();
        // if (localData && this.defaultUserData.account === localData.account) {
        //     this.mergeData(localData);
        // } else {
        this.userData = this.defaultUserData;
        // }
    }

    /** 存储玩家数据 */
    static setUserData() {
        let userStr = JSON.stringify(GameData.userData);
        //通过GameData.userDataProxy.account 作为key 存储玩家数据
        sys.localStorage.setItem(GameData.userDataProxy.account + "userData", userStr);
        // oops.message.dispatchEvent(EventCounts.UPDATE_SHOP)
    }

    //使用Proxy对象来监听数据的变化,当数据变化时,自动调用setUserData方法存储数据
    private static _userDataProxy = new Proxy(GameData.userData, {
        set(target, property, value) {
            target[property] = value;
            GameData.setUserData();
            return true;
        }
    });

    static get userDataProxy() {
        return this._userDataProxy;
    }
    private static deepProxy(obj: any) {
        if (Array.isArray(obj)) {
            return new Proxy(obj, {
                set(target, property, value) {
                    target[property] = value;
                    GameData.setUserData();
                    return true;
                },
                get(target, property) {
                    if (property === 'push' || property === 'pop') {
                        return (...args) => {
                            const result = Array.prototype[property].apply(target, args);
                            GameData.setUserData();
                            return result;
                        };
                    }
                    return target[property];
                }
            });
        }
        return new Proxy(obj, {
            set(target, property, value) {
                if (typeof value === 'object' && value !== null) {
                    value = GameData.deepProxy(value);
                }
                target[property] = value;
                GameData.setUserData();
                return true;
            }
        });
    }

    // 在初始化时创建深度代理
    static initUserDataProxy() {
        this._userDataProxy = this.deepProxy(this.userData);
    }

}


