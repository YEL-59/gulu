# Custom SVG Icons

This folder contains all custom SVG icons for the Gulu marketplace.

## Folder Structure

```
src/components/icons/
├── SvgIcon.jsx          # Main reusable SVG component
├── README.md            # This file
└── [individual icons]   # Individual icon components (optional)

public/icons/
├── social/              # Social media icons
├── navigation/          # Navigation icons  
├── ui/                  # UI icons (arrows, buttons, etc.)
└── brand/               # Brand/logo icons
```

## How to Add Your Figma SVG Icons

### Method 1: Add to SvgIcon.jsx (Recommended)
1. Export your SVG from Figma
2. Copy the SVG path/content
3. Add it to the `icons` object in `SvgIcon.jsx`
4. Export a named component at the bottom

Example:
```jsx
// In the icons object
myIcon: (
  <svg viewBox="0 0 24 24" fill={fill} stroke={stroke} className={className} {...props}>
    <path d="YOUR_SVG_PATH_HERE"/>
  </svg>
),

// At the bottom
export const MyIcon = (props) => <SvgIcon name="myIcon" {...props} />
```

### Method 2: Individual Files
1. Create individual `.jsx` files for each icon
2. Use the same structure as SvgIcon component
3. Import where needed

## Usage Examples

```jsx
import SvgIcon, { FacebookIcon, SearchIcon } from '@/components/icons/SvgIcon'

// Method 1: Using the main component
<SvgIcon name="facebook" className="w-6 h-6 text-blue-600" />

// Method 2: Using named exports
<FacebookIcon className="w-6 h-6 text-blue-600" />
<SearchIcon className="w-5 h-5 text-gray-500" />

// With custom props
<SvgIcon 
  name="heart" 
  className="w-8 h-8" 
  fill="red" 
  stroke="none"
/>
```

## Props

- `name`: Icon name (string)
- `className`: CSS classes (default: "w-6 h-6")
- `fill`: Fill color (default: "currentColor")
- `stroke`: Stroke color (default: "none")
- `...props`: Any additional SVG props

## Tips for Figma Export

1. Select your icon in Figma
2. Right-click → Copy/Paste → Copy as SVG
3. Clean up the SVG:
   - Remove `width` and `height` attributes
   - Keep `viewBox`
   - Replace colors with `{fill}` or `{stroke}`
   - Simplify paths if possible

## Icon Categories

### Social Media
- Facebook, Twitter, Instagram, LinkedIn, YouTube, Telegram

### Navigation  
- Search, User, Heart, Cart, Menu, Close

### UI Elements
- Chevron Down, Chevron Right, Arrows, etc.

### Brand
- Logo variations, brand symbols

Add your custom icons following the same pattern!
