import { vector4 } from "../math/vector.js";
import { matrix4x4 } from "../math/matrix.js";

export class Camera {   
    up = vector4.Create( 0 , 1 , 0 , 0 );
    forward = vector4.Create( 0 , 0 , 1 , 0 );
    translation = vector4.Create( 0 , 0 , -400 , 1 );  
    rotationX = 0;
    rotationY = 0;
    lowDistance = 1;
    highDistance = 750;
    moveSpeed = 100;
    rotationSpeed = 1;
    near = 1;
    far = 1000;
    fov = 60;
    EPS = 0.5;

    constructor() {
        
    }

    MoveCloser( deltaTime ) {
        let v;
        if( vector4.Dist( this.translation , vector4.Identity() ) - this.moveSpeed * 2 * deltaTime > this.lowDistance ) {
            v = vector4.Sub( this.translation , vector4.Identity() );
            v = vector4.Normalize( v );
            v = vector4.MultByEscalar( v , this.moveSpeed * deltaTime )
            this.translation = vector4.Sum( this.translation , v );
        }
    }

    MoveAway( deltaTime ) {
        let v;
        if( vector4.Dist( this.translation , vector4.Identity() ) + this.moveSpeed * 2 * deltaTime < this.highDistance ) {
            v = vector4.Sub( this.translation , vector4.Identity() );
            v = vector4.Normalize( v );
            v = vector4.MultByEscalar( v , -this.moveSpeed * deltaTime )
            this.translation = vector4.Sum( this.translation , v );
        }
    }

    MoveUp( deltaTime ) {
        this.rotationY -= deltaTime * this.rotationSpeed;
        if( this.rotationY <=  -2 + this.EPS ) {
            this.rotationY = -2 + this.EPS;
        }
    }

    MoveDown( deltaTime ) {
        this.rotationY += deltaTime * this.rotationSpeed;
        if( this.rotationY >=  2 - this.EPS ) {
            this.rotationY = 2 - this.EPS;
        }
    }

    MoveLeft( deltaTime ) {
        this.rotationX += deltaTime * this.rotationSpeed;
    }

    MoveRight( deltaTime ) {
        this.rotationX -= deltaTime * this.rotationSpeed;
    }


    GetViewProjectionMatrix( gl ) {
        let yaw = this.rotationX;
        let pitch = this.rotationY;

        let radius = this.translation[2];

        let matrix = matrix4x4.Identity();
        matrix = matrix4x4.Mult( matrix , matrix4x4.Translation( 0 , 0 , -radius ) );
        matrix = matrix4x4.Mult( matrix , matrix4x4.XRotation( pitch ) );
        matrix = matrix4x4.Mult( matrix , matrix4x4.YRotation( yaw ) );
        matrix = matrix4x4.Mult( matrix , matrix4x4.Translation( 0 , 0 , radius ) );

        let auxTranslation = matrix4x4.MultVector4( matrix , this.translation );

        this.forward = vector4.Normalize( vector4.MultByEscalar( auxTranslation , -1 ) );
        /* let right = vector4.Normalize( vector4.Cross( this.forward , this.up ) );
        this.up = vector4.Normalize( vector4.Cross( right , this.forward ) ); */

        /* console.log( auxTranslation ); */

        
        let projectionMatrix = matrix4x4.Perspective( this.fov , gl.canvas.clientWidth / gl.canvas.clientHeight , this.near , this.far );
        //let projectionMatrix = matrix4x4.Orthographic( 0 , gl.canvas.clientWidth , gl.canvas.clientHeight , 0 , 1 , 100 );
        let viewMatrix = matrix4x4.ViewMatrix( auxTranslation , this.up , this.forward );
        return matrix4x4.Mult( projectionMatrix , viewMatrix ); 
    }
}