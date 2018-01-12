(function(w){
    const name= w.hasOwnProperty("$M") ? "$Matrix3D" : "$M";
    const style= (function() {
        const style = document.createElement('style');
        style.appendChild(document.createTextNode(''));
        document.head.appendChild(style);
        let index= 0;
        return {
            allocate(){
                return index++;
            },
            edit(id,rule){
                if(style.sheet.cssRules.item(id)!==null) style.sheet.deleteRule(id);
                style.sheet.insertRule(rule, id);
            },
            remove(id){
                style.sheet.deleteRule(id);
            }
        };
    })();
    const consts= {
        pi: 3.14159265359,//=1radian
        deg: 57.2957795,//degree= ...radians
        rad: 0.01745329252,//radian=1/deg
        frac: 0.01,
        thousandth: 0.001
    };
    let convert= {to_rad: consts.rad, to_zoom: consts.frac, to_scroll: consts.thousandth};
    const transformations= {
        diagonal(...d){//vytvori diagonalni matici (x,y,z,a)
            switch (d.length) {
                case 0:
                    d= [1,1,1,1];
                    break;
                case 1:
                    d= [d[0],d[0],d[0],1];
                    break;
                case 3:
                    d= [...d,1];
                    break;
                case 4://all
                    break;
                default:
                    throw 'Unexcepted number of parameters';
            }
            return [[d[0],0,0,0], [0,d[1],0,0], [0,0,d[2],0], [0,0,0,d[3]]];
        },
        identity(){//alias pro 'this.diagonal()'
            return this.diagonal();
        },
        zoom(z){//alias pro 'this.diagonal(z)'
            z= 1 + z*convert.to_zoom;
            return this.diagonal(z);
        },
        zoomYZ(z){//alias pro 'this.diagonal(1,z,z)'
            z= 1 + z*convert.to_zoom;
            return this.diagonal(1,z,z);
        },
        zoomXZ(z){//alias pro 'this.diagonal(z,1,z)'
            z= 1 + z*convert.to_zoom;
            return this.diagonal(z,1,z);
        },
        zoomXYZ(...z){//alias pro 'this.diagonal(zx,zy,zz)'
            for(let i= 0, i_length= z.length; i < i_length; i++){z[i]= 1 + z[i]*convert.to_zoom;}
            return this.diagonal(...z);
        },
        zoomXY(z){//alias pro 'this.diagonal(z,z,1)'
            z= 1 + z*convert.to_zoom;
            return this.diagonal(z,z,1);
        },
        mirrorXZ(){//alias pro 'this.diagonal(1,-1,1)'
            return this.diagonal(1,-1,1);
        },
        mirrorYZ(){//alias pro 'this.diagonal(-1,1,-1)'
            return this.diagonal(-1,1,1);
        },
        mirrorXY(){//alias pro 'this.diagonal(1,-1,1)'
            return this.diagonal(1,1,-1);
        },
        rotate(x=0,y=0,z=0){
            x= x*convert.to_rad; y= y*convert.to_rad; z= z*convert.to_rad; //convert to radians
            const sin= [Math.sin(x), Math.sin(y), Math.sin(z)];
            const cos= [Math.cos(x), Math.cos(y), Math.cos(z)];
            return [[cos[1]*cos[2],-sin[2],sin[1], 0], [sin[2],cos[0]*cos[2],-sin[0], 0], [-sin[1],sin[0],cos[1]*cos[0], 0], [0,0,0,1]];
        },
        rotateX(d){//alias pro 'this.rotate(d,0,0)'
            return this.rotate(d,0,0);
        },
        rotateY(d){//alias pro 'this.rotate(0,d,0)'
            return this.rotate(0,d,0);
        },
        rotateZ(d){//alias pro 'this.rotate(0,0,d)'
            return this.rotate(0,0,d);
        },
        translate(x=0,y=0,z=0){
            let out= this.diagonal();
            if(x) out[3][0]= x; if(y) out[3][1]= y; if(z) out[3][2]= z;
            return out;
        },
        translateX(t){//alias pro 'this.translate(t,0,0)'
            return this.translate(t,0,0);
        },
        translateY(t){//alias pro 'this.translate(0,t,0)'
            return this.translate(0,t,0);
        },
        translateZ(t){//alias pro 'this.translate(0,0,t)'
            return this.translate(0,0,t);
        },
        skew(x=0,y=0,z=0){
            let out= this.diagonal();
            if(x) out[0][1]= out[0][2]= -Math.tan(x*convert.to_rad); if(y) out[1][0]= out[1][2]= Math.tan(y*convert.to_rad); if(z) out[2][1]= out[2][2]= Math.tan(z*convert.to_rad);
            return out;
        },
        scroll(x=0,y=0,z=0){
            let out= this.diagonal();
            if(x) out[0][3]= x*convert.to_scroll; if(y) out[1][3]= y*convert.to_scroll; if(z) out[2][3]= z*convert.to_scroll;
            return out;
        },
        matrix(m){
            let out= [[],[],[],[]]; let temp_check;
            switch (m.length) {
                case 16:
                    for(let i= 0; i < 4; i++){
                        out[0][i]=m[i];out[1][i]=m[i+4];out[2][i]=m[i+8];out[3][i]=m[i+12];
                    }
                    break;
                case 9:
                    out= this.identity();
                    for(let i= 0; i < 3; i++){
                        out[0][i]=m[i];out[1][i]=m[i+3];out[2][i]=m[i+6];
                    }
                    break;
                case 4:
                    temp_check= Object.prototype.toString.call(m[0])==='[object Array]';
                    if(temp_check&&m[0].length===4) out= m;
                    else if(!temp_check) out= this.diagonal(...m);
                    break;
                case 3:
                    temp_check= Object.prototype.toString.call(m[0])==='[object Array]';
                    if(temp_check&&m[0].length===3) out= [[...m[0],0], [...m[1],0], [...m[2],0], [0,0,0,1]];
                    else if(!temp_check) out= this.diagonal(...m);
                    break;
                default:
                    throw "Unextpected 'm' parameter";
            }
            return out;
        }
    };
    const transformations_keys= Object.keys(transformations);
    function product(...matrices){
        const matrices_lengths= [matrices[0][0].length, matrices[1].length];
        const vetsi_id= matrices_lengths[0]>=matrices_lengths[1] ? 0 : 1;
        const mensi_id= 1-vetsi_id;
        let out_sub=[];
        for(let i=0; i<matrices_lengths[vetsi_id]; i++){
            out_sub[i]= [];
            for(let j=0; j<matrices_lengths[vetsi_id]; j++){
                if(i>=matrices_lengths[mensi_id] || j>=matrices_lengths[mensi_id]) out_sub[i][j]=matrices[vetsi_id][i][j];
                else{
                    for(let k=0; k<matrices_lengths[mensi_id]; k++){
                        if(k) out_sub[i][j]+= matrices[0][i][k]*matrices[1][k][j];
                        else out_sub[i][j]= matrices[0][i][k]*matrices[1][k][j];
                    }
                }
            }
        }
        return out_sub;
    }
    const isMandatory= null;
    let $M= new Proxy(function(def=isMandatory){
        let _this= {};
        const rnd= Math.floor(Math.random()*(999-100+1)+100);
        if(def===null) throw "Unexcepted parameters 'def' for constructor!";
        let {
            elements= null,
            selector= null,
            directly= false
        }= def;
        if(elements===null&&selector===null) throw "Unexcepted parameters for constructor! No 'elements' and 'selector' filled!";
        else if(!selector){
            for(let i= 0, i_length= elements.length; i < i_length; i++){
                elements[i].dataset.matrix3d= "els"+rnd;
            }
            selector= '[data-matrix3d="els'+rnd+'"]';
        }
        let css_lines= {transform: style.allocate()};
        let actual_matrix= transformations.identity();
        
        _this.write= function(matrix){
            if(typeof matrix!=="undefined") style.edit(css_lines.transform, selector+"{transform: matrix3d("+matrix.toString()+");}"); //el.style.transform= ; 
            else style.edit(css_lines.transform, selector+"{transform: matrix3d("+actual_matrix.toString()+");}");
        };
        _this.returnStyle= function(matrix){
            if(typeof matrix!=="undefined") return selector+"{transform: matrix3d("+matrix.toString()+");}";
            else return selector+"{transform: matrix3d("+actual_matrix.toString()+");}";
        };
        _this.returnMatrix= function(){
            return actual_matrix;
        };
        _this.clear= function(){
            actual_matrix= transformations.identity();
            style.remove(css_lines.transform);
            //el.style.transform="";
        };
        _this.t= {};
        for(let i= 0, key_i, i_length= transformations_keys.length; i < i_length; i++){
            key_i= transformations_keys[i];
            _this.t[key_i]= function(...arguments){
                actual_matrix= product(actual_matrix, transformations[key_i](...arguments));
            };
        }
        _this.chain= function(){
            const retizek= new Proxy(function(){},{
                get(target, key){
                    if(_this.t.hasOwnProperty(key)){
                        return function(...args){_this.t[key](...args); return retizek;};
                    } else if(_this.hasOwnProperty(key)){
                        return _this[key];
                    } else {
                        return retizek;
                    }
                }
            });
            return retizek;
        };
        return Object.freeze(_this);
    },{
        settings: new Proxy({},{
            get(target, key){
                switch (key) {
                    case "angle":
                        return convert.to_rad===1 ? "radians" : "degrees";
                    case "zoom":
                        return convert.to_zoom===1 ? "original" : "percent";
                    case "scroll":
                        return convert.to_scroll===1 ? "original" : "thousandth";
                    default:
                        return undefined;
                }
            },
            set(target, key, value){
                switch (key) {
                    case "angle":
                        convert.to_rad= value==="radians" ? 1 : consts.rad;
                        return true;
                    case "zoom":
                        convert.to_zoom= value==="percent" ? consts.frac : 1;
                        return true;
                    case "scroll":
                        convert.to_scroll= value==="percent" ? consts.thousandth : 1;
                        return true;
                    default:
                        return undefined;
                }
            }
        }),
        consts: consts,
        t: transformations,
        product: product,
        get(target, key){
            return this[key];
        }
    });
    w[name]= $M;
})(window);