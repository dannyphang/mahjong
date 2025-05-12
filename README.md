# Mahjong V2

A web application that allows players to enjoy a free, online version of a three-player Malaysian-style Mahjong game.

## Features

- **Multiplayer Gameplay**: Play with friends or other players in real-time.
- **Malaysian Style Rules**: Implements the specific rules of the Malaysian version of Mahjong for an authentic experience.
- **Responsive Design**: Optimized for various devices, providing a seamless experience on desktop and mobile.
- **Real-Time Synchronization**: Ensures smooth gameplay through real-time communication.
- **User-Friendly Interface**: Intuitive design and layout for ease of play.

## Technologies Used

- **Frontend**: Angular framework with TypeScript, HTML, SCSS, and CSS.
- **Real-Time Communication**: Likely uses WebSocket or similar technology for multiplayer synchronization.
- **Styling**: SCSS and CSS for a clean and responsive user interface.
- **JavaScript**: For additional dynamic functionality.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher recommended)
- Angular CLI (version 14.1.0 or higher)

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/dannyphang/mahjong-v2.git
    cd mahjong-v2
    ```
2. Navigate to the `client` folder:
    ```bash
    cd client
    ```
3. Install dependencies:
    ```bash
    npm install
    ```

### Development Server

Run the development server:
```bash
ng serve
```
Navigate to http://localhost:4200/. The application will automatically reload if you change any source files.

## Build
To build the project for production:
```bash
ng build
```
The build artifacts will be stored in the dist/ directory.

## Testing

### Unit Tests
Run the following command to execute unit tests via [Karma](https://karma-runner.github.io):
```bash
ng test
```

## End-to-End Tests
Run the following command to execute end-to-end tests:
```bash
ng e2e
```
Ensure you have installed a package that implements end-to-end testing.

## Contributing
Contributions are welcome! Feel free to open issues or submit pull requests to improve the project.

## License
This project is licensed under the [MIT License](https://github.com/dannyphang/mahjong-v2/new/LICENSE).

## Acknowledgments
- This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.1.0.
- Special thanks to contributors and players for their support.
