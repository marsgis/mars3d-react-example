/* eslint-disable */
import init, { MarchingCubes } from './mcb.bindings.js'

var getArr = function (data, dataType) {
    switch (dataType) {
        case 1:
            return new Uint8Array(data);
        case 0:
            return new Int8Array(data);
        case 3:
            return new Uint16Array(data);
        case 2:
            return new Int16Array(data);
        case 5:
            return new Uint32Array(data);
        case 4:
            return new Int32Array(data);
        case 6:
            return new Float32Array(data);
        case 7:
            return new Float64Array(data);
        default:
            throw new Error('not supported grid data type ' + this.dataType);
    }
}

var marchingCubes;
onmessage = (event) => {
    // const now=performance.now();
    var config = event.data;
    var data = getArr(config.raw, config.dataType);  //Float32Array(levels*ySize*xSize)
    var levels = config.levels;
    var xSize = config.xSize;
    var ySize = config.ySize;
    var scale = config.scale === undefined ? 1 : config.scale;
    var offset = config.offset === undefined ? 0 : config.offset;
    var scaleFirst = config.scaleFirst === undefined ? true : config.scaleFirst;
    var hasOuter = config.hasOuter;
    if (hasOuter) {
        scale = config.outerScale === undefined ? 1 : config.outerScale;
        offset = config.outerOffset === undefined ? 0 : config.outerOffset;
    }
    var undef = config.undef;
    var undef_fill = config.undef_fill||0;
    var anaValue = config.anaValue;

    var mcbFunc = () => {
        marchingCubes.set_volume(data, xSize, ySize, levels, scale, offset, scaleFirst, undef, undef_fill);
        var verticesArray =new Float32Array(marchingCubes.marching_cubes(anaValue));
        // console.log("mcb thread costs "+(performance.now()-now)+"ms");
        if (config.noShared) {
            postMessage({ anaValue: anaValue, vertices: verticesArray.buffer, source: config.raw }, [verticesArray.buffer, config.raw])
        } else {
            postMessage({ anaValue: anaValue, vertices: verticesArray.buffer }, [verticesArray.buffer])
        }
    };

    if (marchingCubes) {
        // console.log("reuse mcb instance");
        mcbFunc();
    } else {
        init("mcb.wasm").then(() => {
            marchingCubes = MarchingCubes.new();
            mcbFunc();
        });
    }



}
