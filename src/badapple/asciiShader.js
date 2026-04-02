export const vertexShader = `
void main() {
  gl_Position = vec4(position, 1.0);
}
`;

export const fragmentShader = `
uniform sampler2D tVideo;
uniform sampler2D uCharMap;
uniform float uCharCount;
uniform vec2 uResolution;

float getBrightness(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}

void main() {
  float charSize = 4.0; 
  vec2 blockUv = floor(gl_FragCoord.xy / charSize) * charSize / uResolution;

  // Cor original do vídeo
  vec3 color = texture2D(tVideo, blockUv).rgb;
  float brightness = getBrightness(color);

  // Coordenadas locais dentro do "bloco de caractere" (0.0 a 1.0)
  vec2 local = mod(gl_FragCoord.xy, charSize) / charSize;
  
  // Selecionar o caractere baseado no brilho (inverso)
  // Brilho 1.0 -> Indice 0 (@), Brilho 0.0 -> Indice uCharCount-1 (espaço)
  float charIndex = floor((1.0 - brightness) * (uCharCount - 0.01));
  
  // Calcular as UVs para o sprite sheet
  // O sprite sheet é uma linha horizontal de caracteres
  vec2 charUv = vec2(
    (local.x + charIndex) / uCharCount,
    local.y
  );

  float charPattern = texture2D(uCharMap, charUv).r;

  // Transparência total se for muito escuro
  float alpha = brightness > 0.05 ? 1.0 : 0.0;
  
  gl_FragColor = vec4(vec3(charPattern), charPattern * alpha);
}
`;
