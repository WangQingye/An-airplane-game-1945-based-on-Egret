/**
 *
 * @author  Wqy
 *
 */
module fighter {
    //建立一个子弹的对象池
    export class Bullet extends egret.Bitmap {
        private static cacheDict: Object = {};
        //产生子弹
        public static produce(textureName: string): fighter.Bullet {
            if(fighter.Bullet.cacheDict[textureName] == null)
                fighter.Bullet.cacheDict[textureName] = [];
            var dict: fighter.Bullet[] = fighter.Bullet.cacheDict[textureName];
            var bullet: fighter.Bullet;
            if(dict.length > 0) {
                bullet = dict.pop();
            } else {
                bullet = new fighter.Bullet(RES.getRes(textureName),textureName);
            }
            return bullet;
        }
        //回收子弹
        public static reclaim(bullet: fighter.Bullet): void {
            var textureName: string = bullet.textureName;
            if(fighter.Bullet.cacheDict[textureName] == null)
                fighter.Bullet.cacheDict[textureName] = [];
            var dict: fighter.Bullet[] = fighter.Bullet.cacheDict[textureName];
            if(dict.indexOf(bullet) == -1)
                dict.push(bullet);
        }

        public textureName: string;//子弹类型名

        public constructor(texture: egret.Texture,textureName: string) {
            super(texture);
            this.textureName = textureName;
        }
    }
}
