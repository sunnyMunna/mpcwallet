
# Multi-Party Computation (MPC) Wallet Service

Welcome to the Multi-Party Computation (MPC) Wallet Service repository! This repository contains a Node.js application that demonstrates the principles of secure wallet management using MPC technology. By distributing cryptographic secrets across multiple parties, MPC wallets enhance security and collaboration.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Running the Code Locally](#running-the-code-locally)
- [Dockerization](#dockerization)
- [Deployment and Scaling](#deployment-and-scaling)
- [Further Exploration](#further-exploration)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your system.

## Getting Started

To get started with this MPC wallet service, follow these steps:

1. Clone this repository to your local machine:   
   git clone https://github.com/your-username/mpc-wallet-service.git
   cd mpc-wallet-service
2. Install the necessary Node.js dependencies: npm install

## API Endpoints
This MPC wallet service exposes the following API endpoints:

POST /createWallet: Generates a new Ethereum wallet and returns its address, secret key, and mnemonic phrase.

POST /generateShares: Generates shares from a secret key using MPC principles and returns the shares.

POST /reconstructSecret: Reconstructs the secret key from a subset of shares using MPC techniques.

## Running the Code Locally
To run the code locally, use the following command:npm start
The MPC wallet service will be accessible at http://localhost:3000.

## Dockerization
We provide Docker support for easy deployment. You can find pre-built Docker images in our Docker Repository.
https://hub.docker.com/r/sunnyac/mpc-wallet-service

## Deployment and Scaling
Deploy the MPC wallet service to your preferred cloud platform to make it accessible to users. Scaling can be achieved to accommodate increased demand.


## Contributing
Contributions are welcome! Feel free to open issues or submit pull requests to improve this MPC wallet service.

## License
This project is licensed under the MIT License.
