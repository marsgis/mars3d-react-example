importScripts("./sl.algo.js")
importScripts("./three.min.js")

/**
 * @param  {Array<BufferGeometry>} geometries
 * @param  {Boolean} useGroups
 * @return {BufferGeometry}
 */
function mergeBufferGeometries(geometries, useGroups = false) {
  const isIndexed = geometries[0].index !== null
  const attributesUsed = new Set(Object.keys(geometries[0].attributes))
  const morphAttributesUsed = new Set(Object.keys(geometries[0].morphAttributes))
  const attributes = {}
  const morphAttributes = {}
  const morphTargetsRelative = geometries[0].morphTargetsRelative
  const mergedGeometry = new THREE.BufferGeometry()
  let offset = 0

  for (let i = 0; i < geometries.length; ++i) {
    const geometry = geometries[i]
    let attributesCount = 0 // ensure that all geometries are indexed, or none

    if (isIndexed !== (geometry.index !== null)) {
      console.error(
        "BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index " +
          i +
          ". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."
      )
      return null
    } // gather attributes, exit early if they're different

    for (const name in geometry.attributes) {
      if (!attributesUsed.has(name)) {
        console.error(
          "BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index " +
            i +
            '. All geometries must have compatible attributes; make sure "' +
            name +
            '" attribute exists among all geometries, or in none of them.'
        )
        return null
      }

      if (attributes[name] === undefined) attributes[name] = []
      attributes[name].push(geometry.attributes[name])
      attributesCount++
    } // ensure geometries have the same number of attributes

    if (attributesCount !== attributesUsed.size) {
      console.error(
        "BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index " +
          i +
          ". Make sure all geometries have the same number of attributes."
      )
      return null
    } // gather morph attributes, exit early if they're different

    if (morphTargetsRelative !== geometry.morphTargetsRelative) {
      console.error(
        "BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index " +
          i +
          ". .morphTargetsRelative must be consistent throughout all geometries."
      )
      return null
    }

    for (const name in geometry.morphAttributes) {
      if (!morphAttributesUsed.has(name)) {
        console.error(
          "BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index " +
            i +
            ".  .morphAttributes must be consistent throughout all geometries."
        )
        return null
      }

      if (morphAttributes[name] === undefined) morphAttributes[name] = []
      morphAttributes[name].push(geometry.morphAttributes[name])
    } // gather .userData

    mergedGeometry.userData.mergedUserData = mergedGeometry.userData.mergedUserData || []
    mergedGeometry.userData.mergedUserData.push(geometry.userData)

    if (useGroups) {
      let count

      if (isIndexed) {
        count = geometry.index.count
      } else if (geometry.attributes.position !== undefined) {
        count = geometry.attributes.position.count
      } else {
        console.error(
          "BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index " +
            i +
            ". The geometry must have either an index or a position attribute"
        )
        return null
      }

      mergedGeometry.addGroup(offset, count, i)
      offset += count
    }
  } // merge indices

  if (isIndexed) {
    let indexOffset = 0
    const mergedIndex = []

    for (let i = 0; i < geometries.length; ++i) {
      const index = geometries[i].index

      for (let j = 0; j < index.count; ++j) {
        mergedIndex.push(index.getX(j) + indexOffset)
      }

      indexOffset += geometries[i].attributes.position.count
    }

    mergedGeometry.setIndex(mergedIndex)
  } // merge attributes

  for (const name in attributes) {
    const mergedAttribute = mergeBufferAttributes(attributes[name])

    if (!mergedAttribute) {
      console.error("BufferGeometryUtils: .mergeBufferGeometries() failed while trying to merge the " + name + " attribute.")
      return null
    }

    mergedGeometry.setAttribute(name, mergedAttribute)
  } // merge morph attributes

  for (const name in morphAttributes) {
    const numMorphTargets = morphAttributes[name][0].length
    if (numMorphTargets === 0) break
    mergedGeometry.morphAttributes = mergedGeometry.morphAttributes || {}
    mergedGeometry.morphAttributes[name] = []

    for (let i = 0; i < numMorphTargets; ++i) {
      const morphAttributesToMerge = []

      for (let j = 0; j < morphAttributes[name].length; ++j) {
        morphAttributesToMerge.push(morphAttributes[name][j][i])
      }

      const mergedMorphAttribute = mergeBufferAttributes(morphAttributesToMerge)

      if (!mergedMorphAttribute) {
        console.error("BufferGeometryUtils: .mergeBufferGeometries() failed while trying to merge the " + name + " morphAttribute.")
        return null
      }

      mergedGeometry.morphAttributes[name].push(mergedMorphAttribute)
    }
  }

  return mergedGeometry
}
/**
 * @param {Array<BufferAttribute>} attributes
 * @return {BufferAttribute}
 */
