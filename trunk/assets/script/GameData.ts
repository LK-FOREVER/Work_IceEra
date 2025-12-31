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

    static taskData = {
        continuousTaskId: 0,
        continueTaskContentNumList: [0, 0, 0, 0, 0],
        dailyTaskContentNumStatus: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        dailyTaskContentNumList: [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    };
    static userData = {
        account: "111",
        nickName: "玩家_111",
        inviteNum: 1, //招募员工数量
        randomItemList: [], //招聘员工的列表
        inviteTodayFreeMaxNum: 1, //每日免费招募员工总次数
        inviteTodayFreeLastNum: 1, //每日免费招募员工剩余次数
        inviteNumTotalOrange: 50, //距离必得橙色员工的次数
        inviteNumDefaultTotal: 50, //默认必得保底员工的次数
        inviteLimiteDailyTotalNum: 30, //每日最多可招募次数
        inviteLimiteDailyNum: 0, //当日已招募次数
        orangeStaff: 0, //橙色员工概率
        goods_list: {
            1001:0,
            1002:0,
            1003:0,
            1004:100,//招募令
            1005:0,
            1006:0,
            1007:0,
            1008:0,
            1009:0,
            1010:0,
            1011:0,
            1012:0,
            1013:0,
            1014:0,
            1015:0,
            1016:0,
            1017:0,
            1018:0,
            1019:0,
            1020:0,
            1021:0,
            1022:0,
            1023:0,
            1024:10,//体力，能量
        },
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
            5001: 0,
            5002: 0,
            5003: 0,
            5004: 0,
            5005: 0,
            5006: 0,
            5007: 0,
            5008: 0,
            5009: 0,
            5010: 0,
            5011: 0,
            5012: 0,
            5013: 0,
            5014: 0,
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
        //拥有员工列表,quality:1-紫色，2-橙色
        stafflist: [
            { "id": 4001, "name": "红帽爱娜", "quality": 1, "card_id": 4001, "debris_id": 5001, "head_id": 6001,"whole_id": 7001, "ability": 57,"introduce":"红帽爱娜是一个非常有才华的员工，她的能力值为57。" },
            { "id": 4002, "name": "眼镜龙", "quality": 1, "card_id": 4002, "debris_id": 5002, "head_id": 6002, "whole_id": 7002, "ability": 59 ,"introduce":"眼镜龙是一个非常有才华的员工，她的能力值为59。" },
            { "id": 4003, "name": "玩偶小贝", "quality": 1, "card_id": 4003, "debris_id": 5003, "head_id": 6003, "whole_id": 7003, "ability": 60 ,"introduce":"玩偶小贝是一个非常有才华的员工，她的能力值为60。" },
            { "id": 4004, "name": "蓝发艾琳", "quality": 1, "card_id": 4004, "debris_id": 5004, "head_id": 6004, "whole_id": 7004, "ability": 61 ,"introduce":"蓝发艾琳是一个非常有才华的员工，她的能力值为61。" },
            { "id": 4005, "name": "冒险家咕噜", "quality": 1, "card_id": 4005, "debris_id": 5005, "head_id": 6005, "whole_id": 7005, "ability": 78 ,"introduce":"冒险家咕噜是一个非常有才华的员工，她的能力值为78。" },
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
        static getUserData() {
        //获取一个key
        let strValue = sys.localStorage.getItem(GameData.userData.nickName + "userData");
        if (strValue != "undefined" && strValue != null) {
            try {
                const data = JSON.parse(strValue);
                return data;
                // 处理解析后的数据
            } catch (error) {
                console.error("解析 JSON 失败:", error);
                // 在这里处理错误，比如提供一个默认值或者抛出错误
            }
            // let data = JSON.parse(strValue);
            // console.log(data);

            // return data
        } else {
            return null;
        }
    }

    // 默认数据
    static defaultUserData = JSON.parse(JSON.stringify(GameData.userData));

    // 替换数据，如果本地数据存在，则合并数据，否则使用默认数据
    static replaceData() {
        this.userData = this.defaultUserData;
    }

    //存储玩家数据
    static setUserData() {
        let userStr = JSON.stringify(GameData.userData);
        //添加一个存储，key，value
        sys.localStorage.setItem(GameData.userData.nickName + "userData", userStr);
    }
}


