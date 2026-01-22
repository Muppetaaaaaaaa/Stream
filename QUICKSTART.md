# Stream Theater - Quick Start Guide

## 🚀 Installation (2 minutes)

```bash
# 1. Navigate to project directory
cd stream-theater

# 2. Install dependencies
npm install
# or
bun install

# 3. Start development server
npm run dev
# or
bun dev

# 4. Open in browser
# http://localhost:3000
```

## 📺 Loading Your First Stream

### Option 1: Paste a URL
1. Copy a Twitch or YouTube URL
2. Paste into the input field
3. Click "Load Stream"

**Supported URLs:**
- `https://twitch.tv/channelname`
- `https://youtube.com/@channelname`
- `https://youtube.com/c/channelname`
- `https://youtube.com/channel/UCxxxxx`

### Option 2: Enter Channel Name
1. Type a channel name
2. For Twitch: just type `channelname`
3. For YouTube: type `@channelname`
4. Click "Load Stream"

## ⌨️ Essential Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `T` | Toggle chat |
| `C` | Cinema mode |
| `Esc` | Close stream |
| `S` | Small size |
| `M` | Medium size |
| `L` | Large size |

## 🎬 Features at a Glance

### Theater Mode
- Cinematic viewing experience
- Minimal distractions
- Dark theme optimized for viewing

### Live Chat
- Toggle chat on/off with smooth animation
- Twitch chat embed
- YouTube chat link

### Video Sizes
- **Small**: Compact viewing
- **Medium**: Balanced view
- **Large**: Immersive viewing
- **Fullscreen**: Cinema mode

### Cinema Mode
- Hides all UI except player
- Press `C` to toggle
- Perfect for immersive viewing

## 💾 Your Settings Are Saved

The app automatically remembers:
- Last stream you watched
- Chat visibility preference
- Video size preference
- All other settings

Just close and reopen the app - your settings will be restored!

## 🎯 Pro Tips

1. **Quick Resume**: Click "Resume [Channel]" to quickly load your last stream
2. **Platform Detection**: The app shows a badge indicating detected platform
3. **Hover Controls**: Hover over the video to see size and close buttons
4. **Mobile Friendly**: Works great on phones and tablets
5. **No Ads**: Enjoy uninterrupted viewing

## 🆘 Troubleshooting

### Stream won't load
- Check that the channel name is correct
- Make sure the stream is live (or has VOD chat enabled for Twitch)
- Try refreshing the page

### Chat not showing
- Press `T` to toggle chat visibility
- YouTube chat only works when stream is live
- Twitch chat requires the channel to be live or have VOD chat enabled

### Keyboard shortcuts not working
- Make sure you're not typing in an input field
- Try clicking elsewhere on the page first
- Check that Caps Lock is off

### App not loading
- Clear browser cache
- Try a different browser
- Check that you're using a modern browser (Chrome, Firefox, Safari, Edge)

## 📱 Mobile Usage

Stream Theater works great on mobile:
1. Load a stream
2. Tap the video to show controls
3. Tap "Show Chat" to toggle chat panel
4. Use landscape mode for better viewing
5. All keyboard shortcuts work on mobile keyboards

## 🔧 Development

### Project Structure
```
components/     - React components
hooks/          - Custom React hooks
lib/            - Utilities and types
app/            - Next.js app directory
public/         - Static assets
```

### Key Files
- `app/page.tsx` - Main page component
- `hooks/useStreamTheater.ts` - State management
- `lib/stream-parser.ts` - URL parsing logic
- `components/VideoPlayer.tsx` - Video player
- `components/ChatPanel.tsx` - Chat panel

### Building for Production
```bash
npm run build
npm start
```

## 📚 Documentation

- **README.md** - Full documentation
- **FEATURES.md** - Complete feature list
- **QUICKSTART.md** - This file

## 🎨 Customization

The app uses Tailwind CSS and shadcn/ui components. To customize:

1. **Colors**: Edit `app/globals.css` for color variables
2. **Fonts**: Edit `app/layout.tsx` for font imports
3. **Components**: Edit files in `components/` directory
4. **Styling**: Use Tailwind classes in component files

## 🚀 Deployment

### Deploy to Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Deploy to Other Platforms
- Netlify
- GitHub Pages
- AWS Amplify
- Any static hosting

## 📞 Support

For issues or questions:
1. Check the README.md
2. Check the FEATURES.md
3. Review the code comments
4. Open an issue on GitHub

---

**Enjoy your cinematic livestream experience!** 🎬
