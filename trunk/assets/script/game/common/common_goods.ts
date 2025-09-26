import { Sprite } from 'cc';
import { _decorator, Node } from 'cc';
import { GameComponent } from "db://oops-framework/module/common/GameComponent";
import Utils from '../../utils/Utils';
import { Label } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('common_goods')
export class common_goods extends GameComponent {
    private icon: Node = null;
    private goods_num_node: Node = null;
    private goods_name_node: Node = null;
    /**
     * 初始化道具图标
     * @param goods_id 
     * @param goods_name 
     * @param goods_number 
     */
    init(goods_id: number, goods_name: string, goods_number: number) {
        this.icon = this.node.getChildByName('icon');
        this.goods_num_node = this.node.getChildByName('goods_num');
        this.goods_name_node = this.node.getChildByName('goods_name');

        
        Utils.getSpriteFrame(`ui/goods/${goods_id}`, this.icon.getComponent(Sprite))
        this.goods_name_node.getComponent(Label).string = goods_name;
        this.goods_num_node.getComponent(Label).string = `${goods_number}`;
    }
}