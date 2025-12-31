import { _decorator, Node } from 'cc';
import { GameComponent } from '../../../../extensions/oops-plugin-framework/assets/module/common/GameComponent';
import { Prefab } from 'cc';
import Utils from '../../utils/Utils';
import { instantiate } from 'cc';
import { common_goods } from '../common/common_goods';
import { ScrollView } from 'cc';
import { GameData } from '../../GameData';
const { ccclass, property } = _decorator;

@ccclass('bag_view')
export class bag_view extends GameComponent {
    @property(Prefab)
    commmon_goods: Prefab = null;
    goods_scroll: Node = null;
    async start() {
        this.goods_scroll = this.node.getChildByName("goods_scroll");

        // 获取道具的配表信息
        const allAsset = await Utils.getJsonAsset("config/data/goods__get_goods_conf");
        const all_goods_conf_list = allAsset ? allAsset.json : [];
        const bag_goods_conf_list = all_goods_conf_list.filter((item: any) => item.is_bag_show === 1);

        bag_goods_conf_list.forEach(goods_conf => {
            const has_goods_num = GameData.userData.goods_list[goods_conf.id]
            console.log('has_goods_num',has_goods_num)
            if (has_goods_num && has_goods_num > 0) {
                const common_goods_node = instantiate(this.commmon_goods);
                common_goods_node.getComponent(common_goods).init(goods_conf.id, goods_conf.name, has_goods_num)
                common_goods_node.setParent(this.goods_scroll.getComponent(ScrollView).content)
            }
        });
    }
}


