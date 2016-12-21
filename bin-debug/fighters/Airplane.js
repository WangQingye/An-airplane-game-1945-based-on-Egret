/**
 *
 * @author Wqy
 *
 */
var fighter;
(function (fighter) {
    //建立飞机的对象池
    var Airplane = (function (_super) {
        __extends(Airplane, _super);
        function Airplane(texture, fireDelay, textureName) {
            _super.call(this);
            //飞机的初始生命值
            this.blood = 10;
            this.fireDelay = fireDelay;
            this.bmp = new egret.Bitmap(texture);
            this.textureName = textureName;
            this.addChild(this.bmp);
            this.fireTimer = new egret.Timer(fireDelay);
            this.fireTimer.addEventListener(egret.TimerEvent.TIMER, this.createBullet, this);
        }
        var d = __define,c=Airplane,p=c.prototype;
        //产出飞机
        Airplane.produce = function (textureName, fireDelay) {
            if (fighter.Airplane.cacheDict[textureName] == null)
                fighter.Airplane.cacheDict[textureName] = [];
            var dict = fighter.Airplane.cacheDict[textureName];
            var theFighter;
            if (dict.length > 0) {
                theFighter = dict.pop();
            }
            else {
                theFighter = new fighter.Airplane(RES.getRes(textureName), fireDelay, textureName);
            }
            theFighter.blood = 10;
            return theFighter;
        };
        //回收飞机
        Airplane.reclaim = function (theFighter) {
            var textureName = theFighter.textureName;
            if (fighter.Airplane.cacheDict[textureName] == null)
                fighter.Airplane.cacheDict[textureName] = [];
            var dict = fighter.Airplane.cacheDict[textureName];
            if (dict.indexOf(theFighter) == -1)
                dict.push(theFighter);
        };
        //开火
        p.fire = function () {
            this.fireTimer.start();
        };
        //停火
        p.stopFire = function () {
            this.fireTimer.stop();
        };
        //创建子弹
        p.createBullet = function (evt) {
            this.dispatchEventWith("createBullet");
        };
        Airplane.cacheDict = {};
        return Airplane;
    }(egret.DisplayObjectContainer));
    fighter.Airplane = Airplane;
    egret.registerClass(Airplane,'fighter.Airplane');
})(fighter || (fighter = {}));
