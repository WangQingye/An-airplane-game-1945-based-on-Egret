/**
 *
 * @author Wqy
 *
 */
var fighter;
(function (fighter) {
    var GameUtil = (function () {
        function GameUtil() {
        }
        var d = __define,c=GameUtil,p=c.prototype;
        //基于矩形的碰撞检测
        GameUtil.hitTest = function (obj1, obj2) {
            var rect1 = obj1.getBounds(); //取得碰撞体积，以矩形为单位
            var rect2 = obj2.getBounds();
            rect1.x = obj1.x;
            rect1.y = obj1.y;
            rect2.x = obj2.x;
            rect2.y = obj2.y;
            return rect1.intersects(rect2); //判断两个物体是否交叉，如果交叉，则碰撞
        };
        return GameUtil;
    }());
    fighter.GameUtil = GameUtil;
    egret.registerClass(GameUtil,'fighter.GameUtil');
    //根据name关键字创建一个Bitmap对象，简化程序中的代码量
    function createBitmapByName(name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
    fighter.createBitmapByName = createBitmapByName;
})(fighter || (fighter = {}));
