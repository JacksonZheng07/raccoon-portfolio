/*
 * Inline copy of public/assets/raccoon/raccoon-hero.svg. The .svg file is the
 * source of truth for the drawing; this component exists so the artwork can
 * inherit `currentColor` and be styled with Tailwind text utilities.
 * tests/unit/raccoon-assets.test.ts asserts the two stay identical.
 */
export function RaccoonHero({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 340 320"
      className={className}
      role="img"
      aria-label="Ink line drawing of a raccoon head and shoulders in three-quarter view, with its masked face, pointed snout and ringed tail"
    >
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* ringed tail, behind the body */}
        <path d="M 284.7 298.7 L 288.6 293.5 L 292.1 288.0 L 295.2 282.3 L 297.9 276.4 L 300.3 270.4 L 302.3 264.2 L 304.0 257.9 L 305.3 251.5 L 306.3 244.9 L 307.0 238.3 L 307.3 231.7 L 307.3 225.0 L 307.0 218.2 L 306.3 211.5 L 305.3 204.7 L 304.0 198.0 L 302.4 191.3 L 300.4 184.6 L 298.0 178.1 L 295.3 171.6 L 292.3 165.2 L 289.0 158.9 L 285.2 152.8 L 281.1 146.9 L 276.7 141.1 L 271.9 135.6 L 252.1 152.4 L 255.5 157.1 L 258.6 162.0 L 261.3 166.9 L 263.8 172.0 L 266.0 177.2 L 267.9 182.4 L 269.5 187.6 L 270.9 192.9 L 271.9 198.2 L 272.7 203.5 L 273.2 208.8 L 273.4 214.1 L 273.4 219.2 L 273.2 224.3 L 272.7 229.3 L 271.9 234.2 L 270.9 238.9 L 269.7 243.4 L 268.3 247.8 L 266.7 252.0 L 264.9 255.9 L 263.0 259.6 L 260.9 263.1 L 258.6 266.2 L 256.2 269.1 L 253.8 271.7 Z" fill="var(--color-paper, #f7f3e9)"/>
        <path d="M 291.6 288.8 L 293.4 285.8 L 295.0 282.7 L 296.6 279.5 L 298.0 276.3 L 299.3 273.0 L 300.5 269.7 L 301.6 266.4 L 302.7 263.0 L 267.0 251.2 L 266.1 253.4 L 265.1 255.5 L 264.1 257.6 L 263.0 259.5 L 261.9 261.4 L 260.7 263.2 L 259.5 265.0 L 258.3 266.6 Z" fill="currentColor" stroke="none"/>
        <path d="M 306.9 239.0 L 307.1 235.4 L 307.3 231.8 L 307.3 228.1 L 307.3 224.5 L 307.1 220.8 L 306.9 217.2 L 306.5 213.5 L 306.1 209.9 L 273.4 212.8 L 273.5 215.6 L 273.4 218.4 L 273.4 221.2 L 273.2 224.0 L 273.0 226.7 L 272.6 229.4 L 272.3 232.0 L 271.8 234.6 Z" fill="currentColor" stroke="none"/>
        <path d="M 300.5 184.9 L 299.2 181.4 L 297.9 177.8 L 296.5 174.3 L 295.0 170.8 L 293.4 167.3 L 291.7 163.9 L 289.8 160.5 L 287.9 157.2 L 263.2 170.6 L 264.4 173.3 L 265.6 176.1 L 266.7 178.9 L 267.7 181.7 L 268.6 184.6 L 269.5 187.4 L 270.2 190.3 L 270.9 193.2 Z" fill="currentColor" stroke="none"/>
        <path d="M 291.6 288.8 L 293.4 285.8 L 295.0 282.7 L 296.6 279.5 L 298.0 276.3 L 299.3 273.0 L 300.5 269.7 L 301.6 266.4 L 302.7 263.0 L 267.0 251.2 L 266.1 253.4 L 265.1 255.5 L 264.1 257.6 L 263.0 259.5 L 261.9 261.4 L 260.7 263.2 L 259.5 265.0 L 258.3 266.6 Z"/>
        <path d="M 306.9 239.0 L 307.1 235.4 L 307.3 231.8 L 307.3 228.1 L 307.3 224.5 L 307.1 220.8 L 306.9 217.2 L 306.5 213.5 L 306.1 209.9 L 273.4 212.8 L 273.5 215.6 L 273.4 218.4 L 273.4 221.2 L 273.2 224.0 L 273.0 226.7 L 272.6 229.4 L 272.3 232.0 L 271.8 234.6 Z"/>
        <path d="M 300.5 184.9 L 299.2 181.4 L 297.9 177.8 L 296.5 174.3 L 295.0 170.8 L 293.4 167.3 L 291.7 163.9 L 289.8 160.5 L 287.9 157.2 L 263.2 170.6 L 264.4 173.3 L 265.6 176.1 L 266.7 178.9 L 267.7 181.7 L 268.6 184.6 L 269.5 187.4 L 270.2 190.3 L 270.9 193.2 Z"/>
        
        {/* shoulders: filled to mask the tail root, then drawn as open lines */}
        <path d="M 86 190 C 56 210 40 250 34 318 L 268 318 C 264 250 250 204 232 182 C 200 150 120 150 86 190 Z" fill="var(--color-paper, #f7f3e9)" stroke="none"/>
        <path d="M 88 194 C 60 214 44 252 38 318"/>
        <path d="M 230 186 C 248 212 260 254 264 318"/>
        
        {/* chest ruff */}
        <path d="M 104 244 C 128 274 190 278 218 250"/>
        <path d="M 134 266 C 136 274 138 278 137 283"/>
        <path d="M 158 273 C 160 281 161 286 160 291"/>
        <path d="M 182 272 C 185 280 186 285 185 290"/>
        <path d="M 205 262 C 209 269 211 274 211 279"/>
        
        {/* head */}
        <path d="M 100 96 C 118 72 182 68 212 92 C 236 110 240 150 232 178 C 224 212 198 240 168 248 C 150 252 132 246 122 232 C 112 226 100 224 98 210 C 96 196 106 188 102 172 C 94 152 80 140 84 124 C 86 108 92 100 100 96 Z" fill="var(--color-paper, #f7f3e9)"/>
        
        {/* ears */}
        <path d="M 100 96 C 88 76 82 58 92 52 C 104 46 124 62 132 82" fill="var(--color-paper, #f7f3e9)"/>
        <path d="M 102 84 C 98 74 98 66 102 62"/>
        <path d="M 212 92 C 222 72 234 58 242 62 C 250 68 246 86 236 100" fill="var(--color-paper, #f7f3e9)"/>
        <path d="M 220 88 C 226 78 232 72 236 70"/>
        
        {/* cheek fur */}
        <path d="M 233 176 l 15 5"/>
        <path d="M 227 196 l 15 7"/>
        <path d="M 215 214 l 13 10"/>
        
        {/* bandit mask */}
        <path d="M 92 148 C 90 126 102 114 120 116 C 134 118 142 130 150 140 C 158 128 170 114 188 112 C 210 110 224 124 224 146 C 224 168 208 180 188 176 C 170 172 158 160 150 150 C 142 162 130 176 112 176 C 96 176 94 164 92 148 Z" fill="currentColor" stroke="none"/>
        <path d="M 92 148 C 90 126 102 114 120 116 C 134 118 142 130 150 140 C 158 128 170 114 188 112 C 210 110 224 124 224 146 C 224 168 208 180 188 176 C 170 172 158 160 150 150 C 142 162 130 176 112 176 C 96 176 94 164 92 148 Z"/>
        
        {/* eyes */}
        <path d="M 108 146 C 108 138 114 133 120 133 C 127 133 132 138 132 146 C 132 154 127 159 120 159 C 114 159 108 154 108 146 Z" fill="var(--color-paper, #f7f3e9)"/>
        <circle cx="121" cy="147" r="3.5" fill="currentColor" stroke="none"/>
        <path d="M 182 144 C 182 136 188 131 195 131 C 202 131 207 136 207 144 C 207 152 202 157 195 157 C 188 157 182 152 182 144 Z" fill="var(--color-paper, #f7f3e9)"/>
        <circle cx="194" cy="145" r="3.5" fill="currentColor" stroke="none"/>
        
        {/* forehead blaze, between the ears */}
        <path d="M 146 106 C 144 96 143 88 146 80"/>
        <path d="M 162 104 C 164 94 166 88 164 80"/>
        
        {/* snout */}
        <path d="M 104 182 C 116 178 132 182 140 192 C 146 200 146 212 140 220 C 132 230 116 234 106 228"/>
        <path d="M 106 196 C 110 190 126 190 130 198 C 133 205 124 214 118 214 C 111 214 103 204 106 196 Z" fill="currentColor" stroke="none"/>
        <path d="M 118 214 L 118 223"/>
        <path d="M 118 223 C 113 231 105 231 101 226"/>
        <path d="M 118 223 C 124 231 132 230 135 224"/>
        
        {/* whiskers */}
        <path d="M 100 196 L 76 186"/>
        <path d="M 99 206 L 73 204"/>
        <path d="M 101 215 L 78 220"/>
      </g>
    </svg>
  );
}

export default RaccoonHero;
