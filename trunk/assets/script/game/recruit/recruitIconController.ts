import { _decorator, Color, Component, JsonAsset, Label, Node, resources, find, Sprite, SpriteFrame } from 'cc';
// import { LoadUtils } from '../../../Common/LoadUtils';
// import { GameApp } from '../../../GameApp';
// import { TextUtils } from '../../../Common/TextUtils';
import { GameData } from '../../GameData';
import Utils from '../../utils/Utils';
const { ccclass, property } = _decorator;

// Utility function to wait for a given number of seconds
function waitForSeconds(seconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

@ccclass('recruitIconController')
export class recruitIconController extends Component {
    icon: Node = null
    name_text: Node = null
    num_text: Node = null
    goods_bg: Node = null
    towerDebris_text: Node = null
    goods_list: SpriteFrame[] = []
    common: SpriteFrame[] = []
    goods_info_list: any = null
    goods_id: number = null
    goods_num: number = null
    staff_id: number = null
    staff_info: any = null
    towerDebris_icon: Node = null
    light: Node = null
    Red_Ani: Node = null;
    Orange_Ani: Node = null;
    Purple_Ani: Node = null;
    Hero_Node: Node = null;
    goods_info: any = null
    /**
     *
     * 初始化icon
     * @param {*} goods_id
     * @param {*} num
     * @memberof recruitIconController
     */
    async init(goods_id: number, goods_num: number, staff_id: number) {
        this.Hero_Node = this.node.getChildByName("Hero_Node");
        this.icon = this.Hero_Node.getChildByName("icon")
        this.name_text = this.Hero_Node.getChildByName("name_bg").getChildByName("name_text")
        this.num_text = this.Hero_Node.getChildByName("name_bg").getChildByName("num_text")
        this.Purple_Ani = this.node.getChildByName("Spine_Anis").getChildByName("Purple_Ani");
        this.Orange_Ani = this.node.getChildByName("Spine_Anis").getChildByName("Orange_Ani");
        this.Red_Ani = this.node.getChildByName("Spine_Anis").getChildByName("Red_Ani");
        this.goods_bg = this.node.getChildByName("goods_bg")
        this.towerDebris_text = this.Hero_Node.getChildByName("towerDebris_text")
        this.towerDebris_text.active = false;
        this.towerDebris_icon = this.Hero_Node.getChildByName("towerDebris_icon")
        this.towerDebris_icon.active = false;
        this.goods_id = goods_id
        this.goods_num = goods_num
        this.staff_id = staff_id
        // this.goods_list = LoadUtils.Instance.goods_list
        // this.common = LoadUtils.Instance.common

        const goodsAsset = await Utils.getJsonAsset("config/data/goods__get_goods_conf");
        this.goods_info_list = goodsAsset ? goodsAsset.json : [];
        // console.log("this.goods_info_list:", this.goods_info_list);
        this.goods_info = this.goods_info_list.find((item: any) => item.id === this.goods_id) || {};
        const staffAsset = await Utils.getJsonAsset("config/data/staff__get_info");
        this.staff_info = staffAsset ? staffAsset.json : [];
        this.updateUI()
    }

    async Ani_Coroutine() {
        this.Red_Ani.active = false;
        this.Orange_Ani.active = false;
        this.Purple_Ani.active = false;
        this.Hero_Node.active = false;
        await waitForSeconds(0.5); // 等待1秒
        // this.goods_bg.active = false;
        switch (this.goods_info.quality) {
            case 4:
                this.Purple_Ani.active = true;
                break;
            case 5:
                this.Orange_Ani.active = true;
                break;
            case 6:
                this.Red_Ani.active = true;
                break;
        }
        this.Hero_Node.active = true;
    }

    updateUI() {
        let name_color: string = "";
        switch (this.goods_info.quality) {
            case 1:
                name_color = "#ffffff"
                break;
            case 2:
                name_color = "#ffffff"
                break;
            default:
                name_color = "#ffffff"
                break;
        }
        Utils.getSpriteFrame("ui/staff_invite/" + this.goods_info.invite_icon, this.icon.getComponent(Sprite));
        this.name_text.getComponent(Label).string = this.goods_info.name
        this.name_text.getComponent(Label).color = new Color(name_color);
        this.num_text.getComponent(Label).string = String(this.goods_num)
        Utils.getSpriteFrame("ui/recruit/" + `common_goods_${this.goods_info.quality}`, this.goods_bg.getComponent(Sprite));
        this.Ani_Coroutine();

        if (this.goods_id <= 2012 && this.goods_id >= 2001) {
            //碎片
            const debris_id = this.goods_id + 3000;
            GameData.userData.staffDebris[debris_id] += this.goods_num
            this.towerDebris_icon.active = true;
            Utils.getSpriteFrame("ui/goods/" + this.goods_info.quality, this.towerDebris_icon.getComponent(Sprite));
        } else {
            //完整英雄
            //不展示数量
            this.num_text.active = false
            //判断有没有该英雄，没有就添加该英雄并更新图鉴，有就转换成碎片
            let isAdd = true;
            GameData.userData.stafflist.forEach(value => {
                if (value.id === this.staff_id) {
                    GameData.userData.staffDebris[value.debris_id] += 30;
                    this.towerDebris_text.active = true;
                    isAdd = false;
                }
            });

            // 若未拥有该英雄，则添加至用户数据和奖励列表
            if (isAdd) {
                const staff_info_add = this.staff_info.find(item => item.id == this.staff_id);
                GameData.userData.stafflist.push(staff_info_add);
                GameData.userData.staffLv[this.staff_id] = 1;
            }
        }
    }
}