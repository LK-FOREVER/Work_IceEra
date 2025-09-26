import { _decorator, Label, Color, tween, Vec3, Node } from "cc";
// import netManager from "../manager/net-work/netManager";
import { SpriteFrame } from "cc";
import { JsonAsset } from "cc";
import { oops } from "../../../extensions/oops-plugin-framework/assets/core/Oops";
import { UICallbacks } from "../../../extensions/oops-plugin-framework/assets/core/gui/layer/Defines";
// import { sp } from "cc";
import { UITransform } from "cc";
// import goods_controller from "../game/goods/controller/goods_controller";
import { Sprite } from "cc";
import dayjs from "dayjs";
/** 工具类，一些基础功能调用 */
export default class Utils {
    /**
     * 获取group类型的json数据时 通过id获取其列表。
     *
     * @param {Array<Object>} config - group类型的JSON数组。
     * @param {number} id - 要查找的id。
     * @returns {Array<Object>} - 返回对应列表，如果没有找到则返回空数组。
     */
    public static getGroupJsonById(config: any, id: any) {
        // 遍历heroConfig数组中的每个对象
        for (const entry of config) {
            // 遍历当前对象的所有键
            for (const key in entry) {
                // 检查对象是否有该键，并且键转换为整数后是否等于heroId
                if (entry.hasOwnProperty(key) && parseInt(key) === id) {
                    // 如果匹配，返回对应的提升列表
                    return entry[key];
                }
            }
        }
        // 如果没有找到匹配项，返回空数组
        return [];
    }

    /**
     * 加载已初始化的图片资源
     * @param assetsPath 资源路径
     * @param nodeSprite 需要加载的图片节点
     */
    public static getSpriteFrame(assetsPath: string, nodeSprite: Sprite): void {
        const url: string = `${assetsPath}/spriteFrame`;
        if (oops.res.get(url, SpriteFrame, "bundle_1") !== null) {
            nodeSprite.spriteFrame = oops.res.get(url, SpriteFrame, "bundle_1");
        } else {
            oops.res.load("bundle_1", url, SpriteFrame, (err: { message: any; }, spriteframe: SpriteFrame | null) => {
                if (err) {
                    console.warn(err.message)
                    return;
                }
                nodeSprite.spriteFrame = spriteframe
            });
        }
    }
    /**
     * 加载已初始化的json资源
     * @param assetsPath 资源路径
     */
    public static getJsonAsset(assetsPath: string): JsonAsset {
        const url: string = `${assetsPath}`;
        if (oops.res.get(url, JsonAsset) !== null) {
            return oops.res.get(url, JsonAsset);
        } else {
            let loadJsonAsset: JsonAsset | null = null
            oops.res.load(url, JsonAsset, (err: { message: any; }, jsonAsset: JsonAsset | null) => {
                if (err) {
                    loadJsonAsset = null
                    return console.warn(err.message);
                }
                loadJsonAsset = jsonAsset
            });
            return loadJsonAsset
        }
    }
    // /**
    //  * 获取某个道具当前拥有的数量
    //  * @param goods_id
    //  */
    // public static getGoodsNum(goods_id: number) {
    //     const goods_conf_list = Utils.getJsonAsset("config/data/goods__get_goods").json;
    //     const equip_conf_list = Utils.getJsonAsset("config/data/goods__get_equip_goods").json;
    //     const goods_conf = goods_conf_list.find(conf => conf.id === goods_id) || equip_conf_list.find(conf => conf.id === goods_id);
    //     const goods_list = goods_controller.Instance.get_model().bag_list.get(`type_${goods_conf.bag_type}`) || [];

    //     const num = goods_list.reduce((acc, goods_item: any) => {
    //         return goods_item.goods_id === goods_id ? acc + goods_item.num : acc;
    //     }, 0);

    //     return num;
    // }

    /** 弹窗动画 */
    public static getPopCommonEffect(callbacks?: UICallbacks) {
        let newCallbacks: UICallbacks = {
            // 节点添加动画
            onAdded: (node, params) => {
                node.setScale(0.9, 0.9, 0.9);
                tween(node)
                    .to(0.1, { scale: new Vec3(1.05, 1.05, 1.05) })
                    .to(0.05, { scale: new Vec3(1, 1, 1) })
                    .start();
            }
        }

        if (callbacks) {
            if (callbacks && callbacks.onAdded) {
                let onAdded = callbacks.onAdded;
                callbacks.onAdded = (node: Node, params: any) => {
                    onAdded(node, params);

                    // @ts-ignore
                    newCallbacks.onAdded(node, params);
                };
            }

            if (callbacks && callbacks.onBeforeRemove) {
                let onBeforeRemove = callbacks.onBeforeRemove;
                callbacks.onBeforeRemove = (node, params) => {
                    onBeforeRemove(node, params);

                    // @ts-ignore
                    newCallbacks.onBeforeRemove(node, params);
                };
            }
            return callbacks;
        }
        return newCallbacks;
    }

