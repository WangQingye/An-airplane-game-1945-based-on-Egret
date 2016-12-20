/**
 *
 * @author  Wqy
 *
 */
var fighter;
(function (fighter) {
    //建立一个子弹的对象池
    var Bullet = (function (_super) {
        __extends(Bullet, _super);
        function Bullet(texture, textureName) {
            _super.call(this, texture);
            this.textureName = textureName;
        }
        var d = __define,c=Bullet,p=c.prototype;
        //产生子弹
        Bullet.produce = function (textureName) {
            if (fighter.Bullet.cacheDict[textureName] == null)
                fighter.Bullet.cacheDict[textureName] = [];
            var dict = fighter.Bullet.cacheDict[textureName];
            var bullet;
            if (dict.length > 0) {
                bullet = dict.pop();
            }
            else {
                bullet = new fighter.Bullet(RES.getRes(textureName), textureName);
            }
            return bullet;
        };
        //回收子弹
        Bullet.reclaim = function (bullet) {
            var textureName = bullet.textureName;
            if (fighter.Bullet.cacheDict[textureName] == null)
                fighter.Bullet.cacheDict[textureName] = [];
            var dict = fighter.Bullet.cacheDict[textureName];
            if (dict.indexOf(bullet) == -1)
                dict.push(bullet);
        };
        Bullet.cacheDict = {};
        return Bullet;
    }(egret.Bitmap));
    fighter.Bullet = Bullet;
    egret.registerClass(Bullet,'fighter.Bullet');
})(fighter || (fighter = {}));
