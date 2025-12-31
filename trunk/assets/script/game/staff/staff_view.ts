import { _decorator, Component, Node, Prefab, instantiate, Sprite, Label, JsonAsset } from 'cc';
import { GameData } from '../../GameData';
import { oops } from 'db://oops-framework/core/Oops';
import Utils from '../../utils/Utils';
const { ccclass, property } = _decorator;

@ccclass('staff_view')
export class staff_view extends Component {
    staff_config: any = {};//员工数据
    staff_scroll: Node = null;
    content: Node = null;
    @property(Prefab)
    staff_item: Node = null;
    async start() {
        await this.get_staff_config();
        this.staff_scroll = this.node.getChildByName("staff_scroll");
        this.content = this.staff_scroll.getChildByName("view").getChildByName("content");
        this.initStaff();
    }
    initStaff() {
        for (let i = 0; i < this.staff_config.length; i++) {
            let staff_item = instantiate(this.staff_item);
            staff_item.setParent(this.content);
            // staff_item.parent = this.content;
            //头像
            Utils.getSpriteFrame("ui/staff_head/" + this.staff_config[i].head_id, staff_item.getChildByName("staff_icon").getComponent(Sprite));
            //名称
            let name_txt = staff_item.getChildByName("staff_name").getComponent(Label);
            name_txt.string = this.staff_config[i].name;
            //等级
            let lv_txt = staff_item.getChildByName("staff_lv").getComponent(Label);
            lv_txt.string = "等级：" + GameData.userData.staffLv[this.staff_config[i].id];
        }
    }
    get_staff_config(): Promise<void> {
        return new Promise((resolve, reject) => {
            const path = "config/data/staff__get_info"
            oops.res.load("bundle", path, JsonAsset, (err: { message: any }, jsonAsset: JsonAsset | null) => {
                if (err) {
                    console.warn(`Failed to load task config: ${err.message}`);
                    reject(err);
                    return;
                }
                if (!jsonAsset || !jsonAsset.json) {
                    console.warn(`Invalid task config loaded: ${path}`);
                    reject(new Error("Invalid config"));
                    return;
                }
                this.staff_config = jsonAsset.json;
                resolve();
            });
        });
    }
}