    /**
     * 根据英雄品质转换为文字
     * @param quality 品质类型
     */
    public static getHeroQualityText(quality: number): string {
        switch (quality) {
            case 1: return "精英";
            case 2: return "史诗";
            case 3: return "传奇";
            case 4: return "神话";
            default: return "未知";
        }
    }

    /**
     * 根据英雄类型转换为文字
     * @param quality 品质类型
     */
    public static getHeroTypeText(actor_type: number): string {
        switch (actor_type) {
            case 1: return "守护";
            case 2: return "近战";
            case 3: return "远程";
            default: return "未知";
        }
    }

    /**
     * 将数字格式化为带单位的形式（如 1000 变成 1k）
     * @param num 数字
     * @returns 格式化后的字符串
     */
    public static formatNumber(num: number): string {
        let formattedNum: string;
        let unit: string = '';

        if (num >= 1e9) {
            formattedNum = (num / 1e9).toFixed(2);
            unit = 'B';
        } else if (num >= 1e6) {
            formattedNum = (num / 1e6).toFixed(2);
            unit = 'M';
        } else if (num >= 1e3) {
            formattedNum = (num / 1e3).toFixed(2);
            unit = 'k';
        } else {
            formattedNum = num.toFixed(2);
        }

        // 去掉不必要的小数部分
        if (formattedNum.includes('.')) {
            const [integerPart, decimalPart] = formattedNum.split('.');
            if (decimalPart.startsWith('0')) {
                return integerPart + unit;
            } else {
                return `${integerPart}.${decimalPart[0]}${unit}`;
            }
        }

        return formattedNum + unit;
    }

    /**
     * 将数字格式化为带单位的形式（如 100000 变成 100k , 10000000 变成 10M）
     * @param num 数字
     * @returns 格式化后的字符串
     */
    public static formatNumber2(num: number): string {
        let formattedNum: string;
        let unit: string = '';

        if (num >= 1e8) {
            formattedNum = (num / 1e6).toFixed(0);
            unit = 'M';
        } else if (num >= 1e5) {
            formattedNum = (num / 1e3).toFixed(0);
            unit = 'K';
        } else {
            formattedNum = num.toFixed(0);
        }

        // 去掉不必要的小数部分
        if (formattedNum.includes('.')) {
            const [integerPart, decimalPart] = formattedNum.split('.');
            if (decimalPart.startsWith('0')) {
                return integerPart + unit;
            } else {
                return `${integerPart}.${decimalPart[0]}${unit}`;
            }
        }

        return formattedNum + unit;
    }

    /**
     * 将时间戳转换为年月日和时间
     * @param timestamp 时间戳（毫秒）
     * @returns 对象，包含年月日和时间
     */
    public static formatTimestamp(timestamp: number): { date: string, time: string } {
        const date = dayjs(timestamp * 1000);
        const formattedDate = date.format('YYYY-MM-DD');
        const formattedTime = date.format('HH:mm:ss');
        return { date: formattedDate, time: formattedTime };
    }

    // /**
    //  * 将时间戳转换为倒计时格式
    //  * @param timestamp 时间戳
    //  * @returns 倒计时格式的字符串，例如"01:02:03"
    //  */
    // public static convertToCountdown(timestamp: number): string {
    //     // 获取当前时间的时间戳
    //     const now = Utils.now() / 1000; // JavaScript时间戳是毫秒，需要转换为秒
    //     // 计算时间差（秒）
    //     const diff = timestamp - now;
    //     if (diff <= 0) {
    //         return "00:00:00";
    //     }

    //     // 将时间差转换为小时、分钟和秒
    //     const hours = Math.floor(diff / 3600);
    //     const minutes = Math.floor((diff % 3600) / 60);
    //     const seconds = Math.floor(diff % 60);

    //     // 格式化输出
    //     return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
    // }
    // /**
    //  * 将时间戳转换为倒计时格式 ------ 传递已过去的时间
    //  * @param timestamp 时间戳
    //  * @returns 倒计时格式的字符串，例如"01:02:03"
    //  */
    // public static convertToCountdown1(timestamp: number): string {
    //     // 获取当前时间的时间戳
    //     const now = Utils.now() / 1000; // JavaScript时间戳是毫秒，需要转换为秒
    //     // 计算时间差（秒）
    //     const diff = Math.abs(timestamp - now);
    //     // 将时间差转换为小时、分钟和秒
    //     const hours = Math.floor(diff / 3600);
    //     const minutes = Math.floor((diff % 3600) / 60);
    //     const seconds = Math.floor(diff % 60);

    //     // 格式化输出
    //     return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
    // }

