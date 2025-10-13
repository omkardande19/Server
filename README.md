# ArtistKatta

A Next.js application for artists and creative professionals.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Access to an EC2 server (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/omkardande19/artistkatta.git
   cd artistkatta
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   
   Copy the example environment file:
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and update with your actual values:
   ```bash
   # Your EC2 server's public IP or DNS name
   NEXT_PUBLIC_SITE_URL=http://your-ec2-public-ip:3000
   
   # Backend API URL
   NEXT_PUBLIC_API_URL=http://your-ec2-public-ip:5000
   
   # Supabase Configuration (if using)
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   
   # AWS Amplify Configuration (if using)
   NEXT_PUBLIC_AMPLIFY_REGION=your-region
   NEXT_PUBLIC_AMPLIFY_USER_POOL_ID=your-user-pool-id
   NEXT_PUBLIC_AMPLIFY_USER_POOL_CLIENT_ID=your-client-id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://0.0.0.0:3000` (accessible from your network)

5. **Build for production**
   ```bash
   npm run build
   npm run start
   ```

## 🌐 EC2 Deployment

**✅ Yes, this application is fully configured for EC2 deployment!**

For a complete step-by-step EC2 deployment guide, see **[EC2_DEPLOYMENT_GUIDE.md](./EC2_DEPLOYMENT_GUIDE.md)**

### Quick Start on EC2

1. **Launch EC2 instance** (Amazon Linux 2 or Ubuntu, t2.medium+)
2. **Configure Security Groups** (ports 22, 80, 443, 3000, 5000)
3. **SSH into instance**:
   ```bash
   ssh -i your-key.pem ec2-user@your-ec2-public-ip
   ```
4. **Install Node.js & dependencies**:
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   source ~/.bashrc
   nvm install --lts
   npm install -g pm2
   ```
5. **Clone and setup**:
   ```bash
   git clone https://github.com/omkardande19/artistkatta.git
   cd artistkatta
   npm install
   cp env.example .env.local
   nano .env.local  # Update with your EC2 IP
   ```
6. **Build and start**:
   ```bash
   npm run build
   pm2 start npm --name "artistkatta" -- start
   pm2 save
   pm2 startup
   ```

### Access Your Application

- **Local development**: `http://localhost:3000`
- **EC2 deployment**: `http://YOUR_EC2_PUBLIC_IP:3000`
- **With Nginx**: `http://YOUR_EC2_PUBLIC_IP` or `https://your-domain.com`

📖 **See [EC2_DEPLOYMENT_GUIDE.md](./EC2_DEPLOYMENT_GUIDE.md) for:**
- Detailed EC2 setup instructions
- Nginx reverse proxy configuration
- SSL/HTTPS setup with Let's Encrypt
- PM2 process management
- Security best practices
- Troubleshooting guide

## 📝 Available Scripts

- `npm run dev` - Start development server (accessible on all network interfaces)
- `npm run build` - Build the application for production
- `npm run start` - Start production server (serves static files)
- `npm run lint` - Run ESLint
- `npm run clean` - Clean build artifacts
- `npm run export` - Export static site
- `npm run deploy` - Deploy to AWS S3

## 🛠️ Tech Stack

- **Framework**: Next.js 14.2.16
- **React**: 18
- **UI Components**: Radix UI
- **Styling**: Tailwind CSS
- **Authentication**: AWS Amplify & Supabase
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **Validation**: Zod

## 📁 Project Structure

```
artistkatta/
├── app/                    # Next.js app directory
│   ├── activity/          # Activity pages
│   ├── auth/              # Authentication routes
│   ├── category/          # Category pages
│   ├── community/         # Community features
│   ├── dashboard/         # Dashboard
│   ├── jobs/              # Job listings
│   ├── login/             # Login page
│   ├── messages/          # Messaging
│   ├── network/           # Networking features
│   ├── profile/           # User profiles
│   └── ...
├── components/            # Reusable components
│   ├── auth/             # Auth components
│   ├── forms/            # Form components
│   ├── ui/               # UI components
│   └── ...
├── lib/                   # Utility functions
│   ├── api.ts            # API client
│   ├── auth.ts           # Auth utilities
│   ├── supabase.ts       # Supabase client
│   └── ...
├── public/               # Static assets
├── styles/               # Global styles
├── env.example           # Environment variables example
└── ...
```

## 🔒 Security Notes

- **Never commit `.env.local`** - It's already in `.gitignore`
- Use strong passwords and secure API keys
- For production, always use HTTPS
- Keep dependencies updated: `npm audit` and `npm update`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 📧 Contact

For questions or support, please contact the development team.

---

**Note**: Make sure to configure all environment variables before deploying to production. See `env.example` for all required variables.

