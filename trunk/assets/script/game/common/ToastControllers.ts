import { _decorator, Component, Node, Prefab, instantiate, resources, find, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ToastControllers')
export class ToastControllers extends Component {
    public static Instance: ToastControllers = null!;
    protected onLoad(): void {
        ToastControllers.Instance = this;
    }
    showToast(showString: string) {
        let Canvas = find("gui")
        //实例化奖励预制体
        resources.load("prefabs/common/toast", Prefab, (err, toast) => {
            let toastPrefab = instantiate(toast);
            toastPrefab.setParent(Canvas)
            toastPrefab.setPosition(0, -400)
            toastPrefab.getChildByName("add_txt").getComponent(Label).string = showString
            setTimeout(() => {
                toastPrefab.destroy()
            }, 3000)
        });
    }
}


