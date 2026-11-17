import { AcGiLineTypePatternElement } from '@mlightcad/data-model'
import * as THREE from 'three'

import {
  isComplexPatternElement,
  normalizeComplexPatternElement
} from '../linetype'

/**
 * Half the on-screen length, in pixels, of a dot (a pattern element of length
 * 0), and the shortest half-length a dash is drawn with.
 */
const DOT_HALF_PIXELS = 1

export class AcTrLinePatternShaders {
  /**
   * Creates line shader by given pattern.
   * Note: remember to call line.computeLineDistances() in order to make it work!
   */
  static createLineShaderMaterial(
    pattern: AcGiLineTypePatternElement[],
    color: number,
    scale: number,
    viewportScaleUniform: number,
    cameraZoomUniform: { value: number }
  ): THREE.Material {
    let totalLength = 0.0

    const ltypeElementLenArr: number[] = []
    for (let i = 0; i < pattern.length; i++) {
      // TEXT/SHAPE elements are expanded by `buildComplexLineTypeGeometry`.
      // Skip them here. Density fallback also uses this shader: glyphs are
      // omitted and the remaining dash/gap cycle is shorter than AutoCAD's.
      const normalized = normalizeComplexPatternElement(pattern[i])
      if (isComplexPatternElement(normalized)) {
        continue
      }
      const len = pattern[i].elementLength * scale
      ltypeElementLenArr.push(len)
      totalLength += Math.abs(len)
    }
    // Dots (length 0) stay 0 here: the shader draws them a few pixels long
    // at any zoom (see DOT_HALF_PIXELS). A dot stand-in in drawing units
    // vanishes in drawings in millimetres (sub-pixel at a whole-sheet zoom).
    if (ltypeElementLenArr.length === 0 || totalLength <= 0) {
      ltypeElementLenArr.length = 0
      ltypeElementLenArr.push(1)
      totalLength = 1
    }

    return this.createLineShaderMaterialFromScaledPattern(
      ltypeElementLenArr,
      totalLength,
      color,
      viewportScaleUniform,
      cameraZoomUniform
    )
  }

  /**
   * Creates a linetype shader from pre-scaled pattern values.
   * Used by HTML export playback where pattern uniforms are serialized directly.
   */
  static createLineShaderMaterialFromScaledPattern(
    pattern: number[],
    patternLength: number,
    color: number,
    viewportScaleUniform: number,
    cameraZoomUniform: { value: number }
  ): THREE.Material {
    const uniforms = THREE.UniformsUtils.merge([
      THREE.UniformsLib.common,
      {
        pattern: { value: pattern },
        patternLength: { value: patternLength },
        u_color: { value: new THREE.Color(color) }
      }
    ])

    uniforms.u_viewportScale = { value: viewportScaleUniform }
    uniforms.u_cameraZoom = cameraZoomUniform

    const vertexShader = /*glsl*/ `
            attribute float lineDistance;
            varying float vLineDistance;

            #include <clipping_planes_pars_vertex>

            void main() {
                vLineDistance = lineDistance;

                #include <begin_vertex>
                #include <project_vertex>
                #include <clipping_planes_vertex>
            }`

    const fragmentShader = /*glsl*/ `
            precision highp float;

            uniform mat4 modelMatrix;
            uniform vec3 diffuse;
            uniform vec3 u_color;
            uniform float opacity;
            uniform float pattern[${pattern.length}];
            uniform float patternLength;
            uniform float u_viewportScale;
            uniform float u_cameraZoom;
            varying float vLineDistance;

            #include <clipping_planes_pars_fragment>

            vec2 getWorldScale() {
                return vec2(length(modelMatrix[0].xyz), length(modelMatrix[1].xyz));
            }

            void main() {

                #include <clipping_planes_fragment>

                // vec2 worldScale = getWorldScale();
                // float averageScale = (abs(worldScale.x) + abs(worldScale.y))/2.0;
                // When zoomed out to a certain extent, it is displayed as a solid line.
                if(patternLength * u_viewportScale * u_cameraZoom/1.5 < 1.0){
                    gl_FragColor = vec4(u_color, opacity);
                    #include <colorspace_fragment>
                    return;
                }

                float scaledLength = patternLength * u_viewportScale;
                float pos = mod(vLineDistance, scaledLength);
                // Half the on-screen length of a dot, in the units of pos.
                // Dashes are never drawn shorter than a dot either.
                float dotHalf = ${DOT_HALF_PIXELS.toFixed(1)} / u_cameraZoom;
                float start = 0.0;
                bool penDown = false;

                for ( int i = 0; i < ${pattern.length}; i++ ) {
                    float len = abs(pattern[i] * u_viewportScale);
                    if ( pattern[i] >= 0.0 ) {
                        if ( pos >= start && pos < start + len ) {
                            penDown = true;
                        } else {
                            float d = abs(pos - (start + len * 0.5));
                            d = min(d, scaledLength - d);
                            if ( d <= dotHalf ) penDown = true;
                        }
                    }
                    start += len;
                }
                if ( !penDown ) discard;
                gl_FragColor = vec4(u_color, opacity);
                #include <colorspace_fragment>
            }`

    return new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      clipping: true
    })
  }
}
