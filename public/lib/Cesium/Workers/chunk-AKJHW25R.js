/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.120.2
 *
 * Copyright 2011-2022 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */

import{a as A}from"./chunk-5M3BCNAV.js";import{a as Q}from"./chunk-X3R7MCVJ.js";import{a as ae}from"./chunk-6SD33GKZ.js";import{b as oe,c as re,d as J}from"./chunk-Q4LOMMWX.js";import{b as V,d as ie}from"./chunk-7ABUHU7X.js";import{a as b,b as O,f as N}from"./chunk-3Y3SAF2G.js";import{a as u}from"./chunk-U36ZJ433.js";import{a as r,e as H}from"./chunk-XLMIALB5.js";import{a as P}from"./chunk-XBIO23ZX.js";import{a as m}from"./chunk-L6F6UWMP.js";import{a as w,b as F}from"./chunk-J63AP2GZ.js";import{e as a}from"./chunk-LPL3F3FU.js";function q(e){this.planes=m(e,[])}var X=[new r,new r,new r];r.clone(r.UNIT_X,X[0]);r.clone(r.UNIT_Y,X[1]);r.clone(r.UNIT_Z,X[2]);var E=new r,de=new r,fe=new Q(new r(1,0,0),0);q.fromBoundingSphere=function(e,t){if(!a(e))throw new w("boundingSphere is required.");a(t)||(t=new q);let n=X.length,f=t.planes;f.length=2*n;let p=e.center,_=e.radius,s=0;for(let y=0;y<n;++y){let i=X[y],c=f[s],d=f[s+1];a(c)||(c=f[s]=new b),a(d)||(d=f[s+1]=new b),r.multiplyByScalar(i,-_,E),r.add(p,E,E),c.x=i.x,c.y=i.y,c.z=i.z,c.w=-r.dot(i,E),r.multiplyByScalar(i,_,E),r.add(p,E,E),d.x=-i.x,d.y=-i.y,d.z=-i.z,d.w=-r.dot(r.negate(i,de),E),s+=2}return t};q.prototype.computeVisibility=function(e){if(!a(e))throw new w("boundingVolume is required.");let t=this.planes,n=!1;for(let f=0,p=t.length;f<p;++f){let _=e.intersectPlane(Q.fromCartesian4(t[f],fe));if(_===V.OUTSIDE)return V.OUTSIDE;_===V.INTERSECTING&&(n=!0)}return n?V.INTERSECTING:V.INSIDE};q.prototype.computeVisibilityWithPlaneMask=function(e,t){if(!a(e))throw new w("boundingVolume is required.");if(!a(t))throw new w("parentPlaneMask is required.");if(t===q.MASK_OUTSIDE||t===q.MASK_INSIDE)return t;let n=q.MASK_INSIDE,f=this.planes;for(let p=0,_=f.length;p<_;++p){let s=p<31?1<<p:0;if(p<31&&!(t&s))continue;let y=e.intersectPlane(Q.fromCartesian4(f[p],fe));if(y===V.OUTSIDE)return q.MASK_OUTSIDE;y===V.INTERSECTING&&(n|=s)}return n};q.MASK_OUTSIDE=4294967295;q.MASK_INSIDE=0;q.MASK_INDETERMINATE=2147483647;var $=q;function k(e){e=m(e,m.EMPTY_OBJECT),this.left=e.left,this._left=void 0,this.right=e.right,this._right=void 0,this.top=e.top,this._top=void 0,this.bottom=e.bottom,this._bottom=void 0,this.near=m(e.near,1),this._near=this.near,this.far=m(e.far,5e8),this._far=this.far,this._cullingVolume=new $,this._orthographicMatrix=new O}function ce(e){if(!a(e.right)||!a(e.left)||!a(e.top)||!a(e.bottom)||!a(e.near)||!a(e.far))throw new w("right, left, top, bottom, near, or far parameters are not set.");if(e.top!==e._top||e.bottom!==e._bottom||e.left!==e._left||e.right!==e._right||e.near!==e._near||e.far!==e._far){if(e.left>e.right)throw new w("right must be greater than left.");if(e.bottom>e.top)throw new w("top must be greater than bottom.");e.near<=0||e.near>e.far,e._left=e.left,e._right=e.right,e._top=e.top,e._bottom=e.bottom,e._near=e.near,e._far=e.far,e._orthographicMatrix=O.computeOrthographicOffCenter(e.left,e.right,e.bottom,e.top,e.near,e.far,e._orthographicMatrix)}}Object.defineProperties(k.prototype,{projectionMatrix:{get:function(){return ce(this),this._orthographicMatrix}}});var me=new r,ye=new r,ge=new r,ee=new r;k.prototype.computeCullingVolume=function(e,t,n){if(!a(e))throw new w("position is required.");if(!a(t))throw new w("direction is required.");if(!a(n))throw new w("up is required.");let f=this._cullingVolume.planes,p=this.top,_=this.bottom,s=this.right,y=this.left,i=this.near,c=this.far,d=r.cross(t,n,me);r.normalize(d,d);let g=ye;r.multiplyByScalar(t,i,g),r.add(e,g,g);let l=ge;r.multiplyByScalar(d,y,l),r.add(g,l,l);let o=f[0];return a(o)||(o=f[0]=new b),o.x=d.x,o.y=d.y,o.z=d.z,o.w=-r.dot(d,l),r.multiplyByScalar(d,s,l),r.add(g,l,l),o=f[1],a(o)||(o=f[1]=new b),o.x=-d.x,o.y=-d.y,o.z=-d.z,o.w=-r.dot(r.negate(d,ee),l),r.multiplyByScalar(n,_,l),r.add(g,l,l),o=f[2],a(o)||(o=f[2]=new b),o.x=n.x,o.y=n.y,o.z=n.z,o.w=-r.dot(n,l),r.multiplyByScalar(n,p,l),r.add(g,l,l),o=f[3],a(o)||(o=f[3]=new b),o.x=-n.x,o.y=-n.y,o.z=-n.z,o.w=-r.dot(r.negate(n,ee),l),o=f[4],a(o)||(o=f[4]=new b),o.x=t.x,o.y=t.y,o.z=t.z,o.w=-r.dot(t,g),r.multiplyByScalar(t,c,l),r.add(e,l,l),o=f[5],a(o)||(o=f[5]=new b),o.x=-t.x,o.y=-t.y,o.z=-t.z,o.w=-r.dot(r.negate(t,ee),l),this._cullingVolume};k.prototype.getPixelDimensions=function(e,t,n,f,p){if(ce(this),!a(e)||!a(t))throw new w("Both drawingBufferWidth and drawingBufferHeight are required.");if(e<=0)throw new w("drawingBufferWidth must be greater than zero.");if(t<=0)throw new w("drawingBufferHeight must be greater than zero.");if(!a(n))throw new w("distance is required.");if(!a(f))throw new w("pixelRatio is required.");if(f<=0)throw new w("pixelRatio must be greater than zero.");if(!a(p))throw new w("A result object is required.");let _=this.right-this.left,s=this.top-this.bottom,y=f*_/e,i=f*s/t;return p.x=y,p.y=i,p};k.prototype.clone=function(e){return a(e)||(e=new k),e.left=this.left,e.right=this.right,e.top=this.top,e.bottom=this.bottom,e.near=this.near,e.far=this.far,e._left=void 0,e._right=void 0,e._top=void 0,e._bottom=void 0,e._near=void 0,e._far=void 0,e};k.prototype.equals=function(e){return a(e)&&e instanceof k&&this.right===e.right&&this.left===e.left&&this.top===e.top&&this.bottom===e.bottom&&this.near===e.near&&this.far===e.far};k.prototype.equalsEpsilon=function(e,t,n){return e===this||a(e)&&e instanceof k&&P.equalsEpsilon(this.right,e.right,t,n)&&P.equalsEpsilon(this.left,e.left,t,n)&&P.equalsEpsilon(this.top,e.top,t,n)&&P.equalsEpsilon(this.bottom,e.bottom,t,n)&&P.equalsEpsilon(this.near,e.near,t,n)&&P.equalsEpsilon(this.far,e.far,t,n)};var he=k;function z(e){e=m(e,m.EMPTY_OBJECT),this._offCenterFrustum=new he,this.width=e.width,this._width=void 0,this.aspectRatio=e.aspectRatio,this._aspectRatio=void 0,this.near=m(e.near,1),this._near=this.near,this.far=m(e.far,5e8),this._far=this.far}z.packedLength=4;z.pack=function(e,t,n){return F.typeOf.object("value",e),F.defined("array",t),n=m(n,0),t[n++]=e.width,t[n++]=e.aspectRatio,t[n++]=e.near,t[n]=e.far,t};z.unpack=function(e,t,n){return F.defined("array",e),t=m(t,0),a(n)||(n=new z),n.width=e[t++],n.aspectRatio=e[t++],n.near=e[t++],n.far=e[t],n};function j(e){if(!a(e.width)||!a(e.aspectRatio)||!a(e.near)||!a(e.far))throw new w("width, aspectRatio, near, or far parameters are not set.");let t=e._offCenterFrustum;if(e.width!==e._width||e.aspectRatio!==e._aspectRatio||e.near!==e._near||e.far!==e._far){if(e.aspectRatio<0)throw new w("aspectRatio must be positive.");if(e.near<0||e.near>e.far)throw new w("near must be greater than zero and less than far.");e._aspectRatio=e.aspectRatio,e._width=e.width,e._near=e.near,e._far=e.far;let n=1/e.aspectRatio;t.right=e.width*.5,t.left=-t.right,t.top=n*t.right,t.bottom=-t.top,t.near=e.near,t.far=e.far}}Object.defineProperties(z.prototype,{projectionMatrix:{get:function(){return j(this),this._offCenterFrustum.projectionMatrix}},offCenterFrustum:{get:function(){return j(this),this._offCenterFrustum}}});z.prototype.computeCullingVolume=function(e,t,n){return j(this),this._offCenterFrustum.computeCullingVolume(e,t,n)};z.prototype.getPixelDimensions=function(e,t,n,f,p){return j(this),this._offCenterFrustum.getPixelDimensions(e,t,n,f,p)};z.prototype.clone=function(e){return a(e)||(e=new z),e.aspectRatio=this.aspectRatio,e.width=this.width,e.near=this.near,e.far=this.far,e._aspectRatio=void 0,e._width=void 0,e._near=void 0,e._far=void 0,this._offCenterFrustum.clone(e._offCenterFrustum),e};z.prototype.equals=function(e){return!a(e)||!(e instanceof z)?!1:(j(this),j(e),this.width===e.width&&this.aspectRatio===e.aspectRatio&&this._offCenterFrustum.equals(e._offCenterFrustum))};z.prototype.equalsEpsilon=function(e,t,n){return!a(e)||!(e instanceof z)?!1:(j(this),j(e),P.equalsEpsilon(this.width,e.width,t,n)&&P.equalsEpsilon(this.aspectRatio,e.aspectRatio,t,n)&&this._offCenterFrustum.equalsEpsilon(e._offCenterFrustum,t,n))};var B=z;function S(e){e=m(e,m.EMPTY_OBJECT),this.left=e.left,this._left=void 0,this.right=e.right,this._right=void 0,this.top=e.top,this._top=void 0,this.bottom=e.bottom,this._bottom=void 0,this.near=m(e.near,1),this._near=this.near,this.far=m(e.far,5e8),this._far=this.far,this._cullingVolume=new $,this._perspectiveMatrix=new O,this._infinitePerspective=new O}function te(e){if(!a(e.right)||!a(e.left)||!a(e.top)||!a(e.bottom)||!a(e.near)||!a(e.far))throw new w("right, left, top, bottom, near, or far parameters are not set.");let t=e.top,n=e.bottom,f=e.right,p=e.left,_=e.near,s=e.far;if(t!==e._top||n!==e._bottom||p!==e._left||f!==e._right||_!==e._near||s!==e._far){if(e.near<=0||e.near>e.far)throw new w("near must be greater than zero and less than far.");e._left=p,e._right=f,e._top=t,e._bottom=n,e._near=_,e._far=s,e._perspectiveMatrix=O.computePerspectiveOffCenter(p,f,n,t,_,s,e._perspectiveMatrix),e._infinitePerspective=O.computeInfinitePerspectiveOffCenter(p,f,n,t,_,e._infinitePerspective)}}Object.defineProperties(S.prototype,{projectionMatrix:{get:function(){return te(this),this._perspectiveMatrix}},infiniteProjectionMatrix:{get:function(){return te(this),this._infinitePerspective}}});var Ce=new r,be=new r,Pe=new r,Oe=new r;S.prototype.computeCullingVolume=function(e,t,n){if(!a(e))throw new w("position is required.");if(!a(t))throw new w("direction is required.");if(!a(n))throw new w("up is required.");let f=this._cullingVolume.planes,p=this.top,_=this.bottom,s=this.right,y=this.left,i=this.near,c=this.far,d=r.cross(t,n,Ce),g=be;r.multiplyByScalar(t,i,g),r.add(e,g,g);let l=Pe;r.multiplyByScalar(t,c,l),r.add(e,l,l);let o=Oe;r.multiplyByScalar(d,y,o),r.add(g,o,o),r.subtract(o,e,o),r.normalize(o,o),r.cross(o,n,o),r.normalize(o,o);let h=f[0];return a(h)||(h=f[0]=new b),h.x=o.x,h.y=o.y,h.z=o.z,h.w=-r.dot(o,e),r.multiplyByScalar(d,s,o),r.add(g,o,o),r.subtract(o,e,o),r.cross(n,o,o),r.normalize(o,o),h=f[1],a(h)||(h=f[1]=new b),h.x=o.x,h.y=o.y,h.z=o.z,h.w=-r.dot(o,e),r.multiplyByScalar(n,_,o),r.add(g,o,o),r.subtract(o,e,o),r.cross(d,o,o),r.normalize(o,o),h=f[2],a(h)||(h=f[2]=new b),h.x=o.x,h.y=o.y,h.z=o.z,h.w=-r.dot(o,e),r.multiplyByScalar(n,p,o),r.add(g,o,o),r.subtract(o,e,o),r.cross(o,d,o),r.normalize(o,o),h=f[3],a(h)||(h=f[3]=new b),h.x=o.x,h.y=o.y,h.z=o.z,h.w=-r.dot(o,e),h=f[4],a(h)||(h=f[4]=new b),h.x=t.x,h.y=t.y,h.z=t.z,h.w=-r.dot(t,g),r.negate(t,o),h=f[5],a(h)||(h=f[5]=new b),h.x=o.x,h.y=o.y,h.z=o.z,h.w=-r.dot(o,l),this._cullingVolume};S.prototype.getPixelDimensions=function(e,t,n,f,p){if(te(this),!a(e)||!a(t))throw new w("Both drawingBufferWidth and drawingBufferHeight are required.");if(e<=0)throw new w("drawingBufferWidth must be greater than zero.");if(t<=0)throw new w("drawingBufferHeight must be greater than zero.");if(!a(n))throw new w("distance is required.");if(!a(f))throw new w("pixelRatio is required");if(f<=0)throw new w("pixelRatio must be greater than zero.");if(!a(p))throw new w("A result object is required.");let _=1/this.near,s=this.top*_,y=2*f*n*s/t;s=this.right*_;let i=2*f*n*s/e;return p.x=i,p.y=y,p};S.prototype.clone=function(e){return a(e)||(e=new S),e.right=this.right,e.left=this.left,e.top=this.top,e.bottom=this.bottom,e.near=this.near,e.far=this.far,e._left=void 0,e._right=void 0,e._top=void 0,e._bottom=void 0,e._near=void 0,e._far=void 0,e};S.prototype.equals=function(e){return a(e)&&e instanceof S&&this.right===e.right&&this.left===e.left&&this.top===e.top&&this.bottom===e.bottom&&this.near===e.near&&this.far===e.far};S.prototype.equalsEpsilon=function(e,t,n){return e===this||a(e)&&e instanceof S&&P.equalsEpsilon(this.right,e.right,t,n)&&P.equalsEpsilon(this.left,e.left,t,n)&&P.equalsEpsilon(this.top,e.top,t,n)&&P.equalsEpsilon(this.bottom,e.bottom,t,n)&&P.equalsEpsilon(this.near,e.near,t,n)&&P.equalsEpsilon(this.far,e.far,t,n)};var pe=S;function R(e){e=m(e,m.EMPTY_OBJECT),this._offCenterFrustum=new pe,this.fov=e.fov,this._fov=void 0,this._fovy=void 0,this._sseDenominator=void 0,this.aspectRatio=e.aspectRatio,this._aspectRatio=void 0,this.near=m(e.near,1),this._near=this.near,this.far=m(e.far,5e8),this._far=this.far,this.xOffset=m(e.xOffset,0),this._xOffset=this.xOffset,this.yOffset=m(e.yOffset,0),this._yOffset=this.yOffset}R.packedLength=6;R.pack=function(e,t,n){return F.typeOf.object("value",e),F.defined("array",t),n=m(n,0),t[n++]=e.fov,t[n++]=e.aspectRatio,t[n++]=e.near,t[n++]=e.far,t[n++]=e.xOffset,t[n]=e.yOffset,t};R.unpack=function(e,t,n){return F.defined("array",e),t=m(t,0),a(n)||(n=new R),n.fov=e[t++],n.aspectRatio=e[t++],n.near=e[t++],n.far=e[t++],n.xOffset=e[t++],n.yOffset=e[t],n};function T(e){if(!a(e.fov)||!a(e.aspectRatio)||!a(e.near)||!a(e.far))throw new w("fov, aspectRatio, near, or far parameters are not set.");let t=e._offCenterFrustum;if(e.fov!==e._fov||e.aspectRatio!==e._aspectRatio||e.near!==e._near||e.far!==e._far||e.xOffset!==e._xOffset||e.yOffset!==e._yOffset){if(e.fov<0||e.fov>=Math.PI)throw new w("fov must be in the range [0, PI).");if(e.aspectRatio<0)throw new w("aspectRatio must be positive.");if(e.near<0||e.near>e.far)throw new w("near must be greater than zero and less than far.");e._aspectRatio=e.aspectRatio,e._fov=e.fov,e._fovy=e.aspectRatio<=1?e.fov:Math.atan(Math.tan(e.fov*.5)/e.aspectRatio)*2,e._near=e.near,e._far=e.far,e._sseDenominator=2*Math.tan(.5*e._fovy),e._xOffset=e.xOffset,e._yOffset=e.yOffset,t.top=e.near*Math.tan(.5*e._fovy),t.bottom=-t.top,t.right=e.aspectRatio*t.top,t.left=-t.right,t.near=e.near,t.far=e.far,t.right+=e.xOffset,t.left+=e.xOffset,t.top+=e.yOffset,t.bottom+=e.yOffset}}Object.defineProperties(R.prototype,{projectionMatrix:{get:function(){return T(this),this._offCenterFrustum.projectionMatrix}},infiniteProjectionMatrix:{get:function(){return T(this),this._offCenterFrustum.infiniteProjectionMatrix}},fovy:{get:function(){return T(this),this._fovy}},sseDenominator:{get:function(){return T(this),this._sseDenominator}},offCenterFrustum:{get:function(){return T(this),this._offCenterFrustum}}});R.prototype.computeCullingVolume=function(e,t,n){return T(this),this._offCenterFrustum.computeCullingVolume(e,t,n)};R.prototype.getPixelDimensions=function(e,t,n,f,p){return T(this),this._offCenterFrustum.getPixelDimensions(e,t,n,f,p)};R.prototype.clone=function(e){return a(e)||(e=new R),e.aspectRatio=this.aspectRatio,e.fov=this.fov,e.near=this.near,e.far=this.far,e._aspectRatio=void 0,e._fov=void 0,e._near=void 0,e._far=void 0,this._offCenterFrustum.clone(e._offCenterFrustum),e};R.prototype.equals=function(e){return!a(e)||!(e instanceof R)?!1:(T(this),T(e),this.fov===e.fov&&this.aspectRatio===e.aspectRatio&&this._offCenterFrustum.equals(e._offCenterFrustum))};R.prototype.equalsEpsilon=function(e,t,n){return!a(e)||!(e instanceof R)?!1:(T(this),T(e),P.equalsEpsilon(this.fov,e.fov,t,n)&&P.equalsEpsilon(this.aspectRatio,e.aspectRatio,t,n)&&this._offCenterFrustum.equalsEpsilon(e._offCenterFrustum,t,n))};var L=R;var I=0,Fe=1;function Y(e){F.typeOf.object("options",e),F.typeOf.object("options.frustum",e.frustum),F.typeOf.object("options.origin",e.origin),F.typeOf.object("options.orientation",e.orientation);let t=e.frustum,n=e.orientation,f=e.origin,p=m(e.vertexFormat,A.DEFAULT),_=m(e._drawNearPlane,!0),s,y;t instanceof L?(s=I,y=L.packedLength):t instanceof B&&(s=Fe,y=B.packedLength),this._frustumType=s,this._frustum=t.clone(),this._origin=r.clone(f),this._orientation=N.clone(n),this._drawNearPlane=_,this._vertexFormat=p,this._workerName="createFrustumGeometry",this.packedLength=2+y+r.packedLength+N.packedLength+A.packedLength}Y.pack=function(e,t,n){F.typeOf.object("value",e),F.defined("array",t),n=m(n,0);let f=e._frustumType,p=e._frustum;return t[n++]=f,f===I?(L.pack(p,t,n),n+=L.packedLength):(B.pack(p,t,n),n+=B.packedLength),r.pack(e._origin,t,n),n+=r.packedLength,N.pack(e._orientation,t,n),n+=N.packedLength,A.pack(e._vertexFormat,t,n),n+=A.packedLength,t[n]=e._drawNearPlane?1:0,t};var xe=new L,ve=new B,ze=new N,Re=new r,qe=new A;Y.unpack=function(e,t,n){F.defined("array",e),t=m(t,0);let f=e[t++],p;f===I?(p=L.unpack(e,t,xe),t+=L.packedLength):(p=B.unpack(e,t,ve),t+=B.packedLength);let _=r.unpack(e,t,Re);t+=r.packedLength;let s=N.unpack(e,t,ze);t+=N.packedLength;let y=A.unpack(e,t,qe);t+=A.packedLength;let i=e[t]===1;if(!a(n))return new Y({frustum:p,origin:_,orientation:s,vertexFormat:y,_drawNearPlane:i});let c=f===n._frustumType?n._frustum:void 0;return n._frustum=p.clone(c),n._frustumType=f,n._origin=r.clone(_,n._origin),n._orientation=N.clone(s,n._orientation),n._vertexFormat=A.clone(y,n._vertexFormat),n._drawNearPlane=i,n};function W(e,t,n,f,p,_,s,y){let i=e/3*2;for(let c=0;c<4;++c)a(t)&&(t[e]=_.x,t[e+1]=_.y,t[e+2]=_.z),a(n)&&(n[e]=s.x,n[e+1]=s.y,n[e+2]=s.z),a(f)&&(f[e]=y.x,f[e+1]=y.y,f[e+2]=y.z),e+=3;p[i]=0,p[i+1]=0,p[i+2]=1,p[i+3]=0,p[i+4]=1,p[i+5]=1,p[i+6]=0,p[i+7]=1}var Te=new H,Me=new O,ne=new O,se=new r,le=new r,we=new r,ke=new r,Se=new r,De=new r,U=new Array(3),Z=new Array(4);Z[0]=new b(-1,-1,1,1);Z[1]=new b(1,-1,1,1);Z[2]=new b(1,1,1,1);Z[3]=new b(-1,1,1,1);var _e=new Array(4);for(let e=0;e<4;++e)_e[e]=new b;Y._computeNearFarPlanes=function(e,t,n,f,p,_,s,y){let i=H.fromQuaternion(t,Te),c=m(_,se),d=m(s,le),g=m(y,we);c=H.getColumn(i,0,c),d=H.getColumn(i,1,d),g=H.getColumn(i,2,g),r.normalize(c,c),r.normalize(d,d),r.normalize(g,g),r.negate(c,c);let l=O.computeView(e,g,d,c,Me),o,h,M=f.projectionMatrix;if(n===I){let x=O.multiply(M,l,ne);h=O.inverse(x,ne)}else o=O.inverseTransformation(l,ne);a(h)?(U[0]=f.near,U[1]=f.far):(U[0]=0,U[1]=f.near,U[2]=f.far);for(let x=0;x<2;++x)for(let v=0;v<4;++v){let C=b.clone(Z[v],_e[v]);if(a(h)){C=O.multiplyByVector(h,C,C);let D=1/C.w;r.multiplyByScalar(C,D,C),r.subtract(C,e,C),r.normalize(C,C);let K=r.dot(g,C);r.multiplyByScalar(C,U[x]/K,C),r.add(C,e,C)}else{let D=f.offCenterFrustum;a(D)&&(f=D);let K=U[x],G=U[x+1];C.x=(C.x*(f.right-f.left)+f.left+f.right)*.5,C.y=(C.y*(f.top-f.bottom)+f.bottom+f.top)*.5,C.z=(C.z*(K-G)-K-G)*.5,C.w=1,O.multiplyByVector(o,C,C)}p[12*x+v*3]=C.x,p[12*x+v*3+1]=C.y,p[12*x+v*3+2]=C.z}};Y.createGeometry=function(e){let t=e._frustumType,n=e._frustum,f=e._origin,p=e._orientation,_=e._drawNearPlane,s=e._vertexFormat,y=_?6:5,i=new Float64Array(3*4*6);Y._computeNearFarPlanes(f,p,t,n,i);let c=3*4*2;i[c]=i[3*4],i[c+1]=i[3*4+1],i[c+2]=i[3*4+2],i[c+3]=i[0],i[c+4]=i[1],i[c+5]=i[2],i[c+6]=i[3*3],i[c+7]=i[3*3+1],i[c+8]=i[3*3+2],i[c+9]=i[3*7],i[c+10]=i[3*7+1],i[c+11]=i[3*7+2],c+=3*4,i[c]=i[3*5],i[c+1]=i[3*5+1],i[c+2]=i[3*5+2],i[c+3]=i[3],i[c+4]=i[4],i[c+5]=i[5],i[c+6]=i[0],i[c+7]=i[1],i[c+8]=i[2],i[c+9]=i[3*4],i[c+10]=i[3*4+1],i[c+11]=i[3*4+2],c+=3*4,i[c]=i[3],i[c+1]=i[4],i[c+2]=i[5],i[c+3]=i[3*5],i[c+4]=i[3*5+1],i[c+5]=i[3*5+2],i[c+6]=i[3*6],i[c+7]=i[3*6+1],i[c+8]=i[3*6+2],i[c+9]=i[3*2],i[c+10]=i[3*2+1],i[c+11]=i[3*2+2],c+=3*4,i[c]=i[3*2],i[c+1]=i[3*2+1],i[c+2]=i[3*2+2],i[c+3]=i[3*6],i[c+4]=i[3*6+1],i[c+5]=i[3*6+2],i[c+6]=i[3*7],i[c+7]=i[3*7+1],i[c+8]=i[3*7+2],i[c+9]=i[3*3],i[c+10]=i[3*3+1],i[c+11]=i[3*3+2],_||(i=i.subarray(3*4));let d=new ae({position:new J({componentDatatype:u.DOUBLE,componentsPerAttribute:3,values:i})});if(a(s.normal)||a(s.tangent)||a(s.bitangent)||a(s.st)){let l=a(s.normal)?new Float32Array(12*y):void 0,o=a(s.tangent)?new Float32Array(3*4*y):void 0,h=a(s.bitangent)?new Float32Array(3*4*y):void 0,M=a(s.st)?new Float32Array(2*4*y):void 0,x=se,v=le,C=we,D=r.negate(x,ke),K=r.negate(v,Se),G=r.negate(C,De);c=0,_&&(W(c,l,o,h,M,G,x,v),c+=3*4),W(c,l,o,h,M,C,D,v),c+=3*4,W(c,l,o,h,M,D,G,v),c+=3*4,W(c,l,o,h,M,K,G,D),c+=3*4,W(c,l,o,h,M,x,C,v),c+=3*4,W(c,l,o,h,M,v,C,D),a(l)&&(d.normal=new J({componentDatatype:u.FLOAT,componentsPerAttribute:3,values:l})),a(o)&&(d.tangent=new J({componentDatatype:u.FLOAT,componentsPerAttribute:3,values:o})),a(h)&&(d.bitangent=new J({componentDatatype:u.FLOAT,componentsPerAttribute:3,values:h})),a(M)&&(d.st=new J({componentDatatype:u.FLOAT,componentsPerAttribute:2,values:M}))}let g=new Uint16Array(6*y);for(let l=0;l<y;++l){let o=l*6,h=l*4;g[o]=h,g[o+1]=h+1,g[o+2]=h+2,g[o+3]=h,g[o+4]=h+2,g[o+5]=h+3}return new re({attributes:d,indices:g,primitiveType:oe.TRIANGLES,boundingSphere:ie.fromVertices(i)})};var Et=Y;export{B as a,L as b,Et as c};