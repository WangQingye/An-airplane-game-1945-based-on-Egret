/**
 *
 * @author Wqy
 *
 */
module fighter {
    
    export class GameUtil{
        //基于矩形的碰撞检测
        public static hitTest(obj1:egret.DisplayObject , obj2:egret.DisplayObject) : boolean {
            
            var rect1:egret.Rectangle = obj1.getBounds();   //取得碰撞体积，以矩形为单位
            var rect2:egret.Rectangle = obj2.getBounds();
            
            rect1.x = obj1.x;
            rect1.y = obj1.y;
            rect2.x = obj2.x;
            rect2.y = obj2.y;
            
            return rect1.intersects(rect2);   //判断两个物体是否交叉，如果交叉，则碰撞
        }       
    }
    

        //根据name关键字创建一个Bitmap对象，简化程序中的代码量
    export function createBitmapByName(name:string):egret.Bitmap{
        var result: egret.Bitmap = new egret.Bitmap();
        var texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
        
        
    }
    
    
}
