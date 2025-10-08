# WasteWise - Intelligent Waste Management Platform

## Overview
WasteWise is a comprehensive web application designed to promote circular economies through intelligent waste management. The platform connects households, businesses, delivery personnel, administrators, and suppliers in a unified ecosystem that transforms waste from a problem into a valuable resource.

## Features

### Multi-Role Dashboard
- **User/Customer**: Book waste pickups with Uber-like interface, track history, earn points
- **Delivery Personnel**: Manage pickup orders, track earnings, view live orders on map
- **Admin**: Monitor system-wide statistics, generate reports, manage users
- **Supplier/Recycler**: Browse available waste inventory, place requests for repurposing

### Core Functionality
- Interactive maps for pickup locations using Leaflet
- Photo upload and posting system for waste rewards
- Real-time order tracking and status updates
- Points-based reward system
- Comprehensive reporting and analytics
- Local storage for data persistence

### Waste Types Supported
- Plastic waste
- Kitchen and food waste
- E-waste (electronic devices)
- Construction waste
- Bulk waste from restaurants and events

## Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Mapping**: Leaflet.js with OpenStreetMap tiles
- **Icons**: Font Awesome 6
- **Styling**: Custom CSS with responsive design
- **Data Storage**: Browser localStorage (for demo purposes)

## Installation & Setup

### Prerequisites
- Modern web browser with JavaScript enabled
- Internet connection for map tiles

### Running the Application
1. Clone or download the project files
2. Open `index.html` in your web browser
3. Select a user role from the login screen:
   - **User**: Individual waste pickup booking
   - **Customer**: Bulk waste collection for businesses
   - **Delivery**: Pickup and delivery management
   - **Admin**: System administration and reporting
   - **Supplier**: Waste inventory and recycling requests
4. Explore the various dashboards and features
5. Use the logout button to return to role selection

### File Structure
```
Waste-Managment/
├── index.html          # Main HTML file
├── index.css           # Stylesheet
├── index.js            # JavaScript functionality
├── README.md           # Project documentation
└── TODO.md            # Development tasks
```

## Key Components

### User Interface
- Responsive design that works on desktop and mobile
- Smooth animations and transitions
- Intuitive navigation between different views
- Form validation and user feedback

### Data Management
- Mock data for demonstration
- Local storage for persistence across sessions
- Dynamic content loading and updates

### Maps Integration
- Interactive maps for location selection
- Marker placement and dragging
- Order visualization on delivery maps

## Hackathon Highlights
- **Circular Economy Focus**: Addresses real-world waste management challenges
- **Multi-Stakeholder Platform**: Serves all participants in the waste ecosystem
- **User-Centric Design**: Intuitive interfaces inspired by popular apps (Uber, Blinkit)
- **Scalable Architecture**: Modular code structure for easy expansion
- **Sustainability Impact**: Promotes waste reduction and resource recovery

## Future Enhancements
- Backend API integration
- Real database storage
- User authentication system
- Mobile app development
- AI-powered waste sorting assistance
- Integration with recycling facilities

## Contributing
This project was developed for a hackathon demonstration. Feel free to fork and enhance with additional features.

## License
© 2025 WasteWise. All rights reserved.