    // 辅助函数，用于补零操作，例如将1变为01
    public static pad(num: number): string {
        return num < 10 ? '0' + num : num.toString();
    }

    //根据稀有度设置颜色
    public static setLabelColorByRarity(label: Label, rarity: number) {
        if (rarity === 1) {
            label.color = new Color("#929894"); //白
        } else if (rarity === 2) {
            label.color = new Color("#6eca90"); //绿
        } else if (rarity === 3) {
            label.color = new Color("#78a1cf"); //蓝
        } else if (rarity === 4) {
            label.color = new Color("#B374E6"); //紫
        } else if (rarity === 5) {
            label.color = new Color("#ff8600"); //橙
        } else if (rarity === 6) {
            label.color = new Color("#ff310a"); //红
        }
    }
    /**
     * 通过chargeid获取充值信息
     * @param charge_id
     */
    public static getCharge(charge_id: number) {
        // 获取充值的配置
        const charge_conf_list = Utils.getJsonAsset("config/data/charge__get_charge").json;
        return charge_conf_list.find(item => item.charge_id === charge_id)
    }


    // public static pay(chargeId: number) {
    //     netManager.Instance.sendMessage(200, {
    //         cmd: "测试充值 " + chargeId,
    //     });
    //     // if (!Const.is_platform) {
    //     //     const data = {
    //     //         cmd: "测试充值 " + chargeId,
    //     //     };
    //     //     netManager.Instance.sendMessage(200, data);
    //     // } else {

    //     //     const base_info = player_base_module.Instance.get_model().base_info;
    //     //     const chargeConf = TxtUtils.Instance.getCharge(chargeId)[0];
    //     //     const game_area = "1"; //角色所在的游戏区，参数须严格与在小 7 平台上传的开服表信息中的支付时候显示区服字段进行填写。
    //     //     const game_level = base_info.lv;
    //     //     const game_orderid = chargeConf.charge_id.toString();
    //     //     const game_currency = "CNY";
    //     //     const game_price = chargeConf.price.toFixed(2);
    //     //     const game_role_id = base_info.player_id;
    //     //     const game_role_name = base_info.nickname;
    //     //     const notify_id = "-1";
    //     //     const subject = chargeConf.name;
    //     //     const game_access_version = "";
    //     //     //const extends_info_data = "order_id=" + chargeConf.charge_id + "&channel=1"; //额外数据
    //     //     fetch("https://ccdzzapi.julelekeji.cn/pay/platform/xiao7/game_sign.php", {
    //     //         method: "POST",
    //     //         headers: {
    //     //             'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
    //     //         },
    //     //         body: "game_area=" + game_area + "&game_guid=" + Const.account
    //     //             + "&game_price=" + game_price + "&subject=" + subject
    //     //             + "&server_id=node_1" + "&player_id=" + game_role_id
    //     //     }).then((response: Response) => {
    //     //         return response.text();
    //     //     })
    //     //         .then((res) => {
    //     //             const data = JSON.parse(res);
    //     //             //console.log("js evt_loginToken back-->" + JSON.stringify(data));
    //     //             const ob = {
    //     //                 extends_info_data: "order_id=" + game_orderid + "&channel=1",
    //     //                 game_area: game_area,
    //     //                 game_level: game_level.toString(),
    //     //                 game_orderid: data.order_id,
    //     //                 game_currency: game_currency,
    //     //                 game_price: game_price,
    //     //                 game_role_id: game_role_id.toString(),
    //     //                 game_role_name: game_role_name,
    //     //                 game_guid: Const.account,
    //     //                 notify_id: notify_id,
    //     //                 subject: subject,
    //     //                 game_sign: data.md5,
    //     //                 game_access_version: game_access_version
    //     //             }
    //     //             SDKManager.Instance.sendToNative("pay", JSON.stringify(ob));

    //     //         }).catch((err) => {
    //     //             //console.log("js evt_loginToken back error -->" + err);

    //     //         })
    //     // }

    // }
    // // 获取时间戳与当前服务器时间戳的差值
    // public static time_diff(timestamp: number) {
    //     return timestamp - netManager.Instance.get_time();
    // }
    // // 获取当前服务器时间戳
    // public static now() {
    //     return netManager.Instance.get_time();
    // }

    //获取把 node1移动到 node2位置后的坐标
    public static convertNodespaceAR(node1: Node, node2: Node) {
        return node1.parent.getComponent(UITransform).convertToNodeSpaceAR(node2.parent.getComponent(UITransform).convertToWorldSpaceAR(node2.position))
    }
    //获取从node1节点下拿到node2节点下保持位置不变的坐标
    public static convertNodespaceAR2(node: Node, new_parent_node: Node) {
        return new_parent_node.getComponent(UITransform).convertToNodeSpaceAR(node.getComponent(UITransform).convertToWorldSpaceAR(Vec3.ZERO))
    }
}
