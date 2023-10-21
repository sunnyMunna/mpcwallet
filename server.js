const express = require('express');
const bigInt = require('big-integer');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const ethers = require('ethers'); // You'll need to install this package


const app = express();
const PORT = 8080;

app.use(bodyParser.json());




// Function to generate a random prime number of a given bit length
function generatePrime(bits) {
  let prime;
  do {
    prime = bigInt(crypto.randomBytes(bits).toString('hex'), 16);
  } while (!prime.isPrime());
  return prime;
}

// Function to generate random coefficients for the polynomial
function generateCoefficients(secret, numShares, prime) {
  const coefficients = [bigInt(secret, 16)];
  for (let i = 1; i < numShares; i++) {
    coefficients.push(bigInt.randBetween(1, prime));
  }
  return coefficients;
}

// Function to evaluate the polynomial at a given x
function evaluatePolynomial(coefficients, x, prime) {
  let result = bigInt(0);
  for (let i = 0; i < coefficients.length; i++) {
    result = result.add(coefficients[i].multiply(x.modPow(bigInt(i), prime)).mod(prime)).mod(prime);
  }
  return result;
}

app.post('/createShares', (req, res) => {
  const { secretKey, numShares, threshold } = req.body;

  if (!secretKey || !numShares || !threshold) {
    return res.status(400).send({ error: 'Missing required parameters.' });
  }
  if (!/^([a-fA-F0-9]+)$/.test(secretKey)) {
    return res.status(400).send({ error: 'Invalid secretKey. Ensure it is a valid hexadecimal string.' });
}


  const primeBits = 64;
  const prime = generatePrime(primeBits);
  const coefficients = generateCoefficients(secretKey, threshold, prime);
  const shares = [];

  for (let i = 1; i <= numShares; i++) {
    const x = bigInt(i);
    const y = evaluatePolynomial(coefficients, x, prime);
    shares.push({ x: x.toString(10), y: y.toString(16) });
  }

  res.send({ shares,threshold:threshold, prime: prime.toString() });
});

//CreateAccount API
app.get('/createWallet', (req,res) => {
    try {
        const wallet = ethers.Wallet.createRandom();
        const address = wallet.address;
        const secretKeyWithPrefix = wallet.privateKey;
        //const secretKey = wallet.privateKey;
        const mnemonic = wallet.mnemonic.phrase;
        const secretKey = secretKeyWithPrefix.startsWith('0x') ? secretKeyWithPrefix.slice(2) : secretKeyWithPrefix;


        res.json({
            address,
            secretKey,
            mnemonic
        });
    } catch (error) {
        res.status(500).send({ error: 'Application error occurred while creating account.' });
    }
});

// Function to reconstruct the secret from a subset of shares
function reconstructSecret(shares, prime) {
    let secret = bigInt(0);
    for (let i = 0; i < shares.length; i++) {
        let term = bigInt(shares[i].y, 16);
        for (let j = 0; j < shares.length; j++) {
            if (i !== j) {
                const xj = bigInt(shares[j].x, 10);
                const xi = bigInt(shares[i].x, 10);
                term = term.multiply(xj).multiply(xj.minus(xi).modInv(prime)).mod(prime);
            }
        }
        secret = secret.add(term).mod(prime);
    }
    return secret.toString(16);
}

// assemblePK API
app.post('/recoverSecret', (req, res) => {
    try {
        const { shares, threshold, prime } = req.body;

        // Validate the inputs
        if (!shares || !Array.isArray(shares) || shares.length < threshold) {
            throw new Error('Invalid or insufficient shares provided.');
        }
        if (!prime || typeof prime !== 'string') {
            throw new Error('Invalid prime value.');
        }

        const secretKey = reconstructSecret(shares, bigInt(prime));

        res.json({
            secretKey
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
