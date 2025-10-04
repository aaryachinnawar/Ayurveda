# AyurVeda Demo Setup Guide

## Quick Setup Checklist

### 1. Database Setup
```sql
-- Create database
CREATE DATABASE form;
USE form;

-- The application will auto-create tables on startup
```

### 2. Backend Setup
```bash
cd backend/backend
./mvnw clean install
./mvnw spring-boot:run
```
**Verify**: Backend should start on `http://localhost:8080`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
**Verify**: Frontend should start on `http://localhost:5173`

### 4. Demo User Setup
The system should have these demo users (create via admin panel):
- **Super Admin**: admin@ayurveda.com / admin123
- **College Admin**: college@ayurveda.com / college123  
- **Regular User**: user@ayurveda.com / user123

### 5. Sample Data Files
- `sample_data_basic.csv` - For initial CSV upload demo
- `sample_data_comprehensive.csv` - For advanced analytics demo

### 6. Pre-Demo Testing
- [ ] Backend API endpoints respond
- [ ] Frontend loads without errors
- [ ] Login works with demo credentials
- [ ] CSV upload functionality works
- [ ] Charts render properly
- [ ] Export features work
- [ ] Admin panel accessible

### 7. Browser Preparation
- Clear browser cache
- Open Developer Tools (F12)
- Have sample CSV files ready on desktop
- Test all routes: `/spline`, `/login`, `/admin`, `/upload`, `/reports`

### 8. Demo Environment
- **Screen Resolution**: 1920x1080 recommended
- **Browser**: Chrome/Firefox latest version
- **Network**: Stable internet connection
- **Backup**: Have screenshots ready in case of issues

## Troubleshooting

### Common Issues:
1. **Port 8080 in use**: Change backend port in `application.properties`
2. **Port 5173 in use**: Vite will auto-assign next available port
3. **Database connection failed**: Check MySQL service and credentials
4. **CORS errors**: Backend should handle CORS automatically
5. **JWT token issues**: Clear localStorage and re-login

### Emergency Backup Plan:
- Have screenshots of key features
- Prepare video recordings of functionality
- Keep API documentation handy
- Have alternative demo scenarios ready

## Demo Flow Summary
1. **Landing Page** (2 min) - Show 3D animations and features
2. **Authentication** (3 min) - Login and role management
3. **CSV Upload** (4 min) - Data processing and filtering
4. **Analytics** (5 min) - Charts and visualizations
5. **Technical Features** (3 min) - Security and responsiveness
6. **Real-world Scenario** (3 min) - Complete workflow
7. **Q&A** (5 min) - Address questions

**Total Time**: 25 minutes 