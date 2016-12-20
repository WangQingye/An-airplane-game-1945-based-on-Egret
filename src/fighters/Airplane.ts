/**
 *
 * @author Wqy
 *
 */
module fighter {
    //建立飞机的对象池
    export class Airplane extends egret.DisplayObjectContainer {
        private static cacheDict: Object = {};
		//产出飞机
        public static produce(textureName: string,fireDelay: number): fighter.Airplane {
            if(fighter.Airplane.cacheDict[textureName] == null)
                fighter.Airplane.cacheDict[textureName] = [];
            var dict: fighter.Airplane[] = fighter.Airplane.cacheDict[textureName];
            var theFighter: fighter.Airplane;
            if(dict.length > 0) {
                theFighter = dict.pop();
            } else {
                theFighter = new fighter.Airplane(RES.getRes(textureName),fireDelay,textureName);
            }
            theFighter.blood = 10;
            return theFighter;
        }
        //回收飞机
        public static reclaim(theFighter: fighter.Airplane): void {
            var textureName: string = theFighter.textureName;
            if(fighter.Airplane.cacheDict[textureName] == null)
                fighter.Airplane.cacheDict[textureName] = [];
            var dict: fighter.Airplane[] = fighter.Airplane.cacheDict[textureName];
            if(dict.indexOf(theFighter) == -1)
                dict.push(theFighter);
        }

        //创建飞机的位图
        private bmp: egret.Bitmap;
        //创建子弹的间隔时间
        private fireDelay: number;
        //定时发射
        private fireTimer: egret.Timer;
        //飞机的初始生命值
        public blood: number = 10;
        //可视为飞机类型名
        public textureName: string;
        public constructor(texture: egret.Texture,fireDelay: number,textureName: string) {
            super();
            this.fireDelay = fireDelay;
            this.bmp = new egret.Bitmap(texture);
            this.textureName = textureName;
            this.addChild(this.bmp);
            this.fireTimer = new egret.Timer(fireDelay);
            this.fireTimer.addEventListener(egret.TimerEvent.TIMER,this.createBullet,this);
        }
        //开火
        public fire(): void {
            this.fireTimer.start();
        }
        //停火
        public stopFire(): void {
            this.fireTimer.stop();
        }
        //创建子弹
        private createBullet(evt: egret.TimerEvent): void {
            this.dispatchEventWith("createBullet");
        }
    }
}