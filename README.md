# Final Milestone (3): NFT Store API

**Group 11 - Members:**

- Adalton de Sena Almeida Filho - 12542435
- Daniel Henrique lelis de Almeida - 12543822
- Rafael Zimmer - 12542612

## Project Report

For this milestone, we have implemented the server-side functionality of our application and fixed some issues of previous Milestone. The focus was on developing
database and integrating it with the frontend.

### Description

Our application is a NFT company that releases various "concept" collections for customers to purchase. The server-side
functionalities include adding NFTs to the store, managing users, controlling market content and collections management. We used **MongoDB** as our database.

### Implemented Functionality

1. User Registration and Authentication:

    - Customers can create an account by providing their name, email address, password, and wallet address.
    - Administrators can create new users, including other administrators, and manage existing users.
    - User credentials are stored locally by **MongoBD**. We created a script to fill the database.

2. Collection Management:

    - Administrators can create, update, and delete collections.
    - Each collection includes details such as name, description, picture, release date, and closing date.
    - Computed information such as total items, items sold, and sold value is also displayed.

3. Collection Items:

    - Administrators can manage the items within each collection, defining their names, prices, and blockchain
      addresses.

4. Buying Items:

    - Customers can add available NFTs to their cart and proceed to the checkout phase.
    - At checkout, customers can choose to pay with crypto, where a payment address is provided, or pay with a credit
      card
      by entering their card information.
    - Upon successful payment, customers are redirected to a success page, and the selected NFTs become unavailable.

### Test Plan

Falta descrever

### Test Results

Falta descrever

### Build Procedure

To run the server-side of the application, follow these steps:

1. Make sure you have MongoDB and Node.Js installed on your machine.
2. Open a terminal or command prompt and navigate to the project directory.
3. Install the project dependencies by running the following command:
   ```
   npm i
   ```
4. Start the development server for the client-side application by running the following command:
   ```
   npm run dev
   ```
   This will launch the application in development mode, and you can access it by
   opening [http://localhost:5173](http://localhost:5173) in your browser.
   The development server automatically reloads the page if you make any edits to the source code.
5. To run the tests for the application, you can use the following command: [REVISAR]
   ```
   npm test
   ```
   This will launch the test runner in interactive watch mode, allowing you to see the test results and re-run them as
   needed.
6. If you want to build the application for production, you can use the following command:
   ```
   npm run build
   ```
   This will create an optimized production build of the application in the `build` folder.


## Running the API

To start a single API instance locally, simply run 
```npm run start```
### To start the fileserver, run: `http-server ./content/nft/`



To debug the API for development, run
```npm run watch```,
this will allow all changes to be reflected instantly.

### Learn More

To learn more about React, you can refer to the official React documentation (https://reactjs.org/) for further
information.

## Comments

- 