function mergeBufferAttributes(attributes) {
  let TypedArray
  let itemSize
  let normalized
  let arrayLength = 0

  for (let i = 0; i < attributes.length; ++i) {
    const attribute = attributes[i]

    if (attribute.isInterleavedBufferAttribute) {
      console.error("BufferGeometryUtils: .mergeBufferAttributes() failed. InterleavedBufferAttributes are not supported.")
      return null
    }

    if (TypedArray === undefined) TypedArray = attribute.array.constructor

    if (TypedArray !== attribute.array.constructor) {
      console.error(
        "BufferGeometryUtils: .mergeBufferAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."
      )
      return null
    }

    if (itemSize === undefined) itemSize = attribute.itemSize

    if (itemSize !== attribute.itemSize) {
      console.error("BufferGeometryUtils: .mergeBufferAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.")
      return null
    }

    if (normalized === undefined) normalized = attribute.normalized

    if (normalized !== attribute.normalized) {
      console.error("BufferGeometryUtils: .mergeBufferAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.")
      return null
    }

    arrayLength += attribute.array.length
  }

  const array = new TypedArray(arrayLength)
  let offset = 0

  for (let i = 0; i < attributes.length; ++i) {
    array.set(attributes[i].array, offset)
    offset += attributes[i].array.length
  }

  return new THREE.BufferAttribute(array, itemSize, normalized)
}

const radii = 6378.137
const radiiSquaredX = radii * radii
const radiiSquaredY = radiiSquaredX
const radiiSquaredZ = 6356.7523142451793 * 6356.7523142451793
const rad2Deg = 57.29577951308232
const PI = 3.141592653589793
const deg2Rad = PI / 180
const radiiSquared = [radiiSquaredX * 1000000, radiiSquaredY * 1000000, radiiSquaredZ * 1000000]

function normalize(x, y, z) {
  const len = Math.sqrt(x * x + y * y + z * z)
  return [x / len, y / len, z / len]
}

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
}

function deg2cartesian(deg) {
  const geoX = deg2Rad * deg[0]
  const geoY = deg2Rad * deg[1]
  const geoZ = deg[2]
  const cosLat = Math.cos(geoY)
  const snX = cosLat * Math.cos(geoX)
  const snY = cosLat * Math.sin(geoX)
  const snZ = Math.sin(geoY)
  let sn = normalize(snX, snY, snZ)
  let sk = [radiiSquared[0] * sn[0], radiiSquared[1] * sn[1], radiiSquared[2] * sn[2]]
  const gamma = Math.sqrt(dot(sn, sk))
  sk = [sk[0] / gamma, sk[1] / gamma, sk[2] / gamma]
  sn = [sn[0] * geoZ, sn[1] * geoZ, sn[2] * geoZ]
  return [sk[0] + sn[0], sk[1] + sn[1], sk[2] + sn[2]]
}

onmessage = (args) => {
  const res = sl(args)
  if (res.message.streamlines.length === 0) {
    postMessage(res.message, res.transfers)
    return
  }
  const geometries = []
  const tubularSegmentsTimes = args.data.tubularSegmentsTimes || 1
  const radius = args.data.radius || 3000
  const radiusSegment = args.data.radiusSegment || 45
  res.message.streamlines.forEach((line) => {
    const vectors = []
    line.forEach((c) => {
      const coords = deg2cartesian(c)
      vectors.push(new THREE.Vector3(coords[0], coords[1], coords[2]))
    })
    const curve = new THREE.CatmullRomCurve3(vectors, false)
    const geo = new THREE.TubeGeometry(curve, parseInt(line.length * tubularSegmentsTimes), radius, radiusSegment, false)
    geometries.push(geo)
  })
  const allGeo = mergeBufferGeometries(geometries, false)
  const message = {
    ...res.message,
    vertices: allGeo.attributes.position.array.buffer,
    indices: allGeo.index.array.buffer,
    normals: allGeo.attributes.normal.array.buffer,
    st: allGeo.attributes.uv.array.buffer,
    indiceByteLen: allGeo.index.array.BYTES_PER_ELEMENT
  }
  res.transfers.push(message.vertices, message.indices, message.normals, message.st)
  postMessage(message, res.transfers)
}
