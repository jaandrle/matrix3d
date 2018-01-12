# Třída pro manipulaci s matrix3d - zatím jen prvotní nástřel
## Průřez
### Parametry konstruktoru
    Předává se mu list hodnot:
        - elements //elementy buď klasické JavaScriptové, nebo jQuery
        - selector //string pro výběr
          ...elemen je potřeba vybrat buť pomocí 'elements', nebo 'selector' (preferovaná verze)
        - directly //bez efektu
### Metody třídy

    _this.write= function(matrix){ ... //zápis buď zadané matice/transformace 'matrix', nebo interní matice
    _this.returnStyle= function(matrix){ ... //vypíše kompletní zápis stylu aktuální matice nebo 'matrix'
    _this.returnMatrix= function(){ ... // vypíše aktuální matici
    _this.clear= function(){ ... //resetuje trasformace
    _this.t= { ...//schraňuje všechny transformační funkce
    _this.chain= function(){... //umožní řetězení metod
### Statické metody třídy

    settings={//nastavování jednotek
        angle ["radians" : "degrees"] - default stupně
        zoom ["original" : "percent"] - defautt procenta (u originálu potřeba normovat na 1)
        scroll ["original" : "thousandth"] - default tisíciny
    }
    const //konstanty
    t //přístup k transformačním funkcím
    product //násobení matic === kombinování transformací
### Transformační funkce

    diagonal(...d){//vytvori diagonalni matici s (x,y,z,a) na diagonále
         ...parametr 'd' je pole:
             - prázdné pro (x,y,z,a)=(1,1,1,1)
             - jednoprvkové pokud (x,y,z,a)=(d[0],d[0],d[0],1)
             - tříprvkové pro (x,y,z,a)=(d[0],d[1],d[2],1)
             - čtyřprvkové
             - jinak chyba
    identity(){//alias pro 'this.diagonal()'
    zoom(z){//alias pro 'this.diagonal(z)'
    zoomYZ(z){//alias pro 'this.diagonal(1,z,z)'
    zoomXZ(z){//alias pro 'this.diagonal(z,1,z)'
    zoomXYZ(...z){//alias pro 'this.diagonal(zx,zy,zz)'
    zoomXY(z){//alias pro 'this.diagonal(z,z,1)'
    mirrorXZ(){//alias pro 'this.diagonal(1,-1,1)'
    mirrorYZ(){//alias pro 'this.diagonal(-1,1,-1)'
    mirrorXY(){//alias pro 'this.diagonal(1,-1,1)'
    rotate(x=0,y=0,z=0){//rotace dle příslušných os
    rotateX(d){//alias pro 'this.rotate(d,0,0)'
    rotateY(d){//alias pro 'this.rotate(0,d,0)'
    rotateZ(d){//alias pro 'this.rotate(0,0,d)'
    translate(x=0,y=0,z=0){//posun v příslušních osách
    translateX(t){//alias pro 'this.translate(t,0,0)'
    translateY(t){//alias pro 'this.translate(0,t,0)'
    translateZ(t){//alias pro 'this.translate(0,0,t)'
    skew(x=0,y=0,z=0){
    scroll(x=0,y=0,z=0){
    matrix(m){//použití externí matice (pole) 'm' v následujícíxh formátech:
             - [1,...,16] = plná matice 3d transformace + posuvy
             - [[1,...,4],...,[13,...,16]] = plná matice 3d transformace + posuvy
             - [1,...,9] = 3d trasformace jsou doplněny nulovými posuvy
             - [[1,...,3],...,[7,...,9]] = 3d trasformace jsou doplněny nulovými posuvy
             - [1,...,4] = diagonální matice
             - [1,...,3] = diagonální matice doplněna 1 jedničkou na posledním místě
