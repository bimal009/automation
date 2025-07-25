# Twitter Automation Platform

A powerful Twitter automation platform built with Next.js that enables users to schedule tweets, generate AI-powered content, and manage their Twitter presence efficiently.

## 🚀 Features

- **🤖 AI-Powered Content Generation**: Generate engaging tweets using Google's Generative AI
- **⏰ Automated Tweet Scheduling**: Schedule tweets with cron jobs for optimal timing
- **✍️ Manual Tweet Posting**: Create and post tweets instantly
- **📊 Dashboard Interface**: Intuitive dashboard for managing all automation tasks
- **🔐 Secure Authentication**: User authentication powered by NextAuth
- **🗄️ Database Integration**: MongoDB with Prisma ORM for robust data management
- **🔄 Twitter API Integration**: Direct integration with Twitter API v2
- **📱 Responsive Design**: Modern, mobile-friendly interface built with TailwindCSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: TailwindCSS, Lucide React Icons
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Prisma ORM
- **Authentication**: NextAuth.js
- **AI Integration**: Google Generative AI
- **Social Media**: Twitter API v2
- **Task Scheduling**: Node-cron
- **Data Fetching**: TanStack React Query

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- MongoDB database (local or cloud)
- Twitter Developer Account with API keys
- Google AI API key

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd automation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   
   # Twitter API
   TWITTER_API_KEY=your_twitter_api_key
   TWITTER_API_SECRET=your_twitter_api_secret
   TWITTER_ACCESS_TOKEN=your_twitter_access_token
   TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret
   
   # Google AI
   GOOGLE_AI_API_KEY=your_google_ai_api_key
   ```

4. **Initialize the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Twitter API Setup
1. Create a Twitter Developer account
2. Create a new app in the Twitter Developer Portal
3. Generate API keys and access tokens
4. Add the credentials to your `.env.local` file

### Google AI Setup
1. Visit the Google AI Studio
2. Create an API key
3. Add the key to your `.env.local` file

### MongoDB Setup
1. Set up a MongoDB database (local or MongoDB Atlas)
2. Add the connection string to your `.env.local` file

## 📖 Usage

### Dashboard
Access the main dashboard at `/` to:
- View scheduled tweets
- Monitor automation status
- Manage tweet campaigns

### Manual Tweeting
- Navigate to `/manual-tweet`
- Compose your tweet
- Post immediately to Twitter

### Auto Tweeting
- Set up automated tweet schedules
- Configure content generation parameters
- Monitor scheduled posts

### Content Generation
- Use AI-powered content generation
- Customize tone and style
- Generate multiple variations

## 🔗 API Endpoints

### Tweet Management
- `POST /api/manual-tweet` - Post a tweet manually
- `POST /api/auto-tweet` - Schedule automated tweets
- `GET /api/test-generation` - Generate AI content

### Authentication
- Handled automatically by NextAuth.js

## 🗂️ Project Structure

```
automation/
├── app/
│   ├── (root)/          # Main application pages
│   ├── api/             # API routes
│   │   ├── auto-tweet/  # Automated tweeting
│   │   ├── manual-tweet/# Manual tweeting
│   │   └── test-generation/ # AI content generation
│   └── layout.tsx       # Root layout
├── components/          # Reusable React components
├── lib/                 # Utility functions and configurations
├── prisma/             # Database schema and migrations
├── public/             # Static assets
└── types/              # TypeScript type definitions
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🐛 Troubleshooting

### Common Issues

**Database Connection**
- Ensure MongoDB is running and accessible
- Check your connection string format

**Twitter API Errors**
- Verify API keys and permissions
- Check rate limits

**Environment Variables**
- Ensure all required variables are set
- Restart the development server after changes

## 📄 License

This project is private and proprietary.

## 🔮 Future Enhancements

- [ ] Advanced analytics and reporting
- [ ] Multi-account management
- [ ] Content calendar visualization
- [ ] Advanced AI prompt customization
- [ ] Integration with other social platforms

---

**Made with ❤️ using Next.js and modern web technologies**
