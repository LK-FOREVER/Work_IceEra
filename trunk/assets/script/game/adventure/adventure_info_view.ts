import { Label } from 'cc';
import { Sprite } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { oops } from 'db://oops-framework/core/Oops';
import Utils from '../../utils/Utils';
import { Prefab } from 'cc';
import { instantiate } from 'cc';
import { common_goods } from '../common/common_goods';
import { GameData } from '../../GameData';
import { UIID } from '../common/config/GameUIConfig';
import { GameEvent } from '../common/config/GameEvent';
const { ccclass, property } = _decorator;

@ccclass('adventure_info_view')
export class adventure_info_view extends Component {
    private config: any = {};
    @property(Node)
    closeBtn: Node = null;
    @property(Node)
    challengeBtn: Node = null;
    @property(Node)
    mask: Node = null;
    @property(Node)
    ice_1: Node = null;//冰雕1
    @property(Node)
    ice_2: Node = null;//冰雕2
    @property(Prefab)
    commmon_goods: Prefab = null;
    @property(Node)
    reward_content: Node = null;

    async onAdded(params: any): Promise<boolean> {
        // 清理之前的内容
        if (this.reward_content) {
            this.reward_content.removeAllChildren();
        }
        this.config = params || {};
        await this.initUI();
        this.node.active = true;
        return true;
    }

    private async initUI() {
        this.closeBtn.on(Node.EventType.TOUCH_END, this.close, this);
        // this.mask.on(Node.EventType.TOUCH_END, this.close, this);
        this.challengeBtn.on(Node.EventType.TOUCH_END, this.challenge, this);

        // 加载冰雕图片
        // 检查节点是否存在
        if (!this.ice_1 || !this.ice_2) {
            console.error("冰雕节点未正确绑定");
            return;
        }

        // 检查Sprite组件是否存在
        const sprite1 = this.ice_1.getComponent(Sprite);
        const sprite2 = this.ice_2.getComponent(Sprite);
        if (!sprite1 || !sprite2) {
            console.error("冰雕节点缺少Sprite组件");
            return;
        }

        try {
            await Utils.getSpriteFrame("ui/ice/" + this.config.level_config.ice_id[0], sprite1);
            await Utils.getSpriteFrame("ui/ice/" + this.config.level_config.ice_id[1], sprite2);
        } catch (e) {
            console.error("加载冰雕图片失败:", e);
        }

        // 加载奖励道具配置
        let goodsConf = null;
        let retryCount = 0;
        const maxRetries = 3;
        // 尝试加载配置文件，最多重试3次
        while (retryCount < maxRetries && !goodsConf) {
            try {
                const goodsAsset = await Utils.getJsonAsset("config/data/goods__get_goods_conf");
                if (goodsAsset && goodsAsset.json) {
                    goodsConf = goodsAsset.json;
                    break;
                }
                retryCount++;
                if (retryCount < maxRetries) {
                    console.log(`配置加载失败，正在重试... (${retryCount}/${maxRetries})`);
                    await new Promise(resolve => setTimeout(resolve, 500)); // 等待500ms后重试
                }
            } catch (e) {
                console.error(`加载配置文件出错 (尝试 ${retryCount + 1}/${maxRetries}):`, e);
                retryCount++;
            }
        }

        if (!goodsConf) {
            console.error("无法加载道具配置文件，请检查文件路径和格式");
            return;
        }

        // 加载奖励道具
        for (const reward of this.config.level_config.reward) {
            try {
                // 获取道具ID和数量
                const goodsId = Object.keys(reward)[0];
                const goodsNum = reward[goodsId];

                const goodsInfo = goodsConf.find(item => item.id === Number(goodsId));

                if (goodsInfo && this.commmon_goods) {
                    const common_goods_node = instantiate(this.commmon_goods);
                    const goodsComponent = common_goods_node.getComponent(common_goods);

                    if (goodsComponent) {
                        goodsComponent.init(
                            goodsInfo.id,      // 道具ID
                            goodsInfo.name,    // 道具名称
                            goodsNum           // 道具数量
                        );
                        common_goods_node.setParent(this.reward_content);
                    } else {
                        console.error("未找到common_goods组件");
                    }
                } else {
                    console.error("道具信息或预制体不存在");
                }
            } catch (e) {
                console.error("处理奖励道具时出错:", e);
            }
        }
    }


    private close() {
        if (this.reward_content.children.length > 0) {
            this.reward_content.removeAllChildren();
        }
        oops.gui.removeByNode(this.node);
    }
    private challenge() {
        let energy_num = GameData.userDataProxy.goods_list.find(item => item.id === 1024).number;
        if (energy_num >= this.config.level_config.energy_cost) {
            GameData.userDataProxy.goods_list.find(item => item.id === 1024).number -= this.config.level_config.energy_cost;
            console.log("剩余电量：" + GameData.userDataProxy.goods_list.find(item => item.id === 1024).number);
            oops.message.dispatchEvent(GameEvent.UpdateGoodsList);
            oops.gui.open(UIID.PrepareView, this.config);
        }
        oops.gui.removeByNode(this.node);
    }

    onDestroy() {
        this.config = null;
    }
}


