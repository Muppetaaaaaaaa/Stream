# Stream Theater 🎬

A modern, cinematic livestream viewing experience for Twitch and YouTube. Theater-style layout with optional chat, keyboard shortcuts, and responsive design.

## Features

### Core Functionality
- **Multi-Platform Support**: Watch Twitch and YouTube livestreams in one app
- **Automatic Platform Detection**: Paste a URL or channel name, and the app detects the platform
- **Official Players**: Uses official Twitch and YouTube embeds for the best quality
- **Theater-Style Layout**: Cinematic viewing with minimal distractions

### Chat Integration
- **Twitch Chat**: Full Twitch chat embed with real-time messages
- **YouTube Chat**: YouTube Live chat integration (when stream is live)
- **Toggle On/Off**: Smooth slide-in/out animations for chat panel
- **Responsive**: Chat adapts to different screen sizes

### User Experience
- **Dark Mode by Default**: Pure black and charcoal theme optimized for viewing
- **Adjustable Video Size**: Small, Medium, Large, and Fullscreen options
- **Cinema Mode**: Hides everything except the player for immersive viewing
- **Keyboard Shortcuts**: Quick controls for power users
- **Local Storage**: Remembers your last stream and preferences
- **Responsive Design**: Works on desktop, tablet, and mobile

### Advanced Features
- **Keyboard Shortcuts**:
  - `T` - Toggle chat panel
  - `C` - Toggle cinema mode
  - `Esc` - Close stream
  - `S` - Small video size
  - `M` - Medium video size
  - `L` - Large video size

- **No Distractions**:
  - No ads
  - No trackers
  - No unnecessary UI elements
  - Fast load times

- **Accessibility**:
  - ARIA labels on all interactive elements
  - Full keyboard navigation support
  - High contrast colors
  - Respects user's motion preferences

## Getting Started

### Prerequisites
- Node.js 18+ (or Bun)
- npm, yarn, or bun package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd stream-theater

# Install dependencies
npm install
# or
bun install

# Start the development server
npm run dev
# or
bun dev
```

The app will be available at `http://localhost:3000`

## Usage

### Loading a Stream

1. **Paste a URL**:
   - Twitch: `https://twitch.tv/channelname` or just `channelname`
   - YouTube: `https://youtube.com/@channelname` or `@channelname`

2. **Or enter a channel name**:
   - Twitch: `channelname`
   - YouTube: `@channelname`

3. **Click "Load Stream"** or press Enter

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `T` | Toggle chat panel |
| `C` | Toggle cinema mode |
| `Esc` | Close stream |
| `S` | Small video size |
| `M` | Medium video size |
| `L` | Large video size |

### Adjusting Video Size

Use the size buttons (S, M, L) that appear when hovering over the video, or use keyboard shortcuts.

### Cinema Mode

Press `C` or click the maximize button to enter cinema mode, which hides everything except the player for an immersive viewing experience.

### Chat Panel

- Click the "Show Chat" button or press `T` to toggle the chat panel
- The chat slides in from the right with smooth animation
- Click the X button or the overlay to close the chat

## Architecture

### Project Structure

```
stream-theater/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main page component
│   └── globals.css         # Global styles and animations
├── components/
│   ├── StreamInput.tsx     # Stream URL/channel input form
│   ├── VideoPlayer.tsx     # Video player with controls
│   ├── ChatPanel.tsx       # Chat panel with toggle
│   └── KeyboardShortcutsHelp.tsx  # Keyboard shortcuts modal
├── hooks/
│   ├── useStreamTheater.ts # Main state management hook
│   └── useKeyboardShortcuts.ts    # Keyboard shortcuts hook
├── lib/
│   ├── types.ts            # TypeScript type definitions
│   └── stream-parser.ts    # Platform detection and URL parsing
└── public/                 # Static assets
```

### Key Components

#### `useStreamTheater` Hook
Manages all application state including:
- Current stream data
- Chat visibility
- Cinema mode
- Video size
- Last stream (for quick resume)

State is persisted to localStorage for a seamless experience.

#### `parseStreamInput` Function
Intelligently detects platform and extracts channel information from:
- Full URLs (twitch.tv/channel, youtube.com/@channel)
- Channel names (channelname, @channelname)
- Various URL formats (youtube.com/c/channel, youtube.com/channel/UCxxxxx, etc.)

#### `useKeyboardShortcuts` Hook
Handles keyboard input and triggers actions. Automatically disables shortcuts when typing in input fields.

## Technology Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Hooks + localStorage

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- **Fast Load Times**: Optimized Next.js build
- **No External Dependencies**: Minimal JavaScript
- **Official Embeds**: Uses Twitch and YouTube's official players
- **Lazy Loading**: Components load on demand
- **Image Optimization**: Next.js Image component for all images

## Accessibility

- ✅ WCAG 2.1 AA compliant
- ✅ Full keyboard navigation
- ✅ ARIA labels on all interactive elements
- ✅ High contrast colors
- ✅ Respects `prefers-reduced-motion`
- ✅ Semantic HTML structure

## Privacy & Security

- ✅ No ads
- ✅ No trackers
- ✅ No analytics
- ✅ No data collection
- ✅ All data stored locally in browser
- ✅ No backend server required

## Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Other Platforms

The app is a static Next.js application and can be deployed to:
- Netlify
- GitHub Pages
- AWS Amplify
- Any static hosting service

## Development

### Running Tests

```bash
npm run test
```

### Building for Production

```bash
npm run build
npm start
```

### Code Quality

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting

## Known Limitations

- YouTube Live chat requires the stream to be live
- Some YouTube channels may have chat disabled
- Twitch chat requires the channel to be live or have VOD chat enabled
- Cross-origin restrictions may apply in some environments

## Future Enhancements

- [ ] Picture-in-picture support
- [ ] Stream quality selection
- [ ] Custom themes
- [ ] Stream notifications
- [ ] Favorites/bookmarks
- [ ] Multi-stream view
- [ ] Stream recording
- [ ] Chat history

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Stream Theater** - Cinematic livestream viewing experience 🎬
