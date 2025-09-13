# AI Character Chat Web App

A modern web application that allows users to create and chat with AI-powered characters using Chrome's experimental Prompt API.

## Features

- **Character Creation**: Define custom AI characters with names and backgrounds
- **Real-time Chat**: Interactive conversations with AI characters
- **Local Storage**: Persistent character data and chat history
- **Chrome AI Integration**: Leverages Chrome's Prompt API for natural language responses
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Error Handling**: Graceful handling of API availability and errors

## Prerequisites

- **Chrome Browser** (required for AI features)
- **Chrome AI Features Enabled**:
  - Go to `chrome://flags/#prompt-api-for-gemini-nano`
  - Enable the "Prompt API for Gemini Nano" flag
  - Restart Chrome

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/century909/iachatchromeapi.git
cd iachatchromeapi
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in Chrome

### Usage

1. **Create Character**: Enter your character's name and background story
2. **Start Chatting**: Send messages and receive AI-powered responses
3. **Persistent Data**: Your character and conversation history are saved locally

## Tech Stack

- **Frontend**: React 18 with Hooks
- **Build Tool**: Vite
- **AI**: Chrome's Prompt API
- **Styling**: Custom CSS with responsive design
- **Storage**: Browser Local Storage

## Project Structure

```
src/
├── App.jsx          # Main application component
├── App.css          # Application styles
├── main.jsx         # Application entry point
└── index.css        # Global styles
```

## API Integration

The app uses Chrome's experimental Prompt API:
- `window.ai.languageModel.create()` - Creates AI model instance
- `model.prompt()` - Generates responses based on character context

## Browser Support

- **Chrome** (recommended) - Full AI functionality
- **Other browsers** - Basic chat interface (AI features unavailable)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test in Chrome
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Disclaimer

This application uses experimental Chrome AI features that may change or be discontinued. Ensure you have the latest version of Chrome for optimal functionality.
